import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Defined Glass Creations | Custom Glass Solutions NJ, PA & NY',
}

const services = [
  {
    title: 'Frameless Shower Doors',
    description:
      'Custom frameless and semi-frameless shower enclosures crafted to fit your bathroom perfectly.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="3" y="3" width="8" height="18" rx="1" />
        <rect x="13" y="3" width="8" height="18" rx="1" />
        <line x1="11" y1="12" x2="13" y2="12" strokeWidth={2} />
      </svg>
    ),
    tag: 'Residential',
  },
  {
    title: 'Custom Mirrors',
    description:
      'Beveled, frameless, and decorative mirrors for bathrooms, gyms, salons, and retail spaces.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <ellipse cx="12" cy="11" rx="5" ry="6" strokeWidth={1} opacity={0.5} />
        <line x1="8" y1="22" x2="10" y2="22" strokeWidth={2} />
        <line x1="14" y1="22" x2="16" y2="22" strokeWidth={2} />
      </svg>
    ),
    tag: 'Residential',
  },
  {
    title: 'Glass Railings',
    description:
      'Sleek frameless and post-mounted glass railings for decks, stairs, balconies, and interiors.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <line x1="2" y1="6" x2="22" y2="6" strokeWidth={2} />
        <line x1="2" y1="18" x2="22" y2="18" strokeWidth={2} />
        <line x1="5" y1="6" x2="5" y2="18" />
        <line x1="10" y1="6" x2="10" y2="18" />
        <line x1="15" y1="6" x2="15" y2="18" />
        <line x1="20" y1="6" x2="20" y2="18" />
      </svg>
    ),
    tag: 'Residential',
  },
  {
    title: 'Office Partitions',
    description:
      'Modern glass walls and partitions that create bright, open, collaborative work environments.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="2" y="3" width="9" height="18" rx="1" />
        <rect x="13" y="3" width="9" height="18" rx="1" />
        <line x1="11" y1="12" x2="13" y2="12" strokeWidth={2} />
      </svg>
    ),
    tag: 'Commercial',
  },
  {
    title: 'Storefronts',
    description:
      'High-performance glass storefronts and entrances engineered for durability and curb appeal.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
        <rect x="9" y="12" width="6" height="8" rx="0.5" />
      </svg>
    ),
    tag: 'Commercial',
  },
  {
    title: 'Curtain Wall Systems',
    description:
      'Aluminum and glass exterior curtain wall systems for commercial and mixed-use buildings.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="1" />
        <line x1="9" y1="2" x2="9" y2="22" />
        <line x1="15" y1="2" x2="15" y2="22" />
        <line x1="2" y1="9" x2="22" y2="9" />
        <line x1="2" y1="15" x2="22" y2="15" />
      </svg>
    ),
    tag: 'Commercial',
  },
]

const values = [
  { label: 'Craftsmanship', desc: 'Every cut, every install is executed with precision and pride.' },
  { label: 'Transparency', desc: 'No surprises. You know what to expect from estimate to final install.' },
  { label: 'Ownership', desc: 'We take full responsibility for every project, start to finish.' },
  { label: 'Communication', desc: 'We keep you in the loop so you&apos;re never left guessing.' },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-24"
        style={{
          background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 45%, #2a5c56 100%)',
        }}
      >
        {/* Subtle glass texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px)',
          }}
        />
        {/* Teal accent glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <p className="text-teal-light text-sm font-bold uppercase tracking-[0.3em] mb-6">
            NJ · PA · NY
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
            Defined by Quality.
            <br />
            <span className="text-teal-light">Built to Last.</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium custom glass solutions for residential and commercial spaces. From frameless shower
            doors to full curtain wall systems — craftsmanship you can see through.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="btn-primary text-base px-8 py-4">
              View Our Services
            </Link>
            <Link href="/quote" className="btn-outline text-base px-8 py-4">
              Get A Free Quote
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label">What We Do</p>
            <h2 className="section-heading text-4xl sm:text-5xl">Our Services</h2>
            <p className="text-brand-gray text-lg mt-4 max-w-2xl mx-auto">
              From a single custom mirror to a full commercial glazing package — we deliver quality at
              every scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group border border-gray-100 rounded-xl p-8 hover:border-teal hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="text-teal mb-5 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                    service.tag === 'Commercial' ? 'text-brand-blue' : 'text-teal'
                  }`}
                >
                  {service.tag}
                </span>
                <h3 className="font-heading font-bold text-xl text-brand-dark mb-3">{service.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed flex-1">{service.description}</p>
                <Link
                  href="/services"
                  className="mt-5 text-teal text-sm font-semibold hover:text-teal-dark transition-colors inline-flex items-center gap-1"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              See All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label">Why Defined Glass</p>
              <h2 className="section-heading text-4xl sm:text-5xl mb-6">
                We&apos;re All In — From the First Call to the Final Install
              </h2>
              <p className="text-brand-gray text-lg leading-relaxed mb-8">
                At Defined Glass, we don&apos;t just install glass — we deliver an experience built on
                transparency, communication, and craftsmanship that speaks for itself. We take ownership
                of every project, solve problems before they become yours, and show up with the
                efficiency and professionalism you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" className="btn-primary">
                  About Us
                </Link>
                <Link href="/gallery" className="btn-primary" style={{ background: 'transparent', color: '#3d9e96', border: '2px solid #3d9e96' }}>
                  View Our Work
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-teal rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-brand-dark mb-2">{v.label}</h3>
                  <p
                    className="text-sm text-brand-gray leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: v.desc }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label">Our Work</p>
            <h2 className="section-heading text-4xl sm:text-5xl">Recent Projects</h2>
            <p className="text-brand-gray text-lg mt-4 max-w-xl mx-auto">
              A glimpse at what we&apos;ve built. Every project is a reflection of our commitment to
              quality.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { src: '/images/shower-doors/inline-1.jpg', label: 'Frameless Shower' },
              { src: '/images/railings/railing-4.jpg',    label: 'Glass Railing' },
              { src: '/images/mirrors/mirror-2.jpg',      label: 'Custom Mirror' },
              { src: '/images/shower-doors/neo-1.jpg',    label: 'Neo Angle Enclosure' },
            ].map((item) => (
              <div
                key={item.label}
                className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-semibold">{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/gallery" className="btn-primary">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT BANNER ── */}
      <section
        className="py-24"
        style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <svg
            className="w-10 h-10 text-teal mx-auto mb-8 opacity-60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-white text-xl sm:text-2xl lg:text-3xl font-heading font-light leading-relaxed italic">
            &ldquo;We don&apos;t just install glass — we deliver an experience built on transparency,
            communication, and craftsmanship that speaks for itself. When you work with us,
            you&apos;re working with a team that&apos;s all in — from the first call to the final
            install.&rdquo;
          </p>
          <p className="text-teal-light mt-8 text-sm font-bold uppercase tracking-widest">
            — The Defined Glass Team
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="font-heading font-black text-4xl sm:text-5xl mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-teal-100 text-lg mb-10 max-w-xl mx-auto">
            Get in touch today for a free, no-obligation quote. We serve homeowners, builders, and
            developers across NJ, PA, and NY.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="bg-white text-teal px-8 py-4 rounded font-bold uppercase tracking-wide text-sm hover:bg-teal-50 transition-colors"
            >
              Get A Free Quote
            </Link>
            <a
              href="tel:7327082580"
              className="border-2 border-white text-white px-8 py-4 rounded font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors"
            >
              Call (732) 708-2580
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
