'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ADMIN_NAV } from './nav-data'
import type { Domain } from '@/lib/rbac'
import { cn } from '@/lib/cn'

export function AdminSidebar({ accessible }: { accessible: Domain[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      {ADMIN_NAV.map((group, gi) => {
        const items = group.items.filter((item) => accessible.includes(item.domain))
        if (items.length === 0) return null
        return (
          <div key={gi}>
            {group.label && (
              <p className="mb-2 px-3 font-sans text-[10px] font-semibold uppercase text-ivory-700" style={{ letterSpacing: '0.1em' }}>
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-sm px-3 py-2 font-sans text-sm transition-colors',
                      active ? 'bg-white/10 text-ink-inverse' : 'text-ivory-600 hover:bg-white/5 hover:text-ink-inverse',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
