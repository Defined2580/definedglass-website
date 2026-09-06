/*
  Builds real, crawlable URLs from index.html (the single source of truth).
  GitHub Pages serves /services/ -> services/index.html etc., each with its
  own <title>, meta description, canonical URL and initial view.
  Run after editing index.html:  node scripts/build-pages.js
*/
const fs = require('fs');
const path = require('path');

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
let master = fs.readFileSync('index.html', 'utf8');

// home values currently in master (anchors for replacement)
const home = PAGES.home;

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
  if (slug === 'home') continue; // master itself is home
  fs.mkdirSync(p.dir, { recursive: true });
  fs.writeFileSync(path.join(p.dir, 'index.html'), html);
  console.log(`wrote ${p.dir}/index.html`);
}
// SPA fallback: unknown paths render the home page
fs.writeFileSync('404.html', master);
console.log('wrote 404.html');
