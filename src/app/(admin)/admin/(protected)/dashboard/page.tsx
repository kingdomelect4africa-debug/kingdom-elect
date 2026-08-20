import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdminUser } from '@/lib/actions/auth'
import { PageHeader } from '@/components/admin/ui'

export default async function AdminDashboardPage() {
  const user = await requireAdminUser()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const now = new Date()

  const [
    newRegistrations, newApplications, newPeople, unreadInquiries,
    upcomingEvents, draftArticles, pendingApplications,
  ] = await Promise.all([
    prisma.registration.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.application.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.person.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: now } } }),
    prisma.article.count({ where: { status: 'DRAFT' } }),
    prisma.application.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
  ])

  const stats = [
    { label: 'New Registrations (7d)', value: newRegistrations, href: '/admin/registrations' },
    { label: 'New Applications (7d)', value: newApplications, href: '/admin/applications' },
    { label: 'New People (7d)', value: newPeople, href: '/admin/people' },
    { label: 'Unread Messages', value: unreadInquiries, href: '/admin/inquiries' },
    { label: 'Upcoming Events', value: upcomingEvents, href: '/admin/events' },
    { label: 'Draft Articles', value: draftArticles, href: '/admin/articles' },
    { label: 'Pending Applications', value: pendingApplications, href: '/admin/applications' },
  ]

  const quickActions = [
    { label: 'Create Article', href: '/admin/articles/new' },
    { label: 'Create Event', href: '/admin/events/new' },
    { label: 'Create Program', href: '/admin/programs/new' },
    { label: 'Create Registration Form', href: '/admin/forms/new' },
    { label: 'Add Partner', href: '/admin/organizations/new' },
    { label: 'Create Chapter', href: '/admin/chapters/new' },
  ]

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} description="Here's what needs your attention right now." />

      <div className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-surface p-6 transition-colors hover:bg-navy-50">
            <p className="font-serif text-3xl text-brand-primary">{stat.value}</p>
            <p className="mt-1 font-sans text-xs uppercase text-ink-muted" style={{ letterSpacing: '0.05em' }}>{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <p className="mb-4 font-sans text-xs font-semibold uppercase text-ink-muted" style={{ letterSpacing: '0.08em' }}>Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="border border-border-strong px-4 py-2.5 font-sans text-xs font-semibold uppercase text-brand-primary transition-colors hover:border-brand-accent"
              style={{ letterSpacing: '0.05em' }}
            >
              {action.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
