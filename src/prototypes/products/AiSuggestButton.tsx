import { Button } from '@ds/shared/Button'
import { SparklesIcon } from '@ds/icons/Icons'

// Per-field "Suggest with AI" trigger. Pass to <Field action={…}> on any
// editable field that benefits from AI assistance (Name, Hook, Subtitle,
// Tasting suggestions, etc.). Secondary button styling — same DS Button
// outline used everywhere else.

export function AiSuggestButton({
  onClick,
  generating,
  label = 'Suggest with AI',
}: {
  onClick: () => void
  generating?: boolean
  label?: string
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={generating}
      leftIcon={<SparklesIcon className={generating ? 'animate-pulse' : ''} />}
    >
      {generating ? 'Generating…' : label}
    </Button>
  )
}
