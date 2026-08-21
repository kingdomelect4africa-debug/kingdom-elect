'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Tone = 'light' | 'dark'

const NavToneContext = createContext<{ tone: Tone; setTone: (t: Tone) => void } | null>(null)

export function NavToneProvider({ children }: { children: React.ReactNode }) {
  const [tone, setTone] = useState<Tone>('light')
  return <NavToneContext.Provider value={{ tone, setTone }}>{children}</NavToneContext.Provider>
}

export function useNavTone() {
  const ctx = useContext(NavToneContext)
  if (!ctx) throw new Error('useNavTone must be used within NavToneProvider')
  return ctx.tone
}

/**
 * Every page should render this once near the top, declaring whether its
 * hero/header sits on a dark background — this is the single source of
 * truth for the current page's nav tone (no scroll-tracking, matching the
 * reference design: the nav's light/dark treatment is per-page, not
 * scroll-linked).
 */
export function SetNavTone({ tone }: { tone: Tone }) {
  const ctx = useContext(NavToneContext)
  useEffect(() => {
    ctx?.setTone(tone)
  }, [ctx, tone])
  return null
}
