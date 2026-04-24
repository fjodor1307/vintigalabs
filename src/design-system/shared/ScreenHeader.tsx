import type { ReactNode } from 'react'
import { StatusBar } from './StatusBar'
import { IconButton } from './IconButton'
import { BackArrowIcon } from '../icons/Icons'

interface ScreenHeaderProps {
  /** Progress percentage (0–100). Omit to hide the progress bar. */
  progress?: number
  showBack?: boolean
  /** Optional centred title between the two buttons. */
  title?: string
  /** Right-side action — always pass as <IconButton variant="soft" tone="primary" size="lg" /> */
  rightIcon?: ReactNode
  /** Custom back handler. Defaults to browser history back. */
  onBack?: () => void
}

export function ScreenHeader({ progress, showBack = true, title, rightIcon, onBack }: ScreenHeaderProps) {
  const handleBack = onBack ?? (() => window.history.back())

  return (
    <div className="bg-vintiga-surface px-4">
      <StatusBar variant="light" />

      {/* Nav row */}
      <div className="flex items-center justify-between py-4">
        {/* Left — back button */}
        {showBack ? (
          <IconButton
            icon={<BackArrowIcon className="w-5 h-5" />}
            variant="soft"
            tone="primary"
            size="lg"
            aria-label="Go back"
            onClick={handleBack}
          />
        ) : (
          <div className="w-11 h-11" />
        )}

        {/* Centre — optional title */}
        {title ? (
          <span className="flex-1 text-center text-[16px] font-light text-vintiga-foreground leading-6 tracking-[0.08px] mx-2 truncate">
            {title}
          </span>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right — action button or spacer */}
        {rightIcon ? (
          <div className="flex items-center">{rightIcon}</div>
        ) : (
          <div className="w-11 h-11" />
        )}
      </div>

      {/* Progress bar */}
      {progress != null && (
        <div className="w-full pb-px">
          <div className="w-full h-[6px] rounded-full bg-vintiga-border overflow-hidden">
            <div
              className="h-full rounded-full bg-vintiga-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
