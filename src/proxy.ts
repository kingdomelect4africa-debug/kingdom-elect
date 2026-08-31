import { NextResponse, type NextRequest } from 'next/server'

/**
 * Hostname-based split between the public site and the admin CMS.
 *
 * admin.kingdomelect4africa.online is a genuinely distinct origin (own
 * cookies, own routing namespace) even though it's served from the same
 * Next.js deployment as the public site — DNS/Vercel already had both
 * domains attached to this one project before this middleware existed, so
 * this achieves the required separation without tearing down working
 * domain config to stand up a second deployment. It never exposes the
 * public marketing site, and the public domain never exposes /admin.
 */
export function proxy(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const { pathname, search } = request.nextUrl
  const isAdminHost = host.startsWith('admin.')

  const isAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png' ||
    pathname.startsWith('/brand/') ||
    pathname.startsWith('/uploads/') ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$/.test(pathname)

  if (isAsset) return NextResponse.next()

  if (isAdminHost) {
    if (pathname.startsWith('/admin')) return NextResponse.next()
    const url = request.nextUrl.clone()
    url.pathname = `/admin${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  // On the public domain(s), /admin is never reachable — send it to the
  // dedicated admin host instead of exposing it as a path here. Skipped in
  // local dev (no separate admin.localhost DNS) so `npm run dev` keeps
  // working exactly as before.
  if (pathname.startsWith('/admin') && host !== 'localhost' && !host.endsWith('.vercel.app')) {
    const url = request.nextUrl.clone()
    url.hostname = `admin.${host.replace(/^www\./, '')}`
    url.search = search
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
