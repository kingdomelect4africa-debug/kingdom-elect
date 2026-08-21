import { cn } from '@/lib/cn'

export function Container({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode
  className?: string
  wide?: boolean
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-[clamp(1.5rem,5vw,4rem)]',
        wide ? 'max-w-[1600px]' : 'max-w-[1240px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
