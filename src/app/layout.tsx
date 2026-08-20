import type { Metadata } from 'next'
import { fraunces, inter } from '@/styles/fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kingdom E.L.E.C.T. for Africa',
    template: '%s · Kingdom E.L.E.C.T. for Africa',
  },
  description:
    "Africa's premier Kingdom governance and strategic intelligence platform, mobilizing Educators, Leaders, Entrepreneurs, Creatives, and Technocrats for the transformation of people, institutions, and territories.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
