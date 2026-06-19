import { FigmaLink } from './FigmaLink'

interface SectionHeaderProps {
  id: string
  title: string
  description: string
  /** When set, renders a "View in Figma" button linking to the source frame. */
  figmaUrl?: string
}

export function SectionHeader({ id, title, description, figmaUrl }: SectionHeaderProps) {
  return (
    <div id={id} className="scroll-mt-8 mb-8 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[22px] font-semibold text-[#0f172a] leading-7 tracking-[-0.2px]">{title}</h2>
        <p className="text-[14px] text-[#64748b] font-light mt-1.5 leading-6">{description}</p>
      </div>
      {figmaUrl && <FigmaLink href={figmaUrl} />}
    </div>
  )
}
