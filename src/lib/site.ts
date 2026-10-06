import { headers } from 'next/headers'

/**
 * Origin of the public site for links an admin shares. Derived from the
 * current request so it's right on every deployment (production, preview,
 * local) — the admin is served on `admin.<domain>` (see src/proxy.ts), and
 * that prefix is stripped because /forms etc. don't exist on the admin host.
 */
export async function publicOrigin(): Promise<string> {
  const h = await headers()
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? '').replace(/^admin\./, '')
  if (!host) return process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
