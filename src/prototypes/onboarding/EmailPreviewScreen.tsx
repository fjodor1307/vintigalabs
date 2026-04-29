import { Button } from '@ds/shared/Button'
import { VintigaLogoBlack } from '@ds/shared/VintigaLogo'

export function EmailPreviewScreen() {
  return (
    <div className="min-h-screen bg-vintiga-slate-100 flex items-start lg:items-center justify-center py-vintiga-xl px-vintiga-md">
      <div className="w-full max-w-[600px] bg-vintiga-white shadow-vintiga-md rounded-vintiga-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-center py-7 bg-vintiga-slate-50 border-b border-vintiga-slate-200">
          <VintigaLogoBlack height={32} />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-vintiga-2xl items-center px-vintiga-lg py-16 border-b border-vintiga-slate-200">
          <div className="flex flex-col gap-vintiga-sm items-center text-center max-w-[472px] w-full">
            <p className="text-xl leading-7 font-semibold text-vintiga-slate-900">Welcome to Vintiga!</p>
            <div className="typo-body-sm text-vintiga-slate-600 flex flex-col gap-vintiga-md">
              <p>Hi [First Name],</p>
              <p>Great news, your Vintiga account is ready to go.</p>
              <p>We&rsquo;ve reviewed your application and set up your store. You can now access your account.</p>
              <p>If you&rsquo;d like a quick walkthrough or have any questions, feel free to book a demo with our team — we&rsquo;ll help you get up and running fast.</p>
              <p>
                Welcome aboard,
                <br />
                The Vintiga Team
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-vintiga-md items-center max-w-[472px] w-full">
            <Button as="a" href="#/web/onboarding/dashboard">Sign In</Button>
            <p className="typo-caption text-vintiga-slate-600 text-center">
              Having trouble? Contact us at{' '}
              <a href="mailto:info@vintigalabs.com" className="font-semibold text-vintiga-indigo-600 no-underline hover:underline">
                info@vintigalabs.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center py-10 bg-vintiga-slate-50">
          <p className="typo-caption text-vintiga-slate-600 text-center">
            © 2026 Vintiga. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
