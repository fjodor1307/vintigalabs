import type { ReactNode } from 'react'

interface PhoneFrameProps {
  label: string
  children: ReactNode
}

export function PhoneFrame({ label, children }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center gap-vintiga-md shrink-0">
      <div className="w-[375px] h-[812px] rounded-[40px] shadow-vintiga-lg overflow-hidden bg-vintiga-surface flex flex-col">
        {children}
      </div>
      <span className="text-vintiga-sm font-medium text-vintiga-foreground-muted">{label}</span>
    </div>
  )
}
