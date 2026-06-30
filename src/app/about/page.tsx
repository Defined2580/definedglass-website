import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Defined Glass Creations — our story, mission, and the core values that drive every project we take on across NJ, PA, and NY.',
}

const coreValues = [
  {
    label: 'Transparency',
    desc: 'No hidden costs, no surprises. We tell you exactly what to expect before work begins.',
    icon: '◇',
  },
  {
    label: 'Communication',
    desc: "You'll always know where your project stands. We keep the lines open from day one.",
    icon: '◈',
  },
  {
    label: 'Teamwork',
    desc: 'We collaborate with your GC, architect, and designer to make your vision a reality.',
    icon: '◉',
  },
  {
    label: 'Ownership',
    desc: 'Every project is ours to own — we take full responsibility, start to finish.',
    icon: '◎',
  },
  {
    label: 'Problem Solving',
    desc: "We solve problems before they become yours. That's the Defined Glass difference.",
    icon: '◐',
  },
  {
    label: 'Efficiency',
    desc: 'We show up on time, work clean, and finish on schedule — every time.',
    icon: '◑',
  },
  {
    label: 'Craftsmanship',
    desc: 'Every cut, every install is executed with precision and pride in our trade.',
    icon: '◆',
  },
  {
    label: 'Service',
    desc: 'We treat every client — homeowner or Fortune 500 builder — with the same respect and care.',
    icon: '◇',
  },
  {
    label: 'Positivity',
    desc: 'Good energy on every job site. We make the process as smooth as the glass we install.',
    icon: '◈',
  },
]

const stats = [
  { value: 'NJ · PA · NY', label: 'Service Area' },
  { value: '100%', label: 'Custom Fabrication' },
  { value: '6', label: 'Core Service Lines' },
  { value: '5★', label: 'Client Satisfaction Goal' },
]

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="pt-36 pb-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-teal-light text-sm font-bold uppercase tracking-[0.3em] mb-4">
            Our Story
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl mb-6">About Us</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            A team built on craftsmanship, driven by values, and committed to delivering glass
            solutions that speak for themselves.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Story */}
            <div>
              <p className="section-label">Who We Are</p>
              <h2 className="section-heading text-4xl sm:text-5xl mb-6">
                Defined Glass Creations
              </h2>
              <div className="space-y-4 text-brand-gray text-base leading-relaxed">
                <p>
                  Defined Glass Creations is a full-service glass supply and installation company
                  based in Howell, NJ. We serve residential homeowners, general contractors, and
                  commercial developers across New Jersey, Pennsylvania, and parts of New York.
                </p>
                <p>
                  Whether you&apos;re updating a bathroom with a frameless shower door or managing a
                  multi-story curtain wall installation, we bring the same level of precision,
                  professionalism, and pride to every project.
                </p>
                <p>
                  Our showroom in Howell is open to homeowners and trade professionals alike. Stop
                  in to see glass samples, hardware finishes, and get a sense of what&apos;s possible
                  for your space.
                </p>
              </div>
            </div>

            {/* Mission statement card */}
            <div
              className="rounded-2xl p-10 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal opacity-10 rounded-full blur-3xl" />
              <svg
                className="w-10 h-10 text-teal mb-6 opacity-70"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <h3 className="font-heading font-bold text-xl text-teal-light mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed text-base italic">
                &ldquo;At Defined Glass, we don&apos;t just install glass — we deliver an experience
                built on transparency, communication, and craftsmanship that speaks for itself. We
                take ownership of every project, solve problems before they become yours, and show
                up with the efficiency and professionalism you deserve. When you work with us,
                you&apos;re working with a team that&apos;s all in — from the first call to the
                final install.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading font-black text-3xl sm:text-4xl text-teal mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-brand-gray uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-label">What Drives Us</p>
            <h2 className="section-heading text-4xl sm:text-5xl">Our Core Values</h2>
            <p className="text-brand-gray text-lg mt-4 max-w-2xl mx-auto">
              These aren&apos;t just words on a wall — they&apos;re how we operate on every job,
              every day.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v, i) => (
              <div
                key={v.label}
                className="border border-gray-100 rounded-xl p-6 hover:border-teal hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-teal text-white rounded flex items-center justify-center text-xs font-bold font-heading">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-heading font-bold text-brand-dark">{v.label}</h3>
                </div>
                <p className="text-sm text-brand-gray leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="py-20 bg-teal-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="section-label">Where We Work</p>
          <h2 className="section-heading text-4xl mb-6">Service Area</h2>
          <p className="text-brand-gray text-lg leading-relaxed mb-8">
            Our team serves clients throughout{' '}
            <strong className="text-brand-dark">New Jersey</strong>,{' '}
            <strong className="text-brand-dark">Pennsylvania</strong>, and{' '}
            <strong className="text-brand-dark">parts of New York</strong>. Our showroom is
            located at 1179 Lakewood Farmingdale Rd, Howell, NJ 07731.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://maps.google.com/?q=1179+Lakewood+Farmingdale+Rd+Howell+NJ+07731"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Get Directions
            </a>
            <Link href="/contact" className="btn-primary" style={{ background: 'transparent', color: '#3d9e96', border: '2px solid #3d9e96' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-charcoal text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading font-black text-4xl mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            From a single shower door to a full commercial glazing package — we&apos;re ready.
          </p>
          <Link href="/quote" className="btn-primary text-base px-8 py-4">
            Get A Free Quote
          </Link>
        </div>
      </section>
    </>
  )
}
