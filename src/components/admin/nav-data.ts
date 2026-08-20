import type { Domain } from '@/lib/rbac'

export type AdminNavItem = { label: string; href: string; domain: Domain }
export type AdminNavGroup = { label: string; items: AdminNavItem[] }

export const ADMIN_NAV: AdminNavGroup[] = [
  { label: '', items: [{ label: 'Dashboard', href: '/admin/dashboard', domain: 'dashboard' }] },
  {
    label: 'Pages',
    items: [
      { label: 'Homepage', href: '/admin/pages/home', domain: 'content' },
      { label: 'About', href: '/admin/pages/about', domain: 'content' },
      { label: 'The Situation Room', href: '/admin/pages/situation-room', domain: 'content' },
      { label: 'The Five', href: '/admin/pages/the-five', domain: 'content' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Articles (Insights)', href: '/admin/articles', domain: 'content' },
      { label: 'Stories', href: '/admin/stories', domain: 'content' },
      { label: 'Media Library', href: '/admin/media', domain: 'media' },
    ],
  },
  {
    label: 'Events',
    items: [
      { label: 'Events', href: '/admin/events', domain: 'events' },
      { label: 'Registrations', href: '/admin/registrations', domain: 'events' },
      { label: 'Check-In', href: '/admin/checkin', domain: 'checkin' },
    ],
  },
  {
    label: 'Programs',
    items: [
      { label: 'Programs', href: '/admin/programs', domain: 'programs' },
      { label: 'Applications', href: '/admin/applications', domain: 'programs' },
    ],
  },
  {
    label: 'People & Ecosystem',
    items: [
      { label: 'People', href: '/admin/people', domain: 'people' },
      { label: 'Chapters', href: '/admin/chapters', domain: 'people' },
      { label: 'Partners', href: '/admin/organizations', domain: 'people' },
      { label: 'Partnerships', href: '/admin/partnerships', domain: 'finance' },
    ],
  },
  {
    label: 'Communication',
    items: [{ label: 'Inquiries', href: '/admin/inquiries', domain: 'communications' }],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Form Builder', href: '/admin/forms', domain: 'forms' },
      { label: 'Site Settings', href: '/admin/settings', domain: 'settings' },
      { label: 'Users', href: '/admin/users', domain: 'users' },
    ],
  },
]
