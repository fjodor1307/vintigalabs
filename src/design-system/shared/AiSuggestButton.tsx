import { Button } from '@ds/shared/Button'
import { SparklesIcon } from '@ds/icons/Icons'

// ─── AiSuggestButton ──────────────────────────────────────────────────────────
// Outline button with a sparkles icon and a "generating…" loading state. Drop
// into <Field action={…}> on any editable field that benefits from AI assist.
//
// Usage:
//   <Field label="Title" action={<AiSuggestButton onClick={fakeGen} generating={generating} />}>
//     <TextInput />
//   </Field>

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
}

export function AiSuggestButton({
  onClick,
  generating,
  label = 'Suggest with AI',
  generatingLabel = 'Generating…',
  size = 'sm',
}: AiSuggestButtonProps) {
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
