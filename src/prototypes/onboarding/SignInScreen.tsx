import { useState } from 'react'
import { Button } from '@ds/shared/Button'
import { TextField } from '@ds/shared/TextField'
import { Checkbox } from '@ds/shared/Checkbox'
import { VintigaLogoIndigo } from '@ds/shared/VintigaLogo'
import { SplitLayout } from './SplitLayout'

const HERO = 'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?auto=format&fit=crop&w=1200&q=80'

export function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.hash = '#/web/onboarding/dashboard'
  }

  return (
    <SplitLayout
      heroSrc={HERO}
      quote="The check-in moment used to be a bottleneck. Now guests are at the table inside two minutes."
      attribution="Maria Rodriguez, Owner at Valley View Vineyards"
    >
      {/* Logo + heading */}
      <div className="flex flex-col gap-10 items-center w-full">
        <VintigaLogoIndigo height={55} />
        <h1 className="text-3xl leading-9 font-semibold text-vintiga-slate-900 text-center">
          Welcome back
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="flex flex-col gap-vintiga-lg w-full">
        <TextField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex items-center justify-between w-full">
          <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
          <a href="#" className="typo-body-sm font-semibold text-vintiga-indigo-700 no-underline hover:underline">
            Forgot password?
          </a>
        </div>
        <Button type="submit" fullWidth>Sign In</Button>
      </form>

      {/* Footer link */}
      <div className="flex items-center justify-center gap-1 typo-body-sm text-center w-full">
        <span className="text-vintiga-slate-600">Not a member?</span>
        <a href="#/web/onboarding/sign-up" className="font-semibold text-vintiga-indigo-700 no-underline hover:underline">
          Create an account
        </a>
      </div>
    </SplitLayout>
  )
}
