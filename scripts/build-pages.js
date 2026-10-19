/*
  Builds real, crawlable URLs from site-template.html (the single source of truth).
  GitHub Pages serves /services/ -> services/index.html etc., each with its
  own <title>, meta description, canonical URL and only its own page section.
  Also compiles site.css (Tailwind) so the browser doesn't run Tailwind itself.
  Run after editing site-template.html:  node scripts/build-pages.js
*/
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE = 'https://definedglass.com';
const PAGES = {
  home: {
    dir: '',
    title: 'Defined Glass Creations | Custom Glass & Mirror | NJ, PA, NY',
    desc: 'Defined Glass Creations is a full-service glass company in Howell, NJ. Frameless shower doors, custom mirrors, glass railings, office partitions, and commercial storefronts across NJ, PA & NY. Licensed & insured since 2017. Free estimates: (732) 708-2580.',
  },
  services: {
    dir: 'services',
    title: 'Glass Services | Shower Doors, Mirrors, Railings, Storefronts | Defined Glass',
    desc: 'Residential and commercial glass services: frameless shower enclosures, custom mirrors, glass railings, office partitions, storefronts and curtain wall systems. Serving NJ, PA & NY.',
  },
  gallery: {
    dir: 'gallery',
    title: 'Project Gallery | Defined Glass Creations',
    desc: 'Browse completed glass projects: frameless showers, custom mirrors, glass railings, office partitions and storefront installations across New Jersey, Pennsylvania and New York.',
  },
  about: {
    dir: 'about',
    title: 'About Us | Defined Glass Creations - Howell, NJ',
    desc: 'Defined Glass Creations is a licensed and insured glass company based in Howell, NJ since 2017, serving homeowners, general contractors and developers across NJ, PA and NY.',
  },
  contact: {
    dir: 'contact',
    title: 'Contact Defined Glass Creations | Howell, NJ Showroom',
    desc: 'Contact Defined Glass Creations for a free estimate. Showroom at 1179 Lakewood Farmingdale Rd, Howell, NJ. Call (732) 708-2580 or email info@definedglass.com.',
  },
  quote: {
    dir: 'quote',
    title: 'Get A Free Quote | Defined Glass Creations',
    desc: 'Get a free, no-obligation quote for your glass project - showers, mirrors, railings, partitions, storefronts. Serving NJ, PA & NY. Usually within 24 hours.',
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
let master = fs.readFileSync('site-template.html', 'utf8')
  .replace(/\r?\n<!-- Master template[^>]*-->/, '');

// Keep only one page section; the other pages live at their own URLs
const SECTION_RE = /<div id="page-([a-z]+)" [^>]*class="page-section[^"]*">[\s\S]*?\r?\n<\/div>\r?\n/g;
function onlySection(html, slug) {
  let kept = 0;
  const out = html.replace(SECTION_RE, (block, name) => {
    if (name !== slug) return '';
    kept++;
    return block.replace(/class="page-section[^"]*"/, 'class="page-section active"');
  });
  if (kept !== 1) throw new Error(`page-${slug} section not found`);
  return out;
}

for (const [slug, p] of Object.entries(PAGES)) {
  let html = master;
  const url = p.dir ? `${BASE}/${p.dir}/` : `${BASE}/`;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(p.desc)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(p.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(p.desc)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/window\.INITIAL_PAGE = '[a-z]+';/, `window.INITIAL_PAGE = '${slug}';`);
  html = onlySection(html, slug);
  const file = p.dir ? path.join(p.dir, 'index.html') : 'index.html';
  if (p.dir) fs.mkdirSync(p.dir, { recursive: true });
  fs.writeFileSync(file, html);
  console.log(`wrote ${file}`);
  // Unknown paths show the home page
  if (slug === 'home') { fs.writeFileSync('404.html', html); console.log('wrote 404.html'); }
}

execSync('npx --yes tailwindcss@3.4.17 -c scripts/tailwind.site.config.js -i scripts/site.tailwind.css -o site.css --minify', { stdio: 'inherit' });
console.log('wrote site.css');
