import Link from 'next/link'
import Image from 'next/image'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Project Gallery' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/quote', label: 'Get A Quote' },
]

const services = [
  'Frameless Shower Doors',
  'Custom Mirrors',
  'Glass Railings',
  'Office Partitions',
  'Storefronts',
  'Curtain Wall Systems',
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-charcoal text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Defined Glass Creations"
              width={200}
              height={60}
              className="h-11 w-auto brightness-0 invert mb-5"
            />
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              At Defined Glass, we don&apos;t just install glass — we deliver an experience built on
              transparency, communication, and craftsmanship that speaks for itself.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/definedglass/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-gray-500 hover:text-teal transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-5">
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-400 hover:text-teal transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-gray-300 font-semibold mb-1">Showroom</p>
                <a
                  href="https://maps.google.com/?q=1179+Lakewood+Farmingdale+Rd+Howell+NJ+07731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal transition-colors leading-relaxed"
                >
                  1179 Lakewood Farmingdale Rd
                  <br />
                  Howell, NJ 07731
                </a>
              </li>
              <li>
                <a href="tel:7327082580" className="text-gray-400 hover:text-teal transition-colors">
                  (732) 708-2580
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@definedglass.com"
                  className="text-gray-400 hover:text-teal transition-colors"
                >
                  info@definedglass.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/quote"
                  className="inline-block bg-teal text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wide hover:bg-teal-dark transition-colors"
                >
                  Get A Free Quote
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>© {year} Defined Glass Creations LLC. All rights reserved.</p>
          <p>Serving New Jersey · Pennsylvania · New York</p>
        </div>
      </div>
    </footer>
  )
}
