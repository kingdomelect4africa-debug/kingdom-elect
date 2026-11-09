import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { NavToneProvider } from '@/components/marketing/NavTone'
import { MotionProvider } from '@/components/motion/primitives'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    // MotionProvider: every animation on the public site honours "reduce motion".
    <MotionProvider>
      <NavToneProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </NavToneProvider>
    </MotionProvider>
  )
}
