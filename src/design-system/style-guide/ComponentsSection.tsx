import { useState } from 'react'
import { SectionHeader } from './SectionHeader'
import { Button } from '@ds/shared/Button'
import { IconButton } from '@ds/shared/IconButton'
import { Checkbox } from '@ds/shared/Checkbox'
import { Radio } from '@ds/shared/Radio'
import { Switch } from '@ds/shared/Switch'
import { AlertSoft } from '@ds/shared/AlertSoft'
import { Card } from '@ds/shared/Card'
import { Pill } from '@ds/shared/Pill'
import { OtpInputGroup } from '@ds/shared/OtpInput'
import { BottomSheet } from '@ds/shared/BottomSheet'
import { EmptyState } from '../components/EmptyState'
import { Skeleton, SkeletonText, SkeletonCard } from '../components/Skeleton'
import { ErrorState } from '../components/ErrorState'
import { ScreenHeader } from '@ds/shared/ScreenHeader'
import { ScreenFooter } from '@ds/shared/ScreenFooter'
import { Tabs } from '@base-ui/react/tabs'
import { Progress } from '@base-ui/react/progress'
import { Separator } from '@base-ui/react/separator'
import { Dialog } from '@base-ui/react/dialog'
import { Tooltip } from '@base-ui/react/tooltip'
import { PlusIcon, SearchIcon, BellIcon } from '@ds/icons/Icons'

function SubSection({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-20">
      <SectionHeader id={id} title={title} description={description} />
      <div className="border border-vintiga-border rounded-vintiga-card p-6 bg-vintiga-surface">{children}</div>
    </section>
  )
}

function ButtonsSection() {
  return (
    <SubSection id="ds-buttons" title="Buttons" description="Primary action triggers.">
      <div className="flex flex-wrap gap-3">
        <Button variant="solid">Solid</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </SubSection>
  )
}

function IconButtonsSection() {
  return (
    <SubSection id="ds-icon-buttons" title="Icon Buttons" description="Compact icon-only actions.">
      <div className="flex gap-3">
        <IconButton icon={<PlusIcon />} aria-label="Add" />
        <IconButton icon={<SearchIcon />} aria-label="Search" />
        <IconButton icon={<BellIcon />} aria-label="Notifications" />
      </div>
    </SubSection>
  )
}

function CheckboxSection() {
  const [checked, setChecked] = useState(false)
  return (
    <SubSection id="ds-checkbox" title="Checkbox" description="Boolean selection.">
      <Checkbox checked={checked} onChange={setChecked} label="Accept terms" />
    </SubSection>
  )
}

function RadioGroupSection() {
  const [value, setValue] = useState<'a' | 'b'>('a')
  return (
    <SubSection id="ds-radio" title="Radio Group" description="Single choice from a set.">
      <div className="flex flex-col gap-2">
        <Radio checked={value === 'a'} onChange={() => setValue('a')} label="Option A" />
        <Radio checked={value === 'b'} onChange={() => setValue('b')} label="Option B" />
      </div>
    </SubSection>
  )
}

function SwitchSection() {
  const [on, setOn] = useState(false)
  return (
    <SubSection id="ds-switch" title="Switch" description="On/off toggle.">
      <Switch checked={on} onChange={setOn} label="Enable notifications" />
    </SubSection>
  )
}

function AlertSoftSection() {
  return (
    <SubSection id="ds-alert-soft" title="Alert" description="Inline, non-blocking messaging.">
      <div className="space-y-3">
        <AlertSoft variant="info" title="Heads up" subtitle="Informational message." />
        <AlertSoft variant="success" title="All set" subtitle="Everything worked." />
        <AlertSoft variant="warning" title="Check this" subtitle="Something needs attention." />
        <AlertSoft variant="error" title="Something went wrong" subtitle="Please try again." />
      </div>
    </SubSection>
  )
}

function ProgressSection() {
  return (
    <SubSection id="ds-progress" title="Progress" description="Determinate progress indicator.">
      <Progress.Root value={60} className="w-full">
        <Progress.Track className="block h-2 bg-vintiga-surface-element rounded-full overflow-hidden">
          <Progress.Indicator className="block h-full bg-vintiga-primary transition-[width]" />
        </Progress.Track>
      </Progress.Root>
    </SubSection>
  )
}

function EmptyStatesSection() {
  return (
    <SubSection id="ds-empty-states" title="Empty States" description="Shown when there's no data yet.">
      <EmptyState title="Nothing here yet" description="Start by creating your first item." />
    </SubSection>
  )
}

function SkeletonLoadingSection() {
  return (
    <SubSection id="ds-skeletons" title="Skeletons" description="Loading placeholders.">
      <div className="space-y-4 max-w-md">
        <Skeleton className="h-8 w-1/2" />
        <SkeletonText lines={3} />
        <SkeletonCard />
      </div>
    </SubSection>
  )
}

function ErrorStatesSection() {
  return (
    <SubSection id="ds-error-states" title="Error States" description="Shown when something fails.">
      <ErrorState title="Couldn't load this" description="Check your connection and try again." />
    </SubSection>
  )
}

function DialogSection() {
  const [open, setOpen] = useState(false)
  return (
    <SubSection id="ds-dialog" title="Dialog" description="Modal overlay for focused tasks.">
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-vintiga-surface rounded-vintiga-card p-6 w-[90vw] max-w-md">
            <Dialog.Title className="typo-title-subsection font-semibold text-vintiga-foreground">Dialog title</Dialog.Title>
            <Dialog.Description className="typo-body-sm text-vintiga-foreground-muted mt-1">Example dialog body.</Dialog.Description>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="solid" onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </SubSection>
  )
}

function TooltipSection() {
  return (
    <SubSection id="ds-tooltip" title="Tooltip" description="Contextual hint on hover/focus.">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="soft">Hover me</Button>} />
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={8}>
              <Tooltip.Popup className="bg-vintiga-foreground text-vintiga-surface typo-caption font-semibold px-2 py-1 rounded">Tooltip content</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </SubSection>
  )
}

function BottomSheetSection() {
  const [open, setOpen] = useState(false)
  return (
    <SubSection id="ds-bottom-sheet" title="Bottom Sheet" description="Mobile modal sliding from bottom.">
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Need help?"
        subtitle="Tap a question to expand."
        items={[
          { id: '1', question: 'What is this?', content: <p className="typo-body text-vintiga-foreground-muted">Example content.</p> },
        ]}
      />
    </SubSection>
  )
}

function TabsSection() {
  return (
    <SubSection id="ds-tabs" title="Tabs" description="Switch between views.">
      <Tabs.Root defaultValue="one" className="space-y-3">
        <Tabs.List className="flex gap-4 border-b border-vintiga-border">
          <Tabs.Tab value="one" className="px-3 py-2 typo-body-sm font-semibold data-[selected]:border-b-2 data-[selected]:border-vintiga-primary">One</Tabs.Tab>
          <Tabs.Tab value="two" className="px-3 py-2 typo-body-sm font-semibold data-[selected]:border-b-2 data-[selected]:border-vintiga-primary">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="typo-body-sm text-vintiga-foreground-muted">Panel one</Tabs.Panel>
        <Tabs.Panel value="two" className="typo-body-sm text-vintiga-foreground-muted">Panel two</Tabs.Panel>
      </Tabs.Root>
    </SubSection>
  )
}

function SeparatorSection() {
  return (
    <SubSection id="ds-separator" title="Separator" description="Visual divider between sections.">
      <div className="flex flex-col gap-4">
        <span className="typo-body text-vintiga-foreground">Above</span>
        <Separator className="h-px bg-vintiga-border" />
        <span className="typo-body text-vintiga-foreground">Below</span>
      </div>
    </SubSection>
  )
}

function CardSection() {
  return (
    <SubSection id="ds-cards" title="Cards" description="Surface container for grouped content.">
      <Card>
        <p className="typo-title-subsection font-semibold text-vintiga-foreground">Card title</p>
        <p className="typo-body-sm text-vintiga-foreground-muted mt-1">Card body content.</p>
      </Card>
    </SubSection>
  )
}

function PillSection() {
  const [selected, setSelected] = useState<'a' | 'b' | null>('a')
  return (
    <SubSection id="ds-pill" title="Pill" description="Selection chip for filters and tags.">
      <div className="flex gap-2">
        <Pill label="Option A" selected={selected === 'a'} onClick={() => setSelected('a')} />
        <Pill label="Option B" selected={selected === 'b'} onClick={() => setSelected('b')} />
      </div>
    </SubSection>
  )
}

function OtpInputSection() {
  const [value, setValue] = useState<string[]>(['', '', '', '', '', ''])
  return (
    <SubSection id="ds-otp-input" title="OTP Input" description="One-time code entry.">
      <OtpInputGroup value={value} onChange={setValue} />
    </SubSection>
  )
}

function ScreenHeaderSection() {
  return (
    <SubSection id="ds-screen-header" title="Screen Header" description="Mobile screen top bar.">
      <div className="border border-vintiga-border rounded-vintiga-card overflow-hidden">
        <ScreenHeader title="Screen title" showBack={false} />
      </div>
    </SubSection>
  )
}

function ScreenFooterSection() {
  return (
    <SubSection id="ds-screen-footer" title="Screen Footer" description="Mobile fixed-bottom action area.">
      <div className="border border-vintiga-border rounded-vintiga-card overflow-hidden">
        <ScreenFooter primaryLabel="Continue" />
      </div>
    </SubSection>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const COMPONENT_PAGES: Record<string, React.ComponentType> = {
  'ds-buttons':        ButtonsSection,
  'ds-icon-buttons':   IconButtonsSection,
  'ds-text-fields':    () => <SubSection id="ds-text-fields" title="Text Fields" description="Single-line input."><p className="typo-body-sm text-vintiga-foreground-muted">See <code>@ds/shared/TextField</code> for the full API.</p></SubSection>,
  'ds-checkbox':       CheckboxSection,
  'ds-radio':          RadioGroupSection,
  'ds-switch':         SwitchSection,
  'ds-alert-soft':     AlertSoftSection,
  'ds-progress':       ProgressSection,
  'ds-empty-states':   EmptyStatesSection,
  'ds-skeletons':      SkeletonLoadingSection,
  'ds-error-states':   ErrorStatesSection,
  'ds-dialog':         DialogSection,
  'ds-tooltip':        TooltipSection,
  'ds-bottom-sheet':   BottomSheetSection,
  'ds-tabs':           TabsSection,
  'ds-separator':      SeparatorSection,
  'ds-cards':          CardSection,
  'ds-pill':           PillSection,
  'ds-otp-input':      OtpInputSection,
  'ds-screen-header':  ScreenHeaderSection,
  'ds-screen-footer':  ScreenFooterSection,
}

export function ComponentsSection() {
  return (
    <section className="space-y-12">
      <SectionHeader id="components" title="Components" description="Base UI components branded with Vintiga design tokens." />
      {Object.values(COMPONENT_PAGES).map((Page, i) => <Page key={i} />)}
    </section>
  )
}
