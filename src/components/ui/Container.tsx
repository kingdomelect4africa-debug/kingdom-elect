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
        'mx-auto w-full px-6 md:px-10 lg:px-16',
        wide ? 'max-w-[1600px]' : 'max-w-[1280px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
