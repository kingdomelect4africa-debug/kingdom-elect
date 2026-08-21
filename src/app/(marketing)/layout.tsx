import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { NavToneProvider } from '@/components/marketing/NavTone'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavToneProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </NavToneProvider>
  )
}
