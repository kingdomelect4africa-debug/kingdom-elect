import { SetNavTone } from '@/components/marketing/NavTone'
import { NotFoundPanel } from '@/components/marketing/NotFoundPanel'

/**
 * Shown when a public page calls notFound() (a missing article, story, event
 * or program). The marketing layout already supplies the header and footer;
 * using the root not-found.tsx here gave those pages a second header.
 */
export default function MarketingNotFound() {
  return (
    <>
      <SetNavTone tone="dark" />
      <NotFoundPanel />
    </>
  )
}
