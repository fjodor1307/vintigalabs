import type { ReactNode } from 'react'
import { BackArrowIcon } from '@ds/icons/Icons'
import { VintigaLogoIndigo, VintigaIconIndigo } from '@ds/shared/VintigaLogo'

// ─── Split layout ─────────────────────────────────────────────────────────────
// Left: form column (centred, max-w 384 px)
// Right: full-bleed hero image with bottom-aligned customer quote

export interface SplitLayoutProps {
  /** Form / centre column content. */
  children: ReactNode
  /** Right-hand hero image URL. */
  heroSrc: string
  /** Customer quote shown over the image. */
  quote?: string
  /** Quote attribution. */
  attribution?: string
}

export function SplitLayout({ children, heroSrc, quote, attribution }: SplitLayoutProps) {
  return (
    <div className="flex items-stretch w-full h-screen min-h-[760px] bg-vintiga-white">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center bg-vintiga-white py-vintiga-3xl px-vintiga-lg">
        <div className="flex flex-col gap-vintiga-2xl items-center w-full max-w-[384px]">
          {children}
        </div>
      </div>

      {/* Right — hero */}
      <div className="hidden lg:flex relative flex-1 flex-col items-center justify-end overflow-hidden py-vintiga-3xl px-vintiga-lg">
        <img src={heroSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" aria-hidden="true" />
        {quote && (
          <div className="relative z-10 max-w-[480px] flex flex-col items-center gap-vintiga-md text-center">
            <p className="text-2xl leading-8 font-medium text-white">&ldquo;{quote}&rdquo;</p>
            {attribution && (
              <p className="typo-body-sm text-white/80">— {attribution}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step header (back arrow + logo + step indicator) ─────────────────────────

interface StepHeaderProps {
  step: number
  total: number
  onBack?: () => void
}

export function StepHeader({ step, total, onBack }: StepHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="w-6 h-6 flex items-center justify-center text-vintiga-slate-700 hover:text-vintiga-slate-900 transition-colors cursor-pointer p-0 bg-transparent border-0"
      >
        <BackArrowIcon className="w-5 h-5" />
      </button>
      <VintigaLogoIndigo height={25} />
      <p className="typo-body-sm text-vintiga-slate-600 text-center w-6">{step}/{total}</p>
    </div>
  )
}

// ─── Step pip indicator (the two coloured pills under each form) ──────────────

interface StepPipsProps {
  current: number
  total: number
}

export function StepPips({ current, total }: StepPipsProps) {
  return (
    <div className="flex items-center justify-center gap-2 h-1.5 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-6 rounded-2xl ${i < current ? 'bg-vintiga-indigo-600' : 'bg-vintiga-slate-200'}`}
        />
      ))}
    </div>
  )
}

// Re-export the icon variant used for the welcome / email screens
export { VintigaIconIndigo }
