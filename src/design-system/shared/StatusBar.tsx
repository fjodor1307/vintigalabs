import { SignalIcon, WifiIcon, BatteryIcon } from '../icons/Icons'

interface StatusBarProps {
  variant?: 'light' | 'dark'
}

export function StatusBar({ variant = 'light' }: StatusBarProps) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-vintiga-foreground'

  return (
    <div className={`flex items-center justify-between px-vintiga-lg py-vintiga-xs ${textColor}`}>
      <span className="text-vintiga-sm font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalIcon className="w-4 h-3" />
        <WifiIcon className="w-4 h-3" />
        <BatteryIcon className="w-6 h-3" />
      </div>
    </div>
  )
}
