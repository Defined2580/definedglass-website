'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      } bg-white`}
    >
      {/* Top info bar */}
      <div className="bg-teal text-white text-xs py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-4">
            <a href="tel:7327082580" className="hover:text-teal-100 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              (732) 708-2580
            </a>
            <a href="mailto:info@definedglass.com" className="hover:text-teal-100 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              info@definedglass.com
            </a>
          </span>
          <span className="text-teal-100">Serving NJ · PA · NY</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Defined Glass Creations"
              width={220}
              height={66}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                  pathname === link.href
                    ? 'text-teal border-b-2 border-teal pb-0.5'
                    : 'text-brand-dark hover:text-teal'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="bg-teal text-white px-5 py-2.5 rounded text-sm font-bold uppercase tracking-wide hover:bg-teal-dark transition-colors ml-2"
            >
              Get A Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span
              className={`block w-6 h-0.5 bg-brand-dark transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-brand-dark transition-all duration-300 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-brand-dark transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-96 py-4' : 'max-h-0'
          } border-t border-gray-100`}
        >
          <div className="flex flex-col gap-1 sm:hidden mb-3 pb-3 border-b border-gray-100">
            <a href="tel:7327082580" className="text-sm text-teal font-medium py-1">
              (732) 708-2580
            </a>
            <a href="mailto:info@definedglass.com" className="text-sm text-brand-gray py-1">
              info@definedglass.com
            </a>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                pathname === link.href ? 'text-teal' : 'text-brand-dark hover:text-teal'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="block mt-4 bg-teal text-white px-5 py-3 rounded text-center text-sm font-bold uppercase tracking-wide hover:bg-teal-dark transition-colors"
          >
            Get A Quote
          </Link>
        </div>
      </nav>
    </header>
  )
}
