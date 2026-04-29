import { Dialog } from '@base-ui/react/dialog'
import { XIcon } from '@ds/icons/Icons'

// ─── Welcome modal ────────────────────────────────────────────────────────────
// Figma 5029:3070 — fires on first dashboard visit after onboarding.
// Hero image + floating close button + title + description.
// Distinct enough from the standard <Modal> family that it lives here as a
// one-off rather than a DS variant.

const HERO_SRC =
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80'

export interface WelcomeModalProps {
  open: boolean
  onClose: () => void
}

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Popup
          className={[
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-vintiga-white rounded-2xl shadow-vintiga-xl overflow-hidden',
            'w-[calc(100vw-2rem)] max-w-md flex flex-col',
          ].join(' ')}
        >
          {/* Hero */}
          <div className="relative h-[266px] w-full">
            <img src={HERO_SRC} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(49,44,133,0.18), rgba(15,23,43,0.36))' }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close welcome modal"
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/60 transition-colors cursor-pointer p-0 border-0"
            >
              <XIcon className="w-6 h-6 text-vintiga-white" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-3.5 p-vintiga-lg w-full">
            <Dialog.Title className="text-2xl leading-8 font-semibold text-vintiga-slate-900">
              Welcome to Vintiga!
            </Dialog.Title>
            <Dialog.Description className="text-base leading-6 text-vintiga-slate-600">
              Turn visitors into loyal members. Build relationships and track engagement with tools designed for hospitality.
            </Dialog.Description>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
