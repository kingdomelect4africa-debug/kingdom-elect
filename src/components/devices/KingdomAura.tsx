/**
 * Bespoke abstract illustration — a soft, slowly-drifting gradient glow
 * (gold/emerald/navy-light) beneath fine concentric orbit rings and node
 * points. Stands in for photography across the hero sections: on-brand,
 * infinitely crisp, no licensing surface, and consistent with the rest of
 * the signature device family (HeroBars, HeroGridLines, NetworkNodes).
 */
export function KingdomAura({ className, tone = 'navy' }: { className?: string; tone?: 'navy' | 'deep' }) {
  const ringStroke = tone === 'deep' ? 'rgba(247,243,234,0.16)' : 'rgba(247,243,234,0.14)'
  const ringStrokeBright = tone === 'deep' ? 'rgba(217,179,93,0.55)' : 'rgba(217,179,93,0.48)'

  return (
    <div className={className} style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
      <div
        className="absolute inset-[-20%] animate-[mediashift_16s_ease_infinite]"
        style={{
          backgroundImage: `
            radial-gradient(28% 28% at 80% 20%, rgba(201,146,24,0.5) 0%, rgba(201,146,24,0) 68%),
            radial-gradient(24% 24% at 15% 82%, rgba(18,60,42,0.55) 0%, rgba(18,60,42,0) 70%),
            radial-gradient(55% 55% at 50% 50%, rgba(28,59,102,0.32) 0%, rgba(28,59,102,0) 78%)
          `,
          backgroundSize: '220% 220%',
          filter: 'blur(48px)',
        }}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <circle cx="60" cy="44" r="36" fill="none" stroke={ringStroke} strokeWidth="0.25" />
        <circle cx="60" cy="44" r="25" fill="none" stroke={ringStroke} strokeWidth="0.25" />
        <circle cx="60" cy="44" r="14.5" fill="none" stroke={ringStrokeBright} strokeWidth="0.35" />

        <line x1="60" y1="44" x2="88" y2="24" stroke={ringStrokeBright} strokeWidth="0.2" />
        <line x1="60" y1="44" x2="27" y2="60" stroke={ringStroke} strokeWidth="0.2" />
        <line x1="60" y1="44" x2="46" y2="12" stroke={ringStroke} strokeWidth="0.2" />

        <circle cx="60" cy="44" r="2.4" fill="var(--color-gold-300)" />
        <circle cx="88" cy="24" r="1.2" fill="var(--color-gold-300)" opacity="0.9" />
        <circle cx="27" cy="60" r="1" fill="var(--color-ivory)" opacity="0.55" />
        <circle cx="46" cy="12" r="0.9" fill="var(--color-ivory)" opacity="0.5" />
        <circle cx="82" cy="70" r="1.1" fill="var(--color-ivory)" opacity="0.4" />
        <circle cx="18" cy="30" r="0.8" fill="var(--color-ivory)" opacity="0.4" />
      </svg>
    </div>
  )
}
