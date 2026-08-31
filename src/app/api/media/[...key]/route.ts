import { NextResponse, type NextRequest } from 'next/server'
import { getObject } from '@/lib/r2'
import { getCurrentUser } from '@/lib/auth'

/**
 * Streams an object from the (private) R2 bucket. Anything under
 * `private/` requires an authenticated admin session — everything else
 * (media/library/*) is public, matching what it's used for on the site.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await params
  const key = keyParts.map(decodeURIComponent).join('/')

  if (key.startsWith('private/')) {
    const user = await getCurrentUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const object = await getObject(key)
    if (!object.Body) return new NextResponse('Not found', { status: 404 })

    const body = await object.Body.transformToByteArray()
    return new NextResponse(Buffer.from(body), {
      headers: {
        'Content-Type': object.ContentType ?? 'application/octet-stream',
        'Content-Length': String(object.ContentLength ?? body.length),
        'Cache-Control': key.startsWith('private/') ? 'private, no-store' : 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
