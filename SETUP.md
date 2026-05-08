# Defined Glass Creations — Website Setup Guide

## Step 1: Install Node.js

Download and install Node.js from: https://nodejs.org
→ Choose the **LTS** version (recommended)

After installing, open a new terminal and verify:
```
node --version
npm --version
```

---

## Step 2: Install project dependencies

Open PowerShell or Command Prompt, navigate to this folder:
```
cd "C:\Users\ej\Documents\definedglass-website"
npm install
```

---

## Step 3: Run the site locally

```
npm run dev
```

Then open your browser to: **http://localhost:3000**

---

## Step 4: Deploy to Vercel

1. Go to https://vercel.com and sign up / log in
2. Install Vercel CLI: `npm install -g vercel`
3. From this project folder, run: `vercel`
4. Follow the prompts — it will detect Next.js automatically
5. Connect your `definedglass.com` domain in the Vercel dashboard under **Domains**

---

## Files & Folders

```
public/
  logo.png          ← your logo (already copied)
  logo.svg          ← vector version
  images/
    shower-doors/   ← shower door photos (already copied)
    mirrors/        ← mirror photos (already copied)
    railings/       ← railing photos (already copied)
    other/          ← backsplash & other photos (already copied)

src/app/
  page.tsx          ← Home page
  services/         ← Services page
  gallery/          ← Gallery (edit galleryItems array to add more photos)
  about/            ← About page
  contact/          ← Contact page
  quote/            ← Get A Quote (Smart Glazier iframe)

src/components/
  Header.tsx        ← Navigation bar
  Footer.tsx        ← Footer
```

---

## Adding More Gallery Photos

Open `src/app/gallery/page.tsx` and add entries to the `galleryItems` array:

```typescript
{ id: 25, src: '/images/your-folder/photo.jpg', alt: 'Description', category: 'Shower Doors' },
```

**Available categories:** Shower Doors | Mirrors | Glass Railings | Office Partitions | Storefronts | Curtain Wall

Copy new photos to the `public/images/` folder first, then reference them as `/images/filename.jpg`.

---

## Setting Up the Contact Form Email

The contact form currently logs submissions to the console.
To receive emails, set up [Resend](https://resend.com) (free tier available):

1. Create an account at resend.com
2. Add your API key to `.env.local`: `RESEND_API_KEY=re_xxxxx`
3. Uncomment the email code in `src/app/contact/page.tsx`

---

## Brand Colors

| Color | Hex | Used for |
|-------|-----|----------|
| Teal (primary) | `#3d9e96` | Buttons, accents, icons |
| Blue (accent) | `#00adef` | Commercial section labels |
| Dark Gray | `#3d3d3d` | Body text |
| Charcoal | `#1e1e1e` | Footer background |

---

## Contact Info (to update if anything changes)

- **Phone:** (732) 708-2580
- **Email:** info@definedglass.com
- **Showroom:** 1179 Lakewood Farmingdale Rd, Howell, NJ 07731
- **Instagram:** @definedglass
- **Service Area:** NJ · PA · NY
