# Onboarding — Context

> The why and the what behind this prototype. Read this before opening a screen.

**Source of truth:** [Figma — Dashboard 05 / Onboarding flow](https://www.figma.com/design/3DnxyYDZqDGQqvknlD4aTu/05.-Dashboard?node-id=5029-2855)
**Last synced:** 2026-04-27 by claude
**Owner:** —
**Status:** in-progress

---

## Why this exists

First-touch experience for a new winery / brewery operator. The prototype covers the full sign-up funnel from landing on the sign-in page through to a populated dashboard, plus the welcome email that confirms account approval. Goal is to validate copy, layout, and step sequencing for the application-style onboarding (not self-serve — there's a human review step between business-details submission and account activation).

## Who it's for

- **Primary persona:** Owner / GM of a small winery, brewery, or tasting-room business signing up to Vintiga.

## Pillars this advances

- [ ] Activation — get a new account from interest → first signed-in session
- [ ] Trust — landing pages, hero photography, and quotes signal "made for hospitality operators"

## Key user stories

- **—** As a returning operator I want to sign in with my email and password so that I can get back to work quickly
- **—** As a prospective operator I want to create an account with my name, email, and password so that I can start my application
- **—** As a prospective operator I want to provide my business details (name, type, location, phone) and accept the terms so that Vintiga can review my application
- **—** As an applicant I want a clear acknowledgement that my application is under review so that I'm not left wondering what happens next
- **—** As an approved operator I want a welcome email with a sign-in link so that I can start using the platform
- **—** As a newly approved operator I want a populated dashboard on first sign-in so that I can immediately see the shape of the product

## Requirements & constraints

- Application-style sign-up (not self-serve activation): submit → wait for review → email confirms approval
- Sign-up is two steps: account credentials, then business details
- Visual hero on the right side of every onboarding step uses real winery/hospitality imagery + a customer quote
- Email template is rendered as a preview screen (not actually sent)

## Sources

- **Requirements:** Figma reference designs (linked above)
- **Brand essentials:** [`_context/brand/essentials.md`](../../../_context/brand/essentials.md)
