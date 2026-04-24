import { Button } from '@base-ui/react/button'
import { BellIcon, MenuIcon } from '../icons/Icons'
import { GlobalSearch } from './GlobalSearch'

interface NavbarProps {
  onMenuToggle?: () => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <div className="flex items-center justify-between pt-vintiga-lg pb-vintiga-xl pr-vintiga-lg gap-vintiga-md">
      {/* Hamburger — visible only below md */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="md:hidden w-8 h-8 rounded-full bg-vintiga-surface-element text-vintiga-foreground flex items-center justify-center cursor-pointer border-none hover:bg-vintiga-border transition-colors"
        >
          <MenuIcon className="w-4 h-4" />
        </button>
      )}

      {/* Global search — left side */}
      <div className="hidden md:block flex-1 max-w-[520px]">
        <GlobalSearch />
      </div>
      <div className="md:hidden">
        <GlobalSearch />
      </div>

      <div className="flex-1" />
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <Button className="w-8 h-8 rounded-full bg-vintiga-surface-element text-vintiga-foreground flex items-center justify-center cursor-pointer border-none hover:bg-vintiga-border transition-colors">
            <BellIcon className="w-4 h-4" />
          </Button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vintiga-accent rounded-full" />
        </div>
        <div className="w-8 h-8 rounded-full bg-[#c7b9da] overflow-hidden flex items-center justify-center ml-1">
          <span className="text-vintiga-xs font-medium text-white">SJ</span>
        </div>
      </div>
    </div>
  )
}
