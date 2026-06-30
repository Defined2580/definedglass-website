# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint via next lint
```

There is no test suite.

## Architecture

**Next.js 15 App Router** site for Defined Glass Creations (Howell, NJ glass company). All pages live under `src/app/` as `page.tsx` files. Two shared components wrap every page via `src/app/layout.tsx`: `Header` (client component — handles scroll state and mobile menu) and `Footer` (server component).

**Pages:**
- `/` — Home: hero, services overview, values, gallery preview, CTA
- `/services` — Full service listings split into Residential and Commercial sections
- `/gallery` — Filterable photo grid with category tabs (client component)
- `/about` — Company story, core values, service area
- `/contact` — Contact info + server action form (email stubbed out)
- `/quote` — Embeds the Smart Glazier iframe configurator (`webusd.smartglazier.com`)

## Brand & Styling

**Tailwind** (`tailwind.config.ts`) extends the default theme with:

| Token | Value | Usage |
|---|---|---|
| `teal` / `teal-dark` | `#3d9e96` / `#2d7870` | Primary brand color, buttons, accents |
| `teal-light` | `#a8dadc` | Light accents on dark backgrounds |
| `brand-blue` | `#00adef` | Commercial section labels only |
| `brand-dark` | `#3d3d3d` | Body text |
| `brand-charcoal` | `#1e1e1e` | Footer background |
| `font-heading` | Montserrat | All headings and labels |
| `font-sans` | Inter | Body text |

**Global CSS utilities** (`src/app/globals.css`):
- `.btn-primary` — teal filled button
- `.btn-outline` — white border button (for use on dark/teal backgrounds)
- `.section-label` — small teal uppercase tracking label above section headings
- `.section-heading` — bold Montserrat heading in `brand-dark`

**Interior page pattern:** All non-home pages open with a full-width dark gradient hero at `pt-36 pb-20` (top padding clears the fixed header) then alternate white/`teal-50` content sections.

## Gallery

The Next.js gallery (`src/app/gallery/page.tsx`) uses a manually maintained `galleryItems` array. To add photos:
1. Copy images to `public/images/<category-folder>/`
2. Add entries to `galleryItems` with `{ id, src, alt, category, tall? }`

Valid `category` values match the `CATEGORIES` array: `'Shower Doors' | 'Mirrors' | 'Glass Railings' | 'Office Partitions' | 'Storefronts' | 'Curtain Wall'`. Setting `tall: true` gives an item a `3/4` aspect ratio instead of square (use for portrait photos).

**Note:** `gallery-config.js` in the repo root is a separate, auto-generated file used by the legacy static `index.html`. It is rebuilt automatically by `sync-gallery.ps1` (a Windows PowerShell script that runs weekly on the owner's machine, syncing from OneDrive, watermarking images, and pushing to `main`). Do not edit `gallery-config.js` manually.

## Contact Form

`src/app/contact/page.tsx` uses a Next.js Server Action (`'use server'`). Email sending via [Resend](https://resend.com) is stubbed out — submissions currently only `console.log`. To activate, add `RESEND_API_KEY` to `.env.local` and uncomment the Resend code in `submitForm`.

## Deployment

Deployed on **Vercel** with auto-deploy on push to `main`. The `CNAME` file sets the custom domain to `definedglass.com`. The `vercel.json` contains a catch-all rewrite to `index.html` — this is a legacy artefact from the pre-Next.js static site and may conflict with Next.js routing; be cautious when modifying `vercel.json`.

## Business Info (update here if it changes)

- Phone: (732) 708-2580
- Email: info@definedglass.com
- Showroom: 1179 Lakewood Farmingdale Rd, Howell, NJ 07731
- Instagram: @definedglass / `https://www.instagram.com/definedglass/`
- Service area: NJ · PA · NY
