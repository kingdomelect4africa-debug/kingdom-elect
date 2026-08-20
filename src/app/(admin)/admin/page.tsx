import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function AdminRootPage() {
  const user = await getCurrentUser()
  redirect(user ? '/admin/dashboard' : '/admin/login')
}
