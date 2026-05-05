import type { ReactNode, RefObject } from 'react'
import {
  UndoIcon,
  RedoIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  LinkIcon,
  ImageIcon,
} from '@ds/icons/Icons'

// ─── RichTextEditor ───────────────────────────────────────────────────────────
// Vintiga rich-text editor — Figma-accurate (node 5594:19232).
//
//   ┌──────────────────────────────────────────────────────────────────┐
//   │ ↶ ↷ │ B I U │ ⇆ ⇿ ⇼ ⇶ │ 🔗 🖼                                      │   ← toolbar
//   ├──────────────────────────────────────────────────────────────────┤
//   │                                                                  │
//   │  contentEditable body (140 px min-height by default)             │
//   │                                                                  │
//   └──────────────────────────────────────────────────────────────────┘
//
// The toolbar buttons are decorative — formatting is not actually wired up.
// This is a prototype-grade editor: visual fidelity + a usable contentEditable
// body, no real document model. Pass `editorRef` to read / write the body's
// `innerHTML` from the parent (e.g. for AI-suggested copy).

export interface RichTextEditorProps {
  /** Optional ref to the contentEditable body. Use for reading or replacing
   *  innerHTML directly (e.g. when an AI suggestion is accepted). */
  editorRef?: RefObject<HTMLDivElement | null>
  /** Placeholder shown while the body is empty. */
  placeholder?: string
  /** Body min-height (Tailwind class). Defaults to `min-h-[140px]` to match Figma. */
  minHeightClass?: string
  /** Disable interaction. The toolbar fades and the body becomes read-only. */
  disabled?: boolean
  /** Override the toolbar entirely (e.g. shorter editor for inline notes). */
  toolbar?: ReactNode
  className?: string
  'aria-label'?: string
}

interface ToolDef {
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// Three groups separated by vertical dividers — matches the Figma node order.
const TOOL_GROUPS: ToolDef[][] = [
  [
    { label: 'Undo', icon: UndoIcon },
    { label: 'Redo', icon: RedoIcon },
  ],
  [
    { label: 'Bold',      icon: BoldIcon },
    { label: 'Italic',    icon: ItalicIcon },
    { label: 'Underline', icon: UnderlineIcon },
  ],
  [
    { label: 'Align left',   icon: AlignLeftIcon },
    { label: 'Align center', icon: AlignCenterIcon },
    { label: 'Align right',  icon: AlignRightIcon },
    { label: 'Justify',      icon: AlignJustifyIcon },
  ],
  [
    { label: 'Link',  icon: LinkIcon },
    { label: 'Image', icon: ImageIcon },
  ],
]

function ToolButton({ tool, disabled }: { tool: ToolDef; disabled?: boolean }) {
  const Icon = tool.icon
  return (
    <button
      type="button"
      title={tool.label}
      aria-label={tool.label}
      disabled={disabled}
      className="w-7 h-7 inline-flex items-center justify-center rounded-vintiga-md text-vintiga-slate-600 hover:bg-vintiga-slate-100 hover:text-vintiga-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent border-none cursor-pointer"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  )
}

function DefaultToolbar({ disabled }: { disabled?: boolean }) {
  return (
    <div className="flex items-center gap-0.5 px-vintiga-sm py-1.5 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
      {TOOL_GROUPS.map((group, gi) => (
        <div key={gi} className="contents">
          {gi > 0 && <span className="w-px h-4 bg-vintiga-slate-200 mx-1" />}
          {group.map((t) => (
            <ToolButton key={t.label} tool={t} disabled={disabled} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function RichTextEditor({
  editorRef,
  placeholder,
  minHeightClass = 'min-h-[140px]',
  disabled = false,
  toolbar,
  className = '',
  ...rest
}: RichTextEditorProps) {
  return (
    <div
      className={[
        'flex flex-col border border-vintiga-slate-200 rounded-vintiga-md overflow-hidden bg-vintiga-white',
        disabled ? 'opacity-60' : '',
        className,
      ].join(' ')}
    >
      {toolbar ?? <DefaultToolbar disabled={disabled} />}
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label={rest['aria-label']}
        aria-disabled={disabled || undefined}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        className={[
          'flex-1 px-3 py-3 typo-body-sm text-vintiga-slate-900 bg-vintiga-white',
          'focus:outline-none',
          // Empty-state placeholder via CSS — contentEditable doesn't support
          // a native placeholder so we use :empty + ::before with the
          // `data-placeholder` attribute.
          'empty:before:content-[attr(data-placeholder)] empty:before:text-vintiga-slate-400 empty:before:pointer-events-none',
          '[&_p]:my-2 [&_strong]:font-semibold',
          minHeightClass,
        ].join(' ')}
      />
    </div>
  )
}
