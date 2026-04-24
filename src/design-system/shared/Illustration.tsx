export interface IllustrationProps {
  /** File name (without extension) of an SVG in /public/illustrations/. */
  slug: string
  /** Alt text. Pass "" for decorative illustrations. */
  alt?: string
  /** Tailwind size class. Default: "size-32" (128×128) */
  size?: string
  className?: string
}

export function Illustration({
  slug,
  alt = '',
  size = 'size-32',
  className,
}: IllustrationProps) {
  return (
    <img
      src={`/illustrations/${slug}.svg`}
      alt={alt}
      className={`${size} object-contain ${className ?? ''}`}
    />
  )
}
