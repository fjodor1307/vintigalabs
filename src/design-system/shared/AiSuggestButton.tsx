import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { SparklesIcon } from '@ds/icons/Icons'

// ─── AiSuggestButton ──────────────────────────────────────────────────────────
// Outline button with a sparkles icon and a "generating…" loading state. Drop
// into <Field action={…}> on any editable field that benefits from AI assist.
//
// Usage:
//   <Field label="Title" action={<AiSuggestButton onClick={fakeGen} generating={generating} />}>
//     <TextInput />
//   </Field>
//
// Use `iconOnly` inside dense layouts (e.g. multiple AI fields stacked in a
// single editor) where the sparkles icon alone communicates intent and the
// label adds visual noise. The aria-label still announces "Suggest with AI".

export interface AiSuggestButtonProps {
  onClick: () => void
  /** Loading flag — disables the button and pulses the icon. */
  generating?: boolean
  /** Idle label. Default: "Suggest with AI". */
  label?: string
  /** Override the loading label. Default: "Generating…". */
  generatingLabel?: string
  /** Pass-through size. Default: sm. */
  size?: 'sm' | 'md' | 'lg'
  /** Render as a square IconButton instead of a labelled pill. */
  iconOnly?: boolean
}

export function AiSuggestButton({
  onClick,
  generating,
  label = 'Suggest with AI',
  generatingLabel = 'Generating…',
  size = 'sm',
  iconOnly = false,
}: AiSuggestButtonProps) {
  if (iconOnly) {
    return (
      <IconButton
        variant="outline"
        size={size}
        onClick={onClick}
        disabled={generating}
        aria-label={generating ? generatingLabel : label}
        icon={<SparklesIcon className={generating ? 'animate-pulse' : ''} />}
      />
    )
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={generating}
      leftIcon={<SparklesIcon className={generating ? 'animate-pulse' : ''} />}
    >
      {generating ? generatingLabel : label}
    </Button>
  )
}
