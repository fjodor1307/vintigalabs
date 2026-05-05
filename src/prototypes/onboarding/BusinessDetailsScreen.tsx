import { useState } from 'react'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { Select } from '@ds/shared/Select'
import { Checkbox } from '@ds/shared/Checkbox'
import { SplitLayout, StepHeader, StepPips } from './SplitLayout'

const HERO = 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=1200&q=80'

const BUSINESS_TYPES = ['Select a type', 'Winery', 'Brewery', 'Distillery', 'Tasting room', 'Restaurant + retail'] as const

export function BusinessDetailsScreen() {
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState<typeof BUSINESS_TYPES[number]>('Select a type')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [accepted, setAccepted] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.hash = '#/web/onboarding/welcome'
  }

  return (
    <SplitLayout
      heroSrc={HERO}
      quote="Vintiga's ecosystem amplified our business beyond imagination — unstoppable growth we never thought possible."
      attribution="Marcus Chen, Founder at Hillside Vineyards"
    >
      <StepHeader step={2} total={2} onBack={() => { window.location.hash = '#/web/onboarding/sign-up' }} />

      <div className="flex flex-col gap-vintiga-sm items-center text-center w-full">
        <h1 className="text-3xl leading-9 font-semibold text-vintiga-slate-900">
          Tell us about your business
        </h1>
        <p className="typo-body-sm text-vintiga-slate-600">
          Update your business details and contact information.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-vintiga-lg w-full">
        <TextField label="Business name"
          placeholder="Vintiga Labs, Inc."
          value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />

        <div className="flex flex-col gap-2.5 w-full">
          <label className="typo-body-sm font-medium text-vintiga-slate-900">Business type</label>
          <Select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value as typeof BUSINESS_TYPES[number])}
            options={BUSINESS_TYPES as unknown as string[]}
          />
        </div>

        <TextField label="Location"
          placeholder="Napa Valley, CA"
          value={location} onChange={(e) => setLocation(e.target.value)} required />

        <TextField label="Phone"
          placeholder="+1 484 569 1842"
          value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required />

        <Checkbox
          checked={accepted}
          onChange={setAccepted}
          label={
            <>
              I agree to the{' '}
              <a href="#" className="text-vintiga-indigo-600 no-underline hover:underline">Terms &amp; Conditions</a>
            </>
          }
        />

        <Button type="submit" fullWidth disabled={!accepted}>
          Submit Application
        </Button>
      </form>

      <StepPips current={2} total={2} />
    </SplitLayout>
  )
}
