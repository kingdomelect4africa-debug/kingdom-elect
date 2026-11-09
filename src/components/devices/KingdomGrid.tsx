/**
 * The brand's "Kingdom Grid": interlocking isometric cubes standing for order
 * and the systems that build nations (Brand Patterns sheet). Tiles endlessly
 * in currentColor; the brand guide asks for 5–15% opacity, which the caller
 * sets along with any mask.
 */

const S = 28 // cube edge
const W = S * Math.sqrt(3)

function cube(cx: number, cy: number) {
  const h = W / 2
  const p = (x: number, y: number) => `${+(cx + x).toFixed(2)},${+(cy + y).toFixed(2)}`
  // Hexagon outline, then the "Y" that turns it into a cube.
  return (
    `M${p(0, -S)}L${p(h, -S / 2)}L${p(h, S / 2)}L${p(0, S)}L${p(-h, S / 2)}L${p(-h, -S / 2)}Z` +
    `M${p(-h, -S / 2)}L${p(0, 0)}L${p(h, -S / 2)}M${p(0, 0)}L${p(0, S)}`
  )
}

// One tile holds a full cube plus the halves that complete its neighbours.
const TILE = [cube(W / 2, S), cube(0, 2.5 * S), cube(W, 2.5 * S), cube(0, -0.5 * S), cube(W, -0.5 * S)].join('')

export function KingdomGrid({ id, className, strokeWidth = 0.8 }: { id: string; className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id={id} width={W} height={3 * S} patternUnits="userSpaceOnUse">
          <path d={TILE} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
