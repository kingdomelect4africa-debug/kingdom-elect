/** Masked grid backdrop behind the hero — pure CSS, no motion needed. */
export function HeroGridLines({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(var(--color-line-navy) 1px, transparent 1px), linear-gradient(90deg, var(--color-line-navy) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 75% 65% at 30% 35%, black 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 30% 35%, black 0%, transparent 75%)',
      }}
      aria-hidden="true"
    />
  )
}
