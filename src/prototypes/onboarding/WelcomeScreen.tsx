import { Button } from '@ds/shared/Button'
import { VintigaIconIndigo } from '@ds/shared/VintigaLogo'

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-vintiga-white flex items-center justify-center py-vintiga-3xl px-vintiga-lg">
      <div className="flex flex-col gap-vintiga-2xl items-center w-full max-w-[384px]">
        <VintigaIconIndigo size={40} />

        <div className="flex flex-col gap-vintiga-sm items-center text-center w-full">
          <h1 className="text-3xl leading-9 font-semibold text-vintiga-slate-900">Welcome!</h1>
          <p className="typo-body-sm text-vintiga-slate-600">
            Your Vintiga account is being prepared. You will receive your login instructions shortly.
          </p>
        </div>

        <Button
          variant="outline"
          fullWidth
          as="a"
          href="#/web/onboarding/email"
        >
          Explore how Vintiga works
        </Button>

        <p className="typo-caption text-vintiga-slate-400 text-center">
          Want to peek at the welcome email?{' '}
          <a href="#/web/onboarding/email" className="text-vintiga-indigo-600 no-underline hover:underline">
            Preview it
          </a>
        </p>
      </div>
    </div>
  )
}
