import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Logo } from './Logo'
import { RadiatingLines } from '@/components/devices/RadiatingLines'

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } })

  return (
    <footer className="relative overflow-hidden bg-brand-primary text-ink-inverse">
      <RadiatingLines className="absolute -right-20 -top-20 h-[420px] w-[420px] text-white" origin="top-right" lines={20} />
      <Container className="relative py-20">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo tone="light" />
            <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-ivory-600">
              {settings?.footerText ??
                'Mobilizing Kingdom influence for Africa\'s transformation.'}
            </p>
          </div>

          <FooterColumn
            heading="Explore"
            links={[
              { label: 'About', href: '/about' },
              { label: 'The Situation Room', href: '/the-situation-room' },
              { label: 'E.L.E.C.T.', href: '/the-five' },
              { label: 'Kingdom Intelligence', href: '/insights' },
            ]}
          />

          <FooterColumn
            heading="Participate"
            links={[
              { label: 'Programs', href: '/programs' },
              { label: 'Events', href: '/events' },
              { label: 'Get Involved', href: '/get-involved' },
              { label: 'Contact', href: '/contact' },
            ]}
          />

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: 'var(--tracking-label)' }}>
              Contact
            </h3>
            <ul className="mt-5 space-y-2 font-sans text-sm text-ivory-600">
              {settings?.contactEmail && <li>{settings.contactEmail}</li>}
              {settings?.contactPhone && <li>{settings.contactPhone}</li>}
              {settings?.address && <li>{settings.address}</li>}
            </ul>
            <a
              href="/admin/login"
              className="mt-6 inline-block font-sans text-xs uppercase text-ivory-700 underline-offset-4 hover:text-ivory-500 hover:underline"
              style={{ letterSpacing: 'var(--tracking-label)' }}
            >
              Staff Login
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-8 font-sans text-xs text-ivory-700 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {settings?.siteName ?? 'Kingdom E.L.E.C.T. for Africa'}. All rights reserved.</p>
          <p className="uppercase" style={{ letterSpacing: 'var(--tracking-label)' }}>
            {settings?.tagline ?? 'Building Influence. Transforming Africa.'}
          </p>
        </div>
      </Container>
    </footer>
  )
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-sans text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: 'var(--tracking-label)' }}>
        {heading}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="font-sans text-sm text-ivory-600 transition-colors hover:text-ivory-500">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
