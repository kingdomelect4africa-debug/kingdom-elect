const NODES: [number, number, number][] = [
  [150, 100, 3],
  [400, 220, 4],
  [700, 120, 3],
  [650, 380, 3],
  [950, 300, 3],
  [1000, 180, 3],
]

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [2, 5],
]

/** Static node/link graph — the "continental network of reformers" motif. */
export function NetworkNodes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {LINKS.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="var(--color-line-navy-strong)"
          strokeWidth={1}
        />
      ))}
      {NODES.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="var(--color-gold-light)" />
      ))}
    </svg>
  )
}
