import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { randomBytes } from 'crypto'

const REQUIRED_ENV = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'] as const

function getEnv(name: (typeof REQUIRED_ENV)[number]): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

let cachedClient: S3Client | null = null

/** Server-only R2 client — credentials never leave this module. */
function getR2Client(): S3Client {
  if (cachedClient) return cachedClient
  cachedClient = new S3Client({
    region: 'auto',
    endpoint: `https://${getEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: getEnv('R2_SECRET_ACCESS_KEY'),
    },
  })
  return cachedClient
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(-120)
}

/**
 * Builds a namespaced, collision-safe object key.
 * e.g. media/library/2026/08/4f9a1c2b-annual-report.pdf
 */
export function buildObjectKey(prefix: 'media/library' | 'private/registrations' | 'private/applications', originalFilename: string): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const unique = randomBytes(8).toString('hex')
  return `${prefix}/${year}/${month}/${unique}-${sanitizeFilename(originalFilename)}`
}

export async function uploadObject(key: string, body: Buffer, contentType: string): Promise<void> {
  const client = getR2Client()
  await client.send(
    new PutObjectCommand({
      Bucket: getEnv('R2_BUCKET'),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
}

export async function deleteObject(key: string): Promise<void> {
  const client = getR2Client()
  await client.send(new DeleteObjectCommand({ Bucket: getEnv('R2_BUCKET'), Key: key }))
}

export async function getObject(key: string) {
  const client = getR2Client()
  return client.send(new GetObjectCommand({ Bucket: getEnv('R2_BUCKET'), Key: key }))
}

/**
 * Delivery path for an object — a same-origin route that streams the file
 * from R2 server-side (§ private-vs-public split from the infra brief: the
 * bucket itself stays private, this route is what decides what's servable).
 * Swapping to a public R2 custom domain later is a one-line change here,
 * with no schema change needed since Media.url is derived, not hand-set.
 */
export function deliveryUrlFor(key: string): string {
  return `/api/media/${key.split('/').map(encodeURIComponent).join('/')}`
}
