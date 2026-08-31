'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Domain } from '@/lib/rbac'
import { AdminSidebar } from './AdminSidebar'
import { LogoMark } from '@/components/marketing/LogoMark'

export function AdminMobileNav({ accessible }: { accessible: Domain[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-9 w-9 shrink-0 items-center justify-center lg:hidden"
      >
        <span className="relative block h-[13px] w-[18px]">
          <span className="absolute inset-x-0 top-0 h-[1.5px] bg-ink" />
          <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-ink" />
          <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-ink" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-brand-primary lg:hidden"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-6">
                <div className="flex items-center gap-3">
                  <LogoMark className="h-8" />
                  <span className="font-serif text-sm text-ink-inverse">Kingdom E.L.E.C.T.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="font-sans text-2xl leading-none text-ivory-600 hover:text-ink-inverse"
                >
                  ×
                </button>
              </div>
              <AdminSidebar accessible={accessible} onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
