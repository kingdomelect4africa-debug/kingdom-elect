import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'gold' | 'navy' | 'line' | 'line-navy'
type Size = 'md' | 'sm'

const variantClasses: Record<Variant, string> = {
  // A band of light sweeps across on hover (Motion Identity: "Light Rays").
  gold: 'relative isolate overflow-hidden bg-gold text-navy-deep hover:bg-gold-light before:absolute before:inset-y-0 before:-left-1/3 before:-z-10 before:w-1/4 before:-skew-x-[20deg] before:bg-ivory/45 before:opacity-0 before:transition-[translate,opacity] before:duration-700 before:ease-[var(--ease-signature)] hover:before:translate-x-[620%] hover:before:opacity-100',
  navy: 'bg-navy text-ivory hover:bg-navy-light',
  line: 'border border-line-strong text-ink hover:border-ink',
  'line-navy': 'border border-line-navy-strong text-ivory hover:border-ivory',
}

const sizeClasses: Record<Size, string> = {
  md: 'px-7 py-[0.95rem] text-[0.8rem]',
  sm: 'px-5 py-[0.65rem] text-[0.72rem]',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-sans font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-[background,color,border-color,transform] duration-300 ease-[var(--ease-signature)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none'

type ButtonProps = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
)

export function Button({ children, variant = 'navy', size = 'md', className, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if ('href' in props && props.href) {
    const { href, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
