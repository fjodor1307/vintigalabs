import type { PrototypeConfig } from '../_registry'
import { SignInScreen } from './SignInScreen'
import { SignUpScreen } from './SignUpScreen'
import { BusinessDetailsScreen } from './BusinessDetailsScreen'
import { WelcomeScreen } from './WelcomeScreen'
import { EmailPreviewScreen } from './EmailPreviewScreen'
import { DashboardScreen } from './DashboardScreen'

export const config: PrototypeConfig = {
  slug: 'onboarding',
  frame: 'web',
  tags: ['auth', 'onboarding', 'dashboard'],
  entries: [
    {
      name: 'Onboarding',
      description:
        'Sign-in, two-step sign-up application, application acknowledgement, welcome email preview, and the post-approval dashboard. End-to-end first-touch flow.',
      path: '#/web/onboarding/sign-in',
      screens: 6,
    },
  ],
  routes: {
    '#/web/onboarding/sign-in':   SignInScreen,
    '#/web/onboarding/sign-up':   SignUpScreen,
    '#/web/onboarding/business':  BusinessDetailsScreen,
    '#/web/onboarding/welcome':   WelcomeScreen,
    '#/web/onboarding/email':     EmailPreviewScreen,
    '#/web/onboarding/dashboard': DashboardScreen,
  },
}
