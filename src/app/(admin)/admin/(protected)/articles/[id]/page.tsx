import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { canEditArticle, canPublish } from '@/lib/rbac'
import { updateArticle, deleteArticle } from '@/lib/actions/admin/articles'
import { PageHeader, SubmitButton } from '@/components/admin/ui'
import { SavedBanner } from '@/components/admin/SavedBanner'
import { ArticleForm } from '@/components/admin/articles/ArticleForm'

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const [article, people, programs, events] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { authors: true, createdBy: { select: { name: true } } },
    }),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
    prisma.program.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
  ])

  if (!article) notFound()

  const editable = canEditArticle(user, article)
  const canDelete = user.role === 'CONTENT_EDITOR' || user.role === 'SUPER_ADMIN'

  return (
    <div>
      <PageHeader
        title={article.title}
        description={article.createdBy ? `Created by ${article.createdBy.name}` : undefined}
        actions={
          <Link
            href="/insights"
            className="font-sans text-xs font-semibold uppercase text-brand-primary underline-offset-4 hover:underline"
            style={{ letterSpacing: '0.06em' }}
          >
            View Kingdom Intelligence →
          </Link>
        }
      />
      <SavedBanner saved={saved === '1'} />

      {editable ? (
        <ArticleForm
          action={updateArticle.bind(null, article.id)}
          article={article}
          people={people}
          programs={programs}
          events={events}
          allowPublish={canPublish(user)}
        />
      ) : (
        <p className="max-w-3xl border border-border-subtle bg-navy-50 p-6 font-sans text-sm text-ink-muted">
          You do not have permission to edit this article. Authors may only edit their own drafts that have not yet been
          published.
        </p>
      )}

      {canDelete && (
        <form action={deleteArticle.bind(null, article.id)} className="mt-8">
          <SubmitButton variant="danger">Delete Article</SubmitButton>
        </form>
      )}
    </div>
  )
}
