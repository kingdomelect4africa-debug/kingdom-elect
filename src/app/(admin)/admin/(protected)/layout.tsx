import type { Metadata } from 'next'
import { requireAdminUser } from '@/lib/actions/auth'
import { AdminShell } from '@/components/admin/AdminShell'

export const metadata: Metadata = { robots: { index: false } }

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser()
  return <AdminShell user={user}>{children}</AdminShell>
}
