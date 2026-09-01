const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://kingdomelect4africa.online'

const colors = {
  navy: '#0B1F3A',
  navyDeep: '#071120',
  gold: '#C99218',
  goldLight: '#D9B35D',
  ivory: '#F7F3EA',
  outerBg: '#EFEAE0',
  ink: '#252525',
  muted: '#6B6558',
}

const serifStack = "Georgia, 'Times New Roman', Times, serif"
const sansStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

export function EmailLayout({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: colors.outerBg, fontFamily: sansStack }}>
        <span style={{ display: 'none', overflow: 'hidden', lineHeight: 1, opacity: 0, maxHeight: 0, maxWidth: 0 }}>
          {preview}
        </span>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: colors.outerBg }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '32px 16px' }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ maxWidth: 560, backgroundColor: '#FFFFFF', border: `1px solid #E4DFD2` }}
                >
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor: colors.navy, padding: '28px 36px' }}>
                        <table role="presentation" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td style={{ verticalAlign: 'middle', paddingRight: 12 }}>
                                {/* eslint-disable-next-line @next/next/no-img-element -- email HTML, not a Next page */}
                                <img src={`${SITE_URL}/brand/logo-mark.png`} width={34} height={28} alt="" style={{ display: 'block' }} />
                              </td>
                              <td style={{ verticalAlign: 'middle' }}>
                                <span style={{ fontFamily: serifStack, fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>
                                  Kingdom E.L.E.C.T.
                                </span>
                                <br />
                                <span style={{ fontFamily: sansStack, fontSize: 10, letterSpacing: '0.12em', color: colors.goldLight, textTransform: 'uppercase' }}>
                                  For Africa
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '40px 36px' }}>{children}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '24px 36px', borderTop: '1px solid #EEE9DC' }}>
                        <p style={{ margin: 0, fontFamily: sansStack, fontSize: 12, lineHeight: '20px', color: colors.muted }}>
                          Kingdom E.L.E.C.T. for Africa &middot; Abuja, Nigeria
                          <br />
                          <a href={SITE_URL} style={{ color: colors.muted }}>
                            kingdomelect4africa.online
                          </a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

export function EmailHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ margin: '0 0 16px', fontFamily: serifStack, fontSize: 24, fontWeight: 700, color: colors.navy, lineHeight: 1.25 }}>
      {children}
    </h1>
  )
}

export function EmailText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ margin: '0 0 16px', fontFamily: sansStack, fontSize: 15, lineHeight: '26px', color: colors.ink, ...style }}>
      {children}
    </p>
  )
}

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} style={{ margin: '8px 0 24px' }}>
      <tbody>
        <tr>
          <td style={{ backgroundColor: colors.gold, borderRadius: 3 }}>
            <a
              href={href}
              style={{
                display: 'inline-block',
                padding: '13px 28px',
                fontFamily: sansStack,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: colors.navyDeep,
                textDecoration: 'none',
              }}
            >
              {children}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export function EmailDivider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #EEE9DC', margin: '24px 0' }} />
}

export function EmailFieldRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 10 }}>
      <tbody>
        <tr>
          <td style={{ width: 190, verticalAlign: 'top', paddingRight: 12, fontFamily: sansStack, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.muted }}>
            {label}
          </td>
          <td style={{ verticalAlign: 'top', fontFamily: sansStack, fontSize: 14, lineHeight: '22px', color: colors.ink }}>{value}</td>
        </tr>
      </tbody>
    </table>
  )
}

export { colors, serifStack, sansStack, SITE_URL }
