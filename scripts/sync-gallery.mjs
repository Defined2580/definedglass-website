/*
  Defined Glass Creations - Gallery Sync (cloud edition)
  Replaces sync-gallery.ps1 / Windows Task Scheduler.

  Runs in GitHub Actions on a schedule. Pulls photos from the SharePoint
  "New Pictures 2026" folder via Microsoft Graph, watermarks them (hexagon
  logo, 22% opacity, bottom-right), resizes for the web, builds thumbnails,
  rebuilds gallery-config.js. The workflow commits any changes.

  Safety defaults:
    - ADD-ONLY: photos removed from SharePoint are NOT removed from the site
      unless the ALLOW_DELETE repo variable is set to "true".
    - DRY_RUN=true logs what would change without writing files.

  Required repo secrets:  MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET
  Optional repo variables: SHAREPOINT_HOST, SHAREPOINT_SITE_PATH,
                           BASE_FOLDER, ALLOW_DELETE, DRY_RUN
  See SWEEP-SETUP.md for setup steps.
*/
import fs from 'node:fs';
import path from 'node:path';

const {
  MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET,
  SHAREPOINT_HOST = 'definedglass.sharepoint.com',
  SHAREPOINT_SITE_PATH = '/sites/Public',
  DRIVE_NAME = 'Documents',
  BASE_FOLDER = 'New Pictures 2026',
  ALLOW_DELETE = 'false',
  DRY_RUN = 'false',
} = process.env;

const dryRun = DRY_RUN === 'true';
const allowDelete = ALLOW_DELETE === 'true';

const CATEGORIES = [
  { src: 'Shower Doors',       dest: 'shower-doors', prefix: 'showerdoor', cat: 'shower'   },
  { src: 'Glass Railing',      dest: 'railings',     prefix: 'railing',    cat: 'railing'  },
  { src: 'Office Partitions',  dest: 'office',       prefix: 'office',     cat: 'office'   },
  { src: 'Exterior Solutions', dest: 'exterior',     prefix: 'exterior',   cat: 'exterior' },
  { src: 'Mirrors',            dest: 'mirrors',      prefix: 'mirror',     cat: 'mirror'   },
];

const MANIFEST_PATH = 'gallery-sync-manifest.json';
const WATERMARK = fs.existsSync('public/favicon.svg') ? 'public/favicon.svg' : 'public/logo.png';
const ALT_BY_CAT = {
  shower: 'Frameless shower door installation',
  railing: 'Custom glass railing',
  office: 'Office glass partition',
  exterior: 'Commercial glass storefront',
  mirror: 'Custom mirror installation',
};

function log(msg) { console.log(`[sync] ${msg}`); }

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: MS_CLIENT_ID,
      client_secret: MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });
  if (!res.ok) throw new Error(`token request failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Graph ${res.status}: ${url}\n${await res.text()}`);
  return res.json();
}

async function listFolder(token, driveId, folderPath) {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${encodeURI(folderPath)}:/children?$select=id,name,size,eTag,lastModifiedDateTime,file&$top=500`;
  const data = await graph(token, url);
  return (data.value || []).filter(i => i.file && /\.(jpe?g|png)$/i.test(i.name));
}

async function downloadBuf(item) {
  const url = item['@microsoft.graph.downloadUrl'];
  if (!url) throw new Error(`no download URL for ${item.name}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} for ${item.name}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processImage(buf, destPath, thumbPath) {
  const sharp = (await import('sharp')).default;
  const base = sharp(buf).rotate(); // honor EXIF orientation
  const meta = await base.metadata();
  const scale = Math.min(1, 1600 / (meta.width || 1600));
  const finalW = Math.round((meta.width || 1600) * scale);
  const finalH = Math.round((meta.height || 1200) * scale);

  // watermark: hexagon logo at 22% opacity, width 18% of photo, bottom-right, 2.5% padding
  const ww = Math.round(finalW * 0.18);
  const pad = Math.round(finalW * 0.025);
  const logo = sharp(WATERMARK, { density: 300 }).resize({ width: ww });
  const { data, info } = await logo.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * 0.22);
  const wm = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();

  const full = await base
    .resize({ width: 1600, withoutEnlargement: true })
    .composite([{ input: wm, top: finalH - info.height - pad, left: finalW - info.width - pad }])
    .jpeg({ quality: 80, progressive: true })
    .toBuffer();
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, full);

  const thumb = await sharp(full).resize({ width: 600, withoutEnlargement: true })
    .jpeg({ quality: 78, progressive: true }).toBuffer();
  fs.mkdirSync(path.dirname(thumbPath), { recursive: true });
  fs.writeFileSync(thumbPath, thumb);
}

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')); }
  catch { return { items: {} }; }
}

function rebuildConfig(manifest) {
  const groups = {};
  for (const it of Object.values(manifest.items)) {
    (groups[it.cat] ||= []).push(it);
  }
  const header = `/*
  DEFINED GLASS CREATIONS - GALLERY PHOTO LIST
  AUTO-GENERATED by scripts/sync-gallery.mjs (GitHub Actions, Sundays ~2AM ET).
  Do not edit by hand - add/remove photos in the SharePoint "New Pictures 2026"
  folder and the sweep updates this file.
*/

var GALLERY_PHOTOS = [
`;
  const catNames = { shower: 'SHOWER DOORS', mirror: 'MIRRORS', railing: 'GLASS RAILINGS', office: 'OFFICE PARTITIONS', exterior: 'EXTERIOR SOLUTIONS' };
  let body = '';
  for (const cat of ['shower', 'mirror', 'railing', 'office', 'exterior']) {
    const items = (groups[cat] || []).sort((a, b) => a.num - b.num);
    if (!items.length) continue;
    body += `\n  // -- ${catNames[cat]} --\n`;
    for (const it of items) {
      body += `  { src: '/public/images/${it.dest}/${it.prefix}-${it.num}.jpg', cat: '${it.cat}', alt: '${it.alt}' },\n`;
    }
  }
  return header + body + '\n];\n';
}

async function main() {
  if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET) {
    throw new Error('Missing MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET secrets. See SWEEP-SETUP.md.');
  }
  log(`mode: ${dryRun ? 'DRY RUN' : 'live'}${allowDelete ? ' +deletes allowed' : ' (add-only)'}`);
  const token = await getToken();
  const site = await graph(token, `https://graph.microsoft.com/v1.0/sites/${SHAREPOINT_HOST}:${SHAREPOINT_SITE_PATH}`);
  log(`site: ${site.displayName} (${site.id})`);
  const drives = await graph(token, `https://graph.microsoft.com/v1.0/sites/${site.id}/drives`);
  const drive = (drives.value || []).find(d => d.name === DRIVE_NAME) || (drives.value || [])[0];
  if (!drive) throw new Error('no document library found');
  log(`drive: ${drive.name}`);

  const manifest = loadManifest();
  const byRemoteId = manifest.items;
  let changed = false;

  for (const c of CATEGORIES) {
    const remote = await listFolder(token, drive.id, `${BASE_FOLDER}/${c.src}`);
    log(`${c.src}: ${remote.length} photo(s) in SharePoint`);
    const remoteIds = new Set(remote.map(r => r.id));

    // deletions
    for (const [rid, it] of Object.entries(byRemoteId)) {
      if (it.cat !== c.cat) continue;
      if (!remoteIds.has(rid)) {
        if (allowDelete) {
          log(`  - remove ${it.local} (gone from SharePoint)`);
          if (!dryRun) {
            fs.rmSync(it.local, { force: true });
            fs.rmSync(it.local.replace('/public/images/', '/public/images/thumbs/'), { force: true });
            delete byRemoteId[rid];
            changed = true;
          }
        } else {
          log(`  ~ kept ${it.local} (removed from SharePoint; ALLOW_DELETE=false)`);
        }
      }
    }

    // additions / updates
    const usedNums = new Set(Object.values(byRemoteId).filter(i => i.cat === c.cat).map(i => i.num));
    let nextNum = Math.max(0, ...usedNums) + 1;
    for (const item of remote) {
      const existing = byRemoteId[item.id];
      if (existing && existing.eTag === item.eTag) continue;
      const num = existing ? existing.num : nextNum++;
      const local = `public/images/${c.dest}/${c.prefix}-${num}.jpg`;
      log(`  + ${item.name} -> ${c.prefix}-${num}.jpg${existing ? ' (updated)' : ''}`);
      if (!dryRun) {
        const buf = await downloadBuf(item);
        await processImage(buf, local, local.replace('/public/images/', '/public/images/thumbs/'));
        byRemoteId[item.id] = {
          local, num, cat: c.cat, dest: c.dest, prefix: c.prefix,
          name: item.name, eTag: item.eTag, alt: ALT_BY_CAT[c.cat],
        };
        changed = true;
      }
    }
  }

  if (changed && !dryRun) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
    fs.writeFileSync('gallery-config.js', rebuildConfig(manifest));
    log('gallery-config.js rebuilt');
  } else {
    log(changed ? 'dry run complete - no files written' : 'no changes');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
