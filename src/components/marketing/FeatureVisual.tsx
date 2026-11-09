import { KingdomGrid } from '@/components/devices/KingdomGrid'
import { InfluenceLines } from '@/components/devices/InfluenceLines'
import { RisingPillars } from '@/components/devices/RisingPillars'
import { cn } from '@/lib/cn'

/**
 * The navy half of a featured program or event card: the Kingdom Grid, a
 * brand motif that draws itself in on arrival, and whatever the caller puts
 * on top (a date, a countdown). Brightens slightly when its card is hovered
 * (the card carries `group`).
 */
export function FeatureVisual({
  id,
  motif,
  children,
  className,
}: {
  id: string
  motif: 'pillars' | 'arcs'
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative isolate overflow-hidden bg-navy text-ivory', className)}>
      <div
        className="absolute inset-0 -z-10 transition-transform duration-[1.2s] ease-[var(--ease-signature)] group-hover:scale-[1.04]"
        style={{ background: 'radial-gradient(90% 90% at 100% 100%, rgba(201,146,24,0.28), transparent 60%), radial-gradient(70% 70% at 0% 0%, rgba(28,59,102,0.7), transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 text-ivory opacity-[0.08]" aria-hidden="true">
        <KingdomGrid id={`${id}-grid`} className="h-full w-full" />
      </div>
      {motif === 'pillars' ? (
        <RisingPillars inView delay={0.2} className="absolute bottom-0 right-[10%] -z-10 h-[72%]" />
      ) : (
        <InfluenceLines className="absolute bottom-0 right-0 -z-10 h-full w-full" />
      )}
      {children}
    </div>
  )
}
