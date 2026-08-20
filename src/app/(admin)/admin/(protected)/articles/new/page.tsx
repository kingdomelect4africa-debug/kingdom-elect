import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { canPublish } from '@/lib/rbac'
import { createArticle } from '@/lib/actions/admin/articles'
import { PageHeader } from '@/components/admin/ui'
import { ArticleForm } from '@/components/admin/articles/ArticleForm'

export default async function NewArticlePage() {
  const [user, people, programs, events] = await Promise.all([
    getCurrentUser(),
    prisma.person.findMany({ orderBy: { firstName: 'asc' }, select: { id: true, firstName: true, lastName: true } }),
    prisma.program.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    prisma.event.findMany({ orderBy: { startDate: 'desc' }, select: { id: true, title: true } }),
  ])

  return (
    <div>
      <PageHeader title="Create Article" description="Publishes to Kingdom Intelligence (/insights) once approved." />
      <ArticleForm
        action={createArticle}
        people={people}
        programs={programs}
        events={events}
        allowPublish={user ? canPublish(user) : false}
      />
    </div>
  )
}
