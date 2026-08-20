import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from '@/components/admin/LoginForm'
import { Logo } from '@/components/marketing/Logo'

export const metadata: Metadata = { title: 'Staff Login', robots: { index: false } }

export default async function AdminLoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/admin/dashboard')

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo tone="dark" />
        </div>
        <div className="border border-border-subtle bg-surface p-8">
          <h1 className="font-serif text-2xl font-medium text-brand-primary">Staff Login</h1>
          <p className="mt-2 font-sans text-sm text-ink-muted">Sign in to manage Kingdom E.L.E.C.T. for Africa.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
