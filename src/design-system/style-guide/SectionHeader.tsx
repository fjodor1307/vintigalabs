interface SectionHeaderProps {
  id: string
  title: string
  description: string
}

export function SectionHeader({ id, title, description }: SectionHeaderProps) {
  return (
    <div id={id} className="scroll-mt-8 mb-8">
      <h2 className="text-[22px] font-semibold text-[#0f172a] leading-7 tracking-[-0.2px]">{title}</h2>
      <p className="text-[14px] text-[#64748b] font-light mt-1.5 leading-6">{description}</p>
    </div>
  )
}
