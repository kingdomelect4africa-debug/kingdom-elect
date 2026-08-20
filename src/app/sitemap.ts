import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const STATIC_PATHS = [
  '', '/about', '/the-situation-room', '/the-five', '/programs', '/events',
  '/insights', '/stories', '/partners', '/get-involved', '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

  const [events, programs, articles, stories, chapters] = await Promise.all([
    prisma.event.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.program.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.story.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.chapter.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  const staticEntries = STATIC_PATHS.map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))

  const dynamicEntries = [
    ...events.map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: e.updatedAt })),
    ...programs.map((p) => ({ url: `${base}/programs/${p.slug}`, lastModified: p.updatedAt })),
    ...articles.map((a) => ({ url: `${base}/insights/${a.slug}`, lastModified: a.updatedAt })),
    ...stories.map((s) => ({ url: `${base}/stories/${s.slug}`, lastModified: s.updatedAt })),
    ...chapters.map((c) => ({ url: `${base}/chapters/${c.slug}`, lastModified: c.updatedAt })),
  ]

  return [...staticEntries, ...dynamicEntries]
}
