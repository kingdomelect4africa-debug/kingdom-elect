import { prisma } from '@/lib/db'
import { Container } from '@/components/ui/Container'
import { Logo } from './Logo'

export async function Footer() {
  // Falls back to defaults rather than throwing: the footer renders on
  // every page (including static builds like /_not-found), so a database
  // being unreachable at build/request time should degrade gracefully
  // instead of failing the page — or the whole build — outright.
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null)

  return (
    <footer className="border-t border-line-navy bg-navy-deep text-ivory">
      <Container>
        <div className="grid gap-10 py-[clamp(3rem,6vw,4rem)] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo tone="dark" />
            <p className="mt-4 max-w-[280px] font-sans text-[0.85rem] leading-[1.7] text-faint-on-navy">
              {settings?.footerText ?? "Mobilizing Kingdom influence for Africa's transformation."}
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
            <span className="mb-[1.1rem] block font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.14em' }}>
              Contact
            </span>
            <ul className="flex flex-col gap-[0.7rem] font-sans text-[0.85rem] text-body-on-navy">
              {settings?.contactEmail && <li>{settings.contactEmail}</li>}
              {settings?.supportEmail && <li>{settings.supportEmail}</li>}
              {settings?.contactPhone && <li>{settings.contactPhone}</li>}
              {settings?.address && <li>{settings.address}</li>}
              <li>
                <a href="/admin/login" className="opacity-55 transition-opacity hover:opacity-100">
                  Staff Login
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-navy py-6 font-sans text-[0.72rem] text-faint-on-navy" style={{ letterSpacing: '0.04em' }}>
          <span>© {new Date().getFullYear()} {settings?.siteName ?? 'Kingdom E.L.E.C.T. for Africa'}. All rights reserved.</span>
          <span>{settings?.tagline ?? 'Building Influence. Transforming Africa.'}</span>
        </div>
      </Container>
    </footer>
  )
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <span className="mb-[1.1rem] block font-sans text-[0.68rem] font-bold uppercase text-gold-light" style={{ letterSpacing: '0.14em' }}>
        {heading}
      </span>
      <ul className="flex flex-col gap-[0.7rem]">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="font-sans text-[0.85rem] text-body-on-navy transition-colors hover:text-ivory">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
