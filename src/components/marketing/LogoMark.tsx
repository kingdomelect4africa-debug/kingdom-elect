/**
 * Original Kingdom E.L.E.C.T. compact mark: five ascending forms fanning
 * upward from one baseline — at once the five pillars (Educators, Leaders,
 * Entrepreneurs, Creatives, Technocrats), rising vertical forms, and the
 * open pages of a book. Deliberately abstract/geometric rather than a
 * literal continent silhouette.
 */
export function LogoMark({ className, color = 'currentColor' }: { className?: string; color?: string }) {
  const bars = [
    { x: 2, h: 14, y: 26 },
    { x: 9, h: 20, y: 20 },
    { x: 16, h: 26, y: 14 },
    { x: 23, h: 20, y: 20 },
    { x: 30, h: 14, y: 26 },
  ]

  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={5} height={b.h} fill={color} opacity={1 - Math.abs(i - 2) * 0.2} />
      ))}
    </svg>
  )
}
