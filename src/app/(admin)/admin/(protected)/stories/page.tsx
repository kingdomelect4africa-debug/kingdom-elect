import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'
import { formatDate } from '@/lib/format'

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  DRAFT: 'muted',
  IN_REVIEW: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'default',
}

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { personFeatured: { select: { firstName: true, lastName: true } } },
  })

  return (
    <div>
      <PageHeader
        title="Stories"
        description="Personal impact stories published to /stories."
        actions={<PrimaryLinkButton href="/admin/stories/new">Create Story</PrimaryLinkButton>}
      />

      {stories.length === 0 ? (
        <EmptyState
          title="No stories yet."
          body="Create the first story to see it appear on the public site."
          actionLabel="Create Story"
          actionHref="/admin/stories/new"
        />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[720px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Featured Person</th>
                <th className={th}>Published</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story) => (
                <tr key={story.id} className={tr}>
                  <td className={td}>{story.title}</td>
                  <td className={td}>{story.personFeatured.firstName} {story.personFeatured.lastName}</td>
                  <td className={td}>{story.publishedDate ? formatDate(story.publishedDate) : '—'}</td>
                  <td className={td}>
                    <Badge tone={STATUS_TONE[story.status] ?? 'default'}>{story.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/stories/${story.id}`} className="text-brand-primary underline-offset-4 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
