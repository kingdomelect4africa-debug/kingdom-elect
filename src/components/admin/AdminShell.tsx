import { logout } from '@/lib/actions/auth'
import { ROLE_LABELS, accessibleDomains } from '@/lib/rbac'
import type { SessionUser } from '@/lib/auth'
import { AdminSidebar } from './AdminSidebar'
import { LogoMark } from '@/components/marketing/LogoMark'

export function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const accessible = accessibleDomains(user)

  return (
    <div className="flex min-h-screen bg-navy-50">
      <aside className="hidden w-64 shrink-0 bg-brand-primary lg:block">
        <div className="flex items-center gap-3 px-6 py-6">
          <LogoMark className="h-8" />
          <span className="font-serif text-sm text-ink-inverse">Kingdom E.L.E.C.T.</span>
        </div>
        <AdminSidebar accessible={accessible} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-subtle bg-surface px-6">
          <p className="font-sans text-sm text-ink-muted">Admin</p>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-sans text-sm font-medium text-ink">{user.name}</p>
              <p className="font-sans text-xs text-ink-muted">{ROLE_LABELS[user.role]}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="font-sans text-xs font-semibold uppercase text-brand-primary hover:underline" style={{ letterSpacing: '0.06em' }}>
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
