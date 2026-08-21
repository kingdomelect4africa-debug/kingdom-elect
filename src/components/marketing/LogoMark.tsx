import Image from 'next/image'

/**
 * Kingdom E.L.E.C.T. compact mark — the approved brand mark (rising gold
 * pillars above an open navy book, cradling Africa), extracted from the
 * brand book at public/Logo Mark.png. Full color; reads cleanly on both
 * light and dark surfaces at real UI sizes (see scripts/extract-logo.js).
 * Source asset is 520x420 (~1.24:1) — size via height and let width auto.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      width={520}
      height={420}
      className={className}
      style={{ width: 'auto', objectFit: 'contain' }}
      priority
    />
  )
}
