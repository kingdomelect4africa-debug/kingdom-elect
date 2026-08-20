import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { PageHeader, PrimaryLinkButton, EmptyState, Badge, th, td, tr } from '@/components/admin/ui'
import { formatDate } from '@/lib/format'

const STATUS_TONE: Record<string, 'default' | 'success' | 'warning' | 'muted'> = {
  DRAFT: 'muted',
  IN_REVIEW: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'default',
}

export default async function AdminArticlesPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const articles = await prisma.article.findMany({
    where: user.role === 'AUTHOR' ? { createdById: user.id } : {},
    orderBy: { updatedAt: 'desc' },
    include: {
      authors: { include: { person: { select: { firstName: true, lastName: true } } } },
    },
  })

  return (
    <div>
      <PageHeader
        title="Articles"
        description="Kingdom Intelligence — research, briefings, and strategic perspective published to /insights."
        actions={<PrimaryLinkButton href="/admin/articles/new">Create Article</PrimaryLinkButton>}
      />

      {articles.length === 0 ? (
        <EmptyState
          title="No articles yet."
          body="Create the first Kingdom Intelligence briefing to see it appear here."
          actionLabel="Create Article"
          actionHref="/admin/articles/new"
        />
      ) : (
        <div className="overflow-x-auto border border-border-subtle">
          <table className="w-full min-w-[860px]">
            <thead className="bg-navy-50">
              <tr>
                <th className={th}>Title</th>
                <th className={th}>Category</th>
                <th className={th}>Authors</th>
                <th className={th}>Published</th>
                <th className={th}>Status</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className={tr}>
                  <td className={td}>{article.title}</td>
                  <td className={td}>{article.category.replace(/_/g, ' ')}</td>
                  <td className={td}>
                    {article.authors.length > 0
                      ? article.authors.map((a) => `${a.person.firstName} ${a.person.lastName}`).join(', ')
                      : '—'}
                  </td>
                  <td className={td}>{article.publishedDate ? formatDate(article.publishedDate) : '—'}</td>
                  <td className={td}>
                    <Badge tone={STATUS_TONE[article.status] ?? 'default'}>{article.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className={td}>
                    <Link href={`/admin/articles/${article.id}`} className="text-brand-primary underline-offset-4 hover:underline">
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
