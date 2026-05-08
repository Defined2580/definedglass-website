import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Defined Glass Creations offers a full range of custom glass services — frameless shower doors, mirrors, glass railings, office partitions, storefronts, and curtain wall systems across NJ, PA, and NY.',
}

const residentialServices = [
  {
    title: 'Frameless Shower Doors & Enclosures',
    description:
      'Transform your bathroom with a custom frameless or semi-frameless shower enclosure. We fabricate and install to exact measurements — no standard sizes here. Choose from clear, frosted, or patterned glass with a range of hardware finishes including brushed nickel, matte black, and polished chrome.',
    features: ['Frameless & semi-frameless', 'Walk-in showers & tub enclosures', 'Hinged, sliding & pivot doors', 'Custom hardware finishes'],
  },
  {
    title: 'Custom Mirrors',
    description:
      'A well-placed mirror changes a room. We cut, bevel, and install custom mirrors for bathrooms, vanities, closets, gyms, salons, and retail spaces. Frameless or framed — we handle the measurement, fabrication, and installation.',
    features: ['Beveled & flat edge options', 'Back-lit & LED mirror installs', 'Custom shapes & sizes', 'Antique & tinted glass'],
  },
  {
    title: 'Glass Railings & Balutstrades',
    description:
      'Add an open, modern feel to any space with frameless or post-mounted glass railings. Perfect for decks, stairs, balconies, mezzanines, and interior loft edges. Code-compliant, engineered for safety, and built to last.',
    features: ['Frameless & post-mount systems', 'Interior & exterior applications', 'Deck, stair & balcony railings', 'Tempered & laminated glass'],
  },
  {
    title: 'Glass Splashbacks & Backsplashes',
    description:
      'Sleek, hygienic, and easy to clean — glass backsplashes are a modern alternative to tile. We custom-cut and install in kitchens, bathrooms, and laundry rooms. Available in any color with a painted glass finish.',
    features: ['Custom colors & sizes', 'Kitchen & bathroom applications', 'Easy maintenance', 'Painted glass finish'],
  },
]

const commercialServices = [
  {
    title: 'Office Partitions & Glass Walls',
    description:
      'Create modern, light-filled workspaces with full-height glass partitions and demountable wall systems. We work with designers, contractors, and business owners to design and install systems that maximize natural light while maintaining acoustic separation.',
    features: ['Full-height & partial-height systems', 'Demountable & fixed options', 'Frosted & manifestation film', 'Door & hardware integration'],
  },
  {
    title: 'Storefronts & Entrances',
    description:
      'First impressions matter. We design and install aluminum-framed glass storefront systems, automatic and manual entry doors, and transoms engineered for high-traffic commercial environments. Serving retail, hospitality, medical, and mixed-use projects.',
    features: ['Aluminum storefront framing', 'Swinging & sliding entry doors', 'Tempered safety glass', 'ADA-compliant options'],
  },
  {
    title: 'Curtain Wall Systems',
    description:
      'For large commercial and mixed-use projects, we install aluminum and glass exterior curtain wall systems that deliver thermal performance, weather resistance, and architectural impact. We collaborate with GCs, architects, and developers from design through installation.',
    features: ['Stick-built & unitized systems', 'Thermal performance glazing', 'Custom aluminum framing', 'GC & architect coordination'],
  },
  {
    title: 'Commercial Glass Doors & Hardware',
    description:
      'Frameless all-glass entrance systems, patch fittings, and heavy-duty pivoting doors for lobbies, banks, medical offices, and retail. Clean, minimal, and built for daily commercial use.',
    features: ['All-glass door systems', 'Patch & pivot hardware', 'Lobby & entrance applications', 'Electric strike & closer integration'],
  },
]

function ServiceCard({ title, description, features }: { title: string; description: string; features: string[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg hover:border-teal transition-all duration-300">
      <h3 className="font-heading font-bold text-xl text-brand-dark mb-4">{title}</h3>
      <p className="text-brand-gray text-sm leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-brand-dark">
            <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="pt-36 pb-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-teal-light text-sm font-bold uppercase tracking-[0.3em] mb-4">
            What We Offer
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl mb-6">Our Services</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            From custom residential glass to large-scale commercial glazing systems — we bring
            craftsmanship and precision to every project across NJ, PA, and NY.
          </p>
        </div>
      </section>

      {/* Residential */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-1 bg-teal rounded" />
            <div>
              <p className="section-label mb-0">For Homeowners</p>
              <h2 className="section-heading text-3xl sm:text-4xl">Residential Glass</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {residentialServices.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-teal-50 py-1" />

      {/* Commercial */}
      <section className="py-24 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-1 bg-brand-blue rounded" />
            <div>
              <p className="text-brand-blue text-sm font-bold uppercase tracking-widest mb-0">
                For Builders & Developers
              </p>
              <h2 className="section-heading text-3xl sm:text-4xl">Commercial Glazing</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {commercialServices.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-teal">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-heading font-black text-4xl mb-4">Have a Project in Mind?</h2>
          <p className="text-teal-100 text-lg mb-8">
            Use our Smart Glazier configurator to get a quick quote, or reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-white text-teal px-8 py-4 rounded font-bold uppercase tracking-wide text-sm hover:bg-teal-50 transition-colors">
              Get A Free Quote
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
