# Onboarding — User Journey

## Source

- **Requirements:** Figma — Dashboard 05 / Onboarding flow
- **CONTEXT.md:** [`./CONTEXT.md`](./CONTEXT.md)

---

## Journey Steps

| # | Step                                                      | Route                              | Status |
|---|-----------------------------------------------------------|------------------------------------|--------|
| 1 | Sign in (returning user)                                  | `#/web/onboarding/sign-in`         | Done   |
| 2 | Sign up — credentials (step 1/2)                          | `#/web/onboarding/sign-up`         | Done   |
| 3 | Sign up — business details (step 2/2)                     | `#/web/onboarding/business`        | Done   |
| 4 | "Account being prepared" acknowledgement                  | `#/web/onboarding/welcome`         | Done   |
| 5 | Welcome email (preview — fired by approval)               | `#/web/onboarding/email`           | Done   |
| 6 | First-session dashboard (post-approval landing)           | `#/web/onboarding/dashboard`       | Done   |

---

## Gaps & Open Questions

- Application review SLA isn't surfaced anywhere — should the welcome screen give an expected timeframe?
- Email currently uses placeholder "Sign In" CTA — needs a real magic-link / token flow when this becomes real
- "Explore how Vintiga works" CTA on the welcome screen has no destination yet — could go to a marketing page or a video walkthrough
- No password-reset flow yet (referenced from sign-in's "Forgot password?")
- No SSO / social-login surface yet

For free-form observations and improvements, use [`./NOTES.md`](./NOTES.md) instead.
