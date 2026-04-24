import { SectionHeader } from './SectionHeader'
import {
  InfoIcon,
  BackArrowIcon,
  CheckIcon,
  CheckCircleIcon,
  SearchIcon,
  PlusIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  HomeIcon,
  ReceiptIcon,
  WifiIcon,
  SignalIcon,
  BatteryIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  WarningIcon,
  SparklesIcon,
  SortAZIcon,
  GlobeIcon,
  PencilIcon,
  PenIcon,
  CalendarIcon,
  LockIcon,
  WalletIcon,
  ChartIcon,
  ArrowLeftRightIcon,
  BellIcon,
  FilterIcon,
  TrendUpIcon,
  PiggyBankIcon,
  CalculatorIcon,
  TelescopeIcon,
  UsersGroupIcon,
  ShieldIcon,
  ChevronUpDownIcon,
  UserXIcon,
  ChevronLeftIcon,
  BookOpenIcon,
  BotIcon,
  EllipsisIcon,
  BoxIcon,
  SettingsIcon,
  HelpIcon,
  SidebarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  BuildingIcon,
  DollarIcon,
  ExportIcon,
  EyeIcon,
  FileTextIcon,
  PercentIcon,
  AlertTriangleIcon,
  XIcon,
  MenuIcon,
  VintigaLogoIcon,
} from '../icons/Icons'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = (props: any) => React.ReactNode

// lucideSlug: the icon's name on lucide.dev/icons/<slug>. Null = custom brand icon.
const icons: { name: string; lucideSlug: string | null; component: IconComponent }[] = [
  { name: 'AlertTriangleIcon',  lucideSlug: 'triangle-alert',                    component: AlertTriangleIcon },
  { name: 'ArrowLeftRightIcon', lucideSlug: 'arrow-left-right',                  component: ArrowLeftRightIcon },
  { name: 'ArrowRightIcon',     lucideSlug: 'arrow-right',                       component: ArrowRightIcon },
  { name: 'BackArrowIcon',      lucideSlug: 'arrow-left',                        component: BackArrowIcon },
  { name: 'BatteryIcon',        lucideSlug: 'battery',                           component: BatteryIcon },
  { name: 'BellIcon',           lucideSlug: 'bell',                              component: BellIcon },
  { name: 'BookOpenIcon',       lucideSlug: 'book-open',                         component: BookOpenIcon },
  { name: 'BotIcon',            lucideSlug: 'bot',                               component: BotIcon },
  { name: 'BoxIcon',            lucideSlug: 'box',                               component: BoxIcon },
  { name: 'BriefcaseIcon',      lucideSlug: 'briefcase',                         component: BriefcaseIcon },
  { name: 'BuildingIcon',       lucideSlug: 'building-2',                        component: BuildingIcon },
  { name: 'CalculatorIcon',     lucideSlug: 'calculator',                        component: CalculatorIcon },
  { name: 'CalendarIcon',       lucideSlug: 'calendar',                          component: CalendarIcon },
  { name: 'ChartIcon',          lucideSlug: 'chart-no-axes-column-increasing',   component: ChartIcon },
  { name: 'CheckCircleIcon',    lucideSlug: 'circle-check',                      component: CheckCircleIcon },
  { name: 'CheckIcon',          lucideSlug: 'check',                             component: CheckIcon },
  { name: 'ChevronDownIcon',    lucideSlug: 'chevron-down',                      component: ChevronDownIcon },
  { name: 'ChevronLeftIcon',    lucideSlug: 'chevron-left',                      component: ChevronLeftIcon },
  { name: 'ChevronRightIcon',   lucideSlug: 'chevron-right',                     component: ChevronRightIcon },
  { name: 'ChevronUpDownIcon',  lucideSlug: 'chevrons-up-down',                  component: ChevronUpDownIcon },
  { name: 'ClockIcon',          lucideSlug: 'clock',                             component: ClockIcon },
  { name: 'CreditCardIcon',     lucideSlug: 'credit-card',                       component: CreditCardIcon },
  { name: 'DollarIcon',         lucideSlug: 'dollar-sign',                       component: DollarIcon },
  { name: 'EllipsisIcon',       lucideSlug: 'ellipsis',                          component: EllipsisIcon },
  { name: 'ExportIcon',         lucideSlug: 'upload',                            component: ExportIcon },
  { name: 'EyeIcon',            lucideSlug: 'eye',                               component: EyeIcon },
  { name: 'FileTextIcon',       lucideSlug: 'file-text',                         component: FileTextIcon },
  { name: 'FilterIcon',         lucideSlug: 'filter',                            component: FilterIcon },
  { name: 'GlobeIcon',          lucideSlug: 'globe',                             component: GlobeIcon },
  { name: 'HelpIcon',           lucideSlug: 'circle-help',                       component: HelpIcon },
  { name: 'HomeIcon',           lucideSlug: 'house',                             component: HomeIcon },
  { name: 'InfoIcon',           lucideSlug: 'info',                              component: InfoIcon },
  { name: 'LockIcon',           lucideSlug: 'lock',                              component: LockIcon },
  { name: 'MailIcon',           lucideSlug: 'mail',                              component: MailIcon },
  { name: 'MapPinIcon',         lucideSlug: 'map-pin',                           component: MapPinIcon },
  { name: 'MenuIcon',           lucideSlug: 'menu',                              component: MenuIcon },
  { name: 'VintigaLogoIcon',      lucideSlug: null,                                component: VintigaLogoIcon },
  { name: 'PencilIcon',         lucideSlug: 'pencil',                            component: PencilIcon },
  { name: 'PenIcon',            lucideSlug: 'pen',                               component: PenIcon },
  { name: 'PercentIcon',        lucideSlug: 'percent',                           component: PercentIcon },
  { name: 'PhoneIcon',          lucideSlug: 'phone',                             component: PhoneIcon },
  { name: 'PiggyBankIcon',      lucideSlug: 'piggy-bank',                        component: PiggyBankIcon },
  { name: 'PlusIcon',           lucideSlug: 'plus',                              component: PlusIcon },
  { name: 'ReceiptIcon',        lucideSlug: 'receipt',                           component: ReceiptIcon },
  { name: 'SearchIcon',         lucideSlug: 'search',                            component: SearchIcon },
  { name: 'SettingsIcon',       lucideSlug: 'settings',                          component: SettingsIcon },
  { name: 'ShieldCheckIcon',    lucideSlug: 'shield-check',                      component: ShieldCheckIcon },
  { name: 'ShieldIcon',         lucideSlug: 'shield',                            component: ShieldIcon },
  { name: 'SidebarIcon',        lucideSlug: 'panel-left',                        component: SidebarIcon },
  { name: 'SignalIcon',         lucideSlug: 'signal',                            component: SignalIcon },
  { name: 'SortAZIcon',         lucideSlug: 'arrow-down-a-z',                    component: SortAZIcon },
  { name: 'SparklesIcon',       lucideSlug: 'sparkles',                          component: SparklesIcon },
  { name: 'TelescopeIcon',      lucideSlug: 'telescope',                         component: TelescopeIcon },
  { name: 'TrendUpIcon',        lucideSlug: 'trending-up',                       component: TrendUpIcon },
  { name: 'UserIcon',           lucideSlug: 'user',                              component: UserIcon },
  { name: 'UserXIcon',          lucideSlug: 'user-x',                            component: UserXIcon },
  { name: 'UsersGroupIcon',     lucideSlug: 'users',                             component: UsersGroupIcon },
  { name: 'WalletIcon',         lucideSlug: 'wallet',                            component: WalletIcon },
  { name: 'WarningIcon',        lucideSlug: 'triangle-alert',                    component: WarningIcon },
  { name: 'WifiIcon',           lucideSlug: 'wifi',                              component: WifiIcon },
  { name: 'XIcon',              lucideSlug: 'x',                                 component: XIcon },
]

export function IconsSection() {
  return (
    <section>
      <SectionHeader
        id="icons"
        title="Icons"
        description={`${icons.length} icons — Lucide stroke-based SVGs + Vintiga brand mark. Click any Lucide icon to open its page on lucide.dev.`}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {icons.map(({ name, lucideSlug, component: Icon }) => {
          const inner = (
            <div className="flex flex-col items-center gap-2 p-3 rounded-vintiga-input hover:bg-vintiga-surface-element transition-colors w-full">
              <div className="w-10 h-10 flex items-center justify-center text-vintiga-foreground">
                <Icon className="w-5 h-5" />
              </div>
              <span className="typo-caption text-vintiga-foreground-muted text-center leading-tight">
                {name.replace('Icon', '')}
              </span>
              {lucideSlug && (
                <span className="typo-caption text-vintiga-foreground-muted/50 text-center leading-tight text-[10px]">
                  {lucideSlug}
                </span>
              )}
              {!lucideSlug && (
                <span className="typo-caption text-vintiga-primary/60 text-center leading-tight text-[10px]">
                  brand
                </span>
              )}
            </div>
          )

          if (lucideSlug) {
            return (
              <a
                key={name}
                href={`https://lucide.dev/icons/${lucideSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex no-underline"
                title={`Open ${lucideSlug} on lucide.dev`}
              >
                {inner}
              </a>
            )
          }

          return (
            <div key={name} className="flex">
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
