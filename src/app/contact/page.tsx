import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Defined Glass Creations. Visit our showroom in Howell, NJ or reach us by phone or email. Serving NJ, PA, and NY.',
}

async function submitForm(formData: FormData) {
  'use server'
  // TODO: Wire up email sending with Resend or similar.
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({ from: 'noreply@definedglass.com', to: 'info@definedglass.com', ... })
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const message = formData.get('message')
  console.log('Contact form submission:', { name, email, phone, message })
}

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="pt-36 pb-20 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #111c1c 0%, #1e3530 60%, #2a5c56 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-teal-light text-sm font-bold uppercase tracking-[0.3em] mb-4">
            Get In Touch
          </p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl mb-6">Contact Us</h1>
          <p className="text-gray-300 text-lg">
            Have a question or ready to start your project? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <p className="section-label">Showroom</p>
                <h2 className="font-heading font-bold text-2xl text-brand-dark mb-4">
                  Come See Us in Person
                </h2>
                <p className="text-brand-gray text-sm leading-relaxed">
                  We have a fully stocked showroom in Howell, NJ where you can see glass samples,
                  hardware finishes, and discuss your project in person.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark mb-1">Showroom Address</p>
                    <a
                      href="https://maps.google.com/?q=1179+Lakewood+Farmingdale+Rd+Howell+NJ+07731"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-gray hover:text-teal transition-colors leading-relaxed"
                    >
                      1179 Lakewood Farmingdale Rd<br />
                      Howell, NJ 07731
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark mb-1">Phone</p>
                    <a href="tel:7327082580" className="text-sm text-brand-gray hover:text-teal transition-colors">
                      (732) 708-2580
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark mb-1">Email</p>
                    <a href="mailto:info@definedglass.com" className="text-sm text-brand-gray hover:text-teal transition-colors">
                      info@definedglass.com
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-teal" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark mb-1">Instagram</p>
                    <a
                      href="https://www.instagram.com/definedglass/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-gray hover:text-teal transition-colors"
                    >
                      @definedglass
                    </a>
                  </div>
                </div>
              </div>

              {/* Service area badge */}
              <div className="bg-teal-50 rounded-xl p-5 border border-teal/20">
                <p className="text-teal font-bold text-sm uppercase tracking-widest mb-2">
                  Service Area
                </p>
                <p className="text-brand-dark font-heading font-semibold text-lg">NJ · PA · NY</p>
                <p className="text-brand-gray text-sm mt-1">
                  We serve the tri-state area for both residential and commercial projects.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h2 className="font-heading font-bold text-2xl text-brand-dark mb-2">
                  Send Us a Message
                </h2>
                <p className="text-brand-gray text-sm mb-8">
                  For a detailed project quote, use our{' '}
                  <Link href="/quote" className="text-teal font-semibold hover:underline">
                    Smart Glazier Quote Tool →
                  </Link>
                </p>

                <form action={submitForm} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-brand-dark mb-1.5">
                        Full Name <span className="text-teal">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="John Smith"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-brand-dark mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="(732) 555-0000"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Email Address <span className="text-teal">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-brand-dark mb-1.5">
                      What can we help you with?
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white"
                    >
                      <option value="">Select a service...</option>
                      <option>Frameless Shower Doors</option>
                      <option>Custom Mirrors</option>
                      <option>Glass Railings</option>
                      <option>Office Partitions</option>
                      <option>Storefront</option>
                      <option>Curtain Wall System</option>
                      <option>Other / General Question</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-brand-dark mb-1.5">
                      Message <span className="text-teal">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your project..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal text-white py-4 rounded-lg font-bold uppercase tracking-wide text-sm hover:bg-teal-dark transition-colors"
                  >
                    Send Message
                  </button>

                  <p className="text-xs text-brand-gray text-center">
                    For a project-specific quote, try our{' '}
                    <Link href="/quote" className="text-teal hover:underline">
                      Get A Quote tool
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
