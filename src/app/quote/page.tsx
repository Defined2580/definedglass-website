'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

// Note: metadata export doesn't work in 'use client' components.
// For SEO, move page metadata to a parent layout if needed.

declare global {
  interface Window {
    iFrameResize: (options: Record<string, unknown>) => void
  }
}

export default function QuotePage() {
  useEffect(() => {
    // Load iFrameResizer script dynamically
    const script = document.createElement('script')
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.1/iframeResizer.min.js'
    script.integrity =
      'sha512-ngVIPTfUxNHrVs52hA0CaOVwC3/do2W4jUEJIufgZQicmY27iAJAind8BPtK2LoyIGiAFcOkjO18r5dTUNLFAw=='
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (window.iFrameResize) {
        window.iFrameResize({ log: false })
      }
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      {/* Page header */}
      <section
        className="pt-36 pb-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-teal-light text-sm font-bold uppercase tracking-[0.3em] mb-4">
            Start Your Project
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl mb-6">Get A Quote</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Tell us about your project and we&apos;ll get back to you with a clear, no-obligation quote — usually within 24 hours.
          </p>
        </div>
      </section>

      {/* Smart Glazier iframe */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-center">
            {[
              { label: 'Free Quote', icon: '✓' },
              { label: 'No Obligation', icon: '✓' },
              { label: 'Fast Response', icon: '✓' },
              { label: 'NJ · PA · NY', icon: '✓' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-brand-gray">
                <span className="text-teal font-bold">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </div>
            ))}
          </div>

          {/* The iframe */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <iframe
              src="https://webusd.smartglazier.com/DEF/LiteApp/?xti=31/ #/"
              width="100%"
              scrolling="no"
              style={{ border: 'none', minHeight: '600px' }}
              title="Defined Glass Creations Quote Configurator"
            />
          </div>

          {/* Fallback contact */}
          <div className="mt-10 text-center">
            <p className="text-brand-gray text-sm mb-4">
              Prefer to speak with someone directly?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:7327082580"
                className="btn-primary"
              >
                Call (732) 708-2580
              </a>
              <Link href="/contact" className="btn-primary" style={{ background: 'transparent', color: '#3d9e96', border: '2px solid #3d9e96' }}>
                Send Us a Message
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="section-label">The Process</p>
          <h2 className="section-heading text-3xl sm:text-4xl mb-12">What Happens Next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Submit Your Info',
                desc: 'Fill out the configurator above with your project details.',
              },
              {
                step: '02',
                title: 'We Review & Follow Up',
                desc: 'Our team reviews your submission and reaches out to confirm details.',
              },
              {
                step: '03',
                title: 'Get Your Quote',
                desc: 'We provide a clear, itemized quote — no surprises, no fine print.',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-teal rounded-full flex items-center justify-center text-white font-heading font-black text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-bold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
