import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { NavToneProvider, SetNavTone } from '@/components/marketing/NavTone'
import { NotFoundPanel } from '@/components/marketing/NotFoundPanel'
import { MotionProvider } from '@/components/motion/primitives'

/**
 * For addresses that match no page at all. This renders outside the
 * (marketing) layout, so it brings its own header, footer and providers; a
 * missing article or event inside the public site uses
 * (marketing)/not-found.tsx instead, which the marketing layout wraps.
 */
export default function NotFound() {
  return (
    <MotionProvider>
      <NavToneProvider>
        <SetNavTone tone="dark" />
        <Header />
        <main>
          <NotFoundPanel />
        </main>
        <Footer />
      </NavToneProvider>
    </MotionProvider>
  )
}
