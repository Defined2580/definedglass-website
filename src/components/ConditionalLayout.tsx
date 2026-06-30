'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/crm')) {
    return <>{children}</>
  }
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
