import Link from 'next/link'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-primary text-ink-inverse hover:bg-navy-600 focus-visible:outline-navy-500',
  secondary:
    'bg-transparent text-brand-primary border border-border-strong hover:bg-navy-50 focus-visible:outline-navy-500',
  ghost: 'bg-transparent text-ink-inverse border border-white/30 hover:bg-white/10 focus-visible:outline-white',
  gold: 'bg-brand-accent text-navy-900 hover:bg-gold-600 focus-visible:outline-gold-600',
}

const sizeClasses: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-none font-sans font-semibold uppercase tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none'

type ButtonProps = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
)

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
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
