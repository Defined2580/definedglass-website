import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Defined Glass Creations | Premium Glass Solutions — NJ, PA & NY',
    template: '%s | Defined Glass Creations',
  },
  description:
    'Defined Glass Creations specializes in custom glass solutions including frameless shower doors, mirrors, glass railings, office partitions, storefronts, and curtain walls across New Jersey, Pennsylvania, and New York.',
  keywords: [
    'glass company NJ',
    'frameless shower doors',
    'custom mirrors',
    'glass railings',
    'office partitions',
    'storefront glass',
    'curtain wall',
    'Howell NJ glass',
    'NJ PA NY glass contractor',
  ],
  openGraph: {
    siteName: 'Defined Glass Creations',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
