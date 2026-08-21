import { cn } from '@/lib/cn'

const HEIGHTS = [22, 38, 54, 72, 94]

/**
 * The five rising gold bars — a continuous gentle pulse, not a scroll
 * reveal (matches the reference). Caller controls position/size via
 * className (e.g. "absolute right-[4%] bottom-0 h-[62%] opacity-85").
 */
export function HeroBars({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-end gap-[clamp(6px,1vw,14px)]', className)} aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="w-[clamp(6px,1.1vw,16px)] rounded-t-[2px]"
          style={{
            height: `${h}%`,
            background: 'linear-gradient(180deg, var(--color-gold-light), var(--color-gold) 70%, transparent)',
            animation: 'bar-rise 3.2s var(--ease-signature) infinite alternate',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}
