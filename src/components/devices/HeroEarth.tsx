import Image from 'next/image'

/**
 * The Blue Marble (Apollo 17, NASA — public domain, no license restrictions)
 * with Africa and Madagascar centered in frame. Sits behind the grid lines
 * and gold bars as a faded backdrop, not a literal photo — the radial mask
 * dissolves its edges so it reads as atmosphere, not a pasted-in picture.
 */
export function HeroEarth({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        maskImage: 'radial-gradient(ellipse 62% 62% at 50% 50%, black 35%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at 50% 50%, black 35%, transparent 80%)',
      }}
      aria-hidden="true"
    >
      <Image
        src="/brand/earth-africa.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 60vw, 90vw"
        style={{ objectFit: 'cover' }}
        className="opacity-20 sm:opacity-40"
      />
    </div>
  )
}
