'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/*
  HOW TO ADD YOUR PHOTOS:
  1. Copy your project photos into /public/images/
  2. Add entries to the `galleryItems` array below
  3. Each entry needs: id, src ("/images/your-file.jpg"), alt text, and category

  Categories must match one of the CATEGORIES array entries.
*/

const CATEGORIES = [
  'All',
  'Shower Doors',
  'Mirrors',
  'Glass Railings',
  'Office Partitions',
  'Storefronts',
  'Curtain Wall',
]

interface GalleryItem {
  id: number
  src: string
  alt: string
  category: string
  tall?: boolean
}

// ── ADD YOUR PHOTOS HERE ──────────────────────────────────────────────────────
const galleryItems: GalleryItem[] = [
  // Shower Doors
  { id: 1,  src: '/images/shower-doors/inline-1.jpg',  alt: 'Frameless inline shower enclosure', category: 'Shower Doors', tall: true },
  { id: 2,  src: '/images/shower-doors/inline-2.jpg',  alt: 'Custom frameless shower door', category: 'Shower Doors' },
  { id: 3,  src: '/images/shower-doors/inline-3.jpg',  alt: 'Frameless shower panel', category: 'Shower Doors' },
  { id: 4,  src: '/images/shower-doors/inline-4.jpg',  alt: 'Hinged frameless shower door', category: 'Shower Doors', tall: true },
  { id: 5,  src: '/images/shower-doors/return-1.jpg',  alt: 'Shower return panel installation', category: 'Shower Doors' },
  { id: 6,  src: '/images/shower-doors/return-2.jpg',  alt: 'Semi-frameless shower with return', category: 'Shower Doors' },
  { id: 7,  src: '/images/shower-doors/neo-1.jpg',     alt: 'Neo angle frameless shower enclosure', category: 'Shower Doors', tall: true },
  { id: 8,  src: '/images/shower-doors/tub-1.jpg',     alt: 'Tub enclosure glass door', category: 'Shower Doors' },
  { id: 9,  src: '/images/shower-doors/tub-2.jpg',     alt: 'Frameless tub enclosure', category: 'Shower Doors' },
  // Mirrors
  { id: 10, src: '/images/mirrors/mirror-1.jpg', alt: 'Custom bathroom mirror', category: 'Mirrors' },
  { id: 11, src: '/images/mirrors/mirror-2.jpg', alt: 'Frameless vanity mirror', category: 'Mirrors', tall: true },
  { id: 12, src: '/images/mirrors/mirror-3.jpg', alt: 'Large wall mirror', category: 'Mirrors' },
  { id: 13, src: '/images/mirrors/mirror-4.jpg', alt: 'Custom cut bathroom mirror', category: 'Mirrors' },
  { id: 14, src: '/images/mirrors/mirror-5.jpg', alt: 'Bathroom mirror installation', category: 'Mirrors', tall: true },
  { id: 15, src: '/images/mirrors/mirror-6.jpg', alt: 'V-groove custom mirror', category: 'Mirrors' },
  // Glass Railings
  { id: 16, src: '/images/railings/railing-1.jpg', alt: 'Glass deck railing', category: 'Glass Railings', tall: true },
  { id: 17, src: '/images/railings/railing-2.jpg', alt: 'Post-mount glass railing', category: 'Glass Railings' },
  { id: 18, src: '/images/railings/railing-3.jpg', alt: 'Exterior glass railing', category: 'Glass Railings' },
  { id: 19, src: '/images/railings/railing-4.jpg', alt: 'Modern glass balustrade', category: 'Glass Railings', tall: true },
  { id: 20, src: '/images/railings/railing-5.jpg', alt: 'Interior glass railing system', category: 'Glass Railings' },
  { id: 21, src: '/images/railings/railing-6.jpg', alt: 'Staircase glass railing', category: 'Glass Railings' },
  // Mirrors - Backsplash / Other
  { id: 22, src: '/images/other/backsplash-1.jpg', alt: 'Glass backsplash installation', category: 'Mirrors' },
  { id: 23, src: '/images/other/backsplash-2.jpg', alt: 'Custom kitchen glass backsplash', category: 'Mirrors' },
  { id: 24, src: '/images/other/backsplash-3.jpg', alt: 'Painted glass backsplash', category: 'Mirrors' },
]
// ─────────────────────────────────────────────────────────────────────────────

// Placeholder colors for when no photos are loaded yet
const placeholderColors: Record<string, string> = {
  'Shower Doors':     'from-teal-700 to-teal-500',
  'Mirrors':          'from-gray-700 to-gray-500',
  'Glass Railings':   'from-teal-500 to-cyan-400',
  'Office Partitions':'from-slate-700 to-slate-500',
  'Storefronts':      'from-zinc-700 to-zinc-500',
  'Curtain Wall':     'from-neutral-800 to-neutral-600',
}

// Generate placeholder cards when no real images exist
const placeholders: GalleryItem[] = galleryItems.length === 0
  ? [
      { id: 101, src: '', alt: 'Frameless Shower Enclosure', category: 'Shower Doors', tall: true },
      { id: 102, src: '', alt: 'Custom Bathroom Mirror', category: 'Mirrors' },
      { id: 103, src: '', alt: 'Glass Deck Railing', category: 'Glass Railings' },
      { id: 104, src: '', alt: 'Office Glass Wall', category: 'Office Partitions', tall: true },
      { id: 105, src: '', alt: 'Retail Storefront', category: 'Storefronts' },
      { id: 106, src: '', alt: 'Walk-in Shower', category: 'Shower Doors' },
      { id: 107, src: '', alt: 'Commercial Curtain Wall', category: 'Curtain Wall', tall: true },
      { id: 108, src: '', alt: 'Vanity Mirror', category: 'Mirrors' },
      { id: 109, src: '', alt: 'Stair Glass Railing', category: 'Glass Railings' },
      { id: 110, src: '', alt: 'Conference Room Partition', category: 'Office Partitions' },
      { id: 111, src: '', alt: 'Restaurant Storefront', category: 'Storefronts' },
      { id: 112, src: '', alt: 'Semi-Frameless Shower', category: 'Shower Doors' },
    ]
  : []

const allItems = galleryItems.length > 0 ? galleryItems : placeholders

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All' ? allItems : allItems.filter((i) => i.category === activeCategory)

  return (
    <>
      {/* Page header */}
      <section
        className="pt-36 pb-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-teal-light text-sm font-bold uppercase tracking-[0.3em] mb-4">
            Our Work
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl mb-6">Project Gallery</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Browse completed projects across residential and commercial categories. Every photo is a
            job we&apos;re proud of.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-[88px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-teal text-white'
                    : 'text-brand-gray hover:bg-gray-100 hover:text-brand-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-brand-gray">
              <p className="text-lg">No photos in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`break-inside-avoid rounded-xl overflow-hidden group relative ${
                    item.tall ? 'aspect-[3/4]' : 'aspect-square'
                  }`}
                >
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    // Placeholder card
                    <div
                      className={`w-full h-full bg-gradient-to-br ${placeholderColors[item.category] || 'from-gray-700 to-gray-500'} flex items-end p-5`}
                    >
                      <div>
                        <span className="text-xs text-white/70 uppercase tracking-widest font-bold block mb-1">
                          {item.category}
                        </span>
                        <span className="text-white font-heading font-semibold">{item.alt}</span>
                      </div>
                    </div>
                  )}
                  {item.src && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <div>
                        <span className="text-xs text-teal-light uppercase tracking-widest font-bold block mb-1">
                          {item.category}
                        </span>
                        <span className="text-white font-heading font-semibold text-sm">{item.alt}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photos coming notice */}
          {galleryItems.length === 0 && (
            <div className="mt-12 bg-white border border-teal/20 rounded-xl p-8 text-center">
              <p className="text-teal font-heading font-bold text-lg mb-2">More Photos Coming Soon</p>
              <p className="text-brand-gray text-sm">
                We&apos;re loading up our portfolio. In the meantime, check out our Instagram{' '}
                <a
                  href="https://www.instagram.com/definedglass/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal font-semibold hover:underline"
                >
                  @definedglass
                </a>{' '}
                for recent work.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-teal">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-heading font-black text-4xl mb-4">Like What You See?</h2>
          <p className="text-teal-100 text-lg mb-8">Let&apos;s talk about your project.</p>
          <Link
            href="/quote"
            className="bg-white text-teal px-8 py-4 rounded font-bold uppercase tracking-wide text-sm hover:bg-teal-50 transition-colors inline-block"
          >
            Get A Free Quote
          </Link>
        </div>
      </section>
    </>
  )
}
