import { useState } from 'react'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { SplitLayout, StepHeader, StepPips } from './SplitLayout'

const HERO = 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=1200&q=80'

export function SignUpScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.hash = '#/web/onboarding/business'
  }

  return (
    <SplitLayout
      heroSrc={HERO}
      quote="Our online shop feels like an extension of our tasting room. Customers love it."
      attribution="Maria Rodriguez, Owner at Valley View Vineyards"
    >
      <StepHeader step={1} total={2} onBack={() => { window.location.hash = '#/web/onboarding/sign-in' }} />

      <div className="flex flex-col gap-vintiga-sm items-center text-center w-full">
        <h1 className="text-3xl leading-9 font-semibold text-vintiga-slate-900">
          Sign up for Vintiga
        </h1>
        <p className="typo-body-sm text-vintiga-slate-600">
          Join Vintiga and elevate your winery or brewery operations.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-vintiga-lg w-full">
        <TextField label="Full name"        value={name}     onChange={(e) => setName(e.target.value)}     required />
        <TextField label="Your work email"  value={email}    onChange={(e) => setEmail(e.target.value)}    type="email"    required />
        <TextField label="Password"         value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <TextField label="Confirm password" value={confirm}  onChange={(e) => setConfirm(e.target.value)}  type="password" required />
        <Button type="submit" fullWidth>Continue</Button>
      </form>

      <div className="flex items-center justify-center gap-1 typo-body-sm text-center w-full">
        <span className="text-vintiga-slate-600">Already have an account?</span>
        <a href="#/web/onboarding/sign-in" className="font-semibold text-vintiga-indigo-700 no-underline hover:underline">
          Sign In
        </a>
      </div>

      <StepPips current={1} total={2} />
    </SplitLayout>
  )
}
