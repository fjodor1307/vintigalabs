// Presentations → Vintiga Overview (July 2026).
// A full-screen, branded slide deck built from the investor overview PPTX.
// Vintiga tokens + Inter type, brand photography from `public/brand/imagery/`,
// snappy fade-rise transitions, keyboard + on-screen navigation.

import { useEffect, useState, type ReactNode } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  CheckIcon,
  SparklesIcon,
  TrendingUpIcon,
  ChartIcon,
  CreditCardIcon,
  UsersIcon,
  CalendarIcon,
  StarIcon,
  DollarIcon,
  GlobeIcon,
  TargetIcon,
  BuildingIcon,
  MailIcon,
} from '@ds/icons/Icons'
import { VintigaIconBlack } from '@ds/shared/VintigaLogo'

const img = (p: string) => `/brand/imagery/${p}`

// ─── Reusable slide primitives ────────────────────────────────────────────────

function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <div className={`animate-[fadeUp_0.5s_ease-out_both] ${className}`} style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  )
}

function Kicker({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`typo-caption font-semibold uppercase tracking-[0.16em] ${dark ? 'text-vintiga-indigo-300' : 'text-vintiga-indigo-600'}`}>
      {children}
    </span>
  )
}

function Title({ children, dark, className = '' }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <h1 className={`font-vintiga-display font-light leading-[1.05] text-4xl md:text-5xl lg:text-[3.4rem] ${dark ? 'text-white' : 'text-vintiga-slate-900'} ${className}`}>
      {children}
    </h1>
  )
}

function Lead({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return <p className={`typo-body md:text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-vintiga-slate-500'}`}>{children}</p>
}

function Stat({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={`font-vintiga-display font-light leading-none text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-vintiga-indigo-600'}`}>{value}</span>
      <span className={`typo-body-sm leading-snug ${dark ? 'text-white/65' : 'text-vintiga-slate-500'}`}>{label}</span>
    </div>
  )
}

function IconChip({ icon, dark }: { icon: ReactNode; dark?: boolean }) {
  return (
    <span className={`shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full ${dark ? 'bg-white/10 text-white' : 'bg-vintiga-indigo-50 text-vintiga-indigo-600'} [&>svg]:w-5 [&>svg]:h-5`}>
      {icon}
    </span>
  )
}

function Check({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckIcon className={`w-4 h-4 mt-1 shrink-0 ${dark ? 'text-vintiga-indigo-300' : 'text-vintiga-indigo-600'}`} />
      <span className={`typo-body-sm md:text-base ${dark ? 'text-white/80' : 'text-vintiga-slate-700'}`}>{children}</span>
    </li>
  )
}

function Frame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-vintiga-2xl border border-vintiga-slate-200/60 bg-vintiga-slate-100 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}

// Full-bleed photographic background with a dark gradient wash (title / dividers).
function PhotoBg({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a12]/90 via-[#0a0a12]/70 to-[#0a0a12]/55" />
    </div>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-vintiga-indigo-600 text-white font-vintiga-display text-lg font-medium shrink-0">
      {initials}
    </span>
  )
}

// ─── Slides ───────────────────────────────────────────────────────────────────

type Slide = { theme: 'dark' | 'light' | 'indigo'; render: () => ReactNode }

const SLIDES: Slide[] = [
  // 1 — Title
  {
    theme: 'dark',
    render: () => (
      <>
        <PhotoBg src={img('locations/estate-terrace.jpg')} alt="Sun-drenched vineyard estate terrace at golden hour" />
        <div className="flex flex-col justify-between h-full">
          <div aria-hidden />
          <div className="flex flex-col gap-vintiga-lg max-w-4xl">
            <Reveal i={1}><Kicker dark>Guest Intelligence</Kicker></Reveal>
            <Reveal i={2}>
              <Title dark className="!text-5xl md:!text-6xl lg:!text-7xl">Powering the world's most remarkable wineries</Title>
            </Reveal>
            <Reveal i={3}><p className="text-2xl lg:text-3xl font-vintiga-display font-light text-vintiga-indigo-200">More visitors. More members. More revenue.</p></Reveal>
          </div>
          <Reveal i={4}>
            <div className="flex items-center gap-vintiga-md typo-body-sm text-white/70">
              <span className="font-semibold text-white">Jim Secord</span>
              <span className="text-white/40">·</span>
              <span>Founder</span>
              <span className="text-white/40">·</span>
              <span>VintigaLabs.com · jim@vintigalabs.com</span>
            </div>
          </Reveal>
        </div>
      </>
    ),
  },

  // 2 — The Problem
  {
    theme: 'light',
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-vintiga-2xl items-center h-full">
        <div className="flex flex-col gap-vintiga-lg">
          <Reveal><Kicker>The Problem</Kicker></Reveal>
          <Reveal i={1}><Title>The winery growth crisis</Title></Reveal>
          <Reveal i={2}><Lead>Wineries are facing unprecedented headwinds.</Lead></Reveal>
          <div className="flex flex-col divide-y divide-vintiga-slate-100 mt-vintiga-sm">
            {[
              ['U.S. wine sales down ~20% from peak', 'A prolonged, industry-wide demand slowdown.'],
              ['Tasting-room visitation is falling', 'Wineries are cutting fees and adding promotions just to attract guests.'],
              ['Club growth & retention under pressure', 'Fewer visitors mean fewer chances to acquire loyal members.'],
              ['Operating costs rising 4–8% a year', "They can't simply raise prices — they must earn more from every guest."],
            ].map(([h, s], k) => (
              <Reveal key={h} i={3 + k} className="py-vintiga-md">
                <p className="typo-body md:text-lg font-semibold text-vintiga-slate-900">{h}</p>
                <p className="typo-body-sm text-vintiga-slate-500 mt-0.5">{s}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal i={2} className="h-[70vh] max-h-[560px]">
          <Frame src={img('locations/wine-barrels.jpg')} alt="Oak wine barrels in warm evening light" className="h-full" />
        </Reveal>
      </div>
    ),
  },

  // 3 — Why Vintiga Now
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-2xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Why Vintiga Now?</Kicker></Reveal>
          <Reveal i={1}><Title>The winery business has fundamentally changed</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-xl">
          {[
            [<SparklesIcon key="s" />, 'AI makes personalized hospitality possible', 'Every winery can now deliver the guest intelligence once reserved for luxury brands.'],
            [<TrendingUpIcon key="t" />, 'Slowing demand makes personalization essential', 'Declining visits and slower club growth make conversion and retention mission-critical.'],
            [<UsersIcon key="u" />, 'Relationships beat volume', "The next decade won't be won by producing more wine — it'll be won by building better customer relationships."],
          ].map(([icon, h, s], k) => (
            <Reveal key={h as string} i={2 + k} className="flex flex-col gap-vintiga-md">
              <IconChip icon={icon} />
              <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{h}</p>
              <p className="typo-body-sm md:text-base text-vintiga-slate-500 leading-relaxed">{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  // 4 — Core problem: tasting room
  {
    theme: 'indigo',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker dark>The Core Problem</Kicker></Reveal>
          <Reveal i={1}><Title dark>The tasting room is the most underutilized asset</Title></Reveal>
          <Reveal i={2}><Lead dark>It drives the majority of customer relationships — yet most visits never become long-term revenue.</Lead></Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-vintiga-xl">
          {[
            ['55%', 'of all DTC transactions happen in the tasting room'],
            ['47%', 'of all new customer records are created in tasting rooms'],
            ['39%', 'of DTC revenue comes from wine clubs'],
            ['72%', 'of guests leave without a digital profile or contact info'],
          ].map(([v, l], k) => (
            <Reveal key={l} i={3 + k}><Stat value={v} label={l} dark /></Reveal>
          ))}
        </div>
        <Reveal i={7} className="max-w-3xl rounded-vintiga-2xl bg-white/5 border border-white/10 p-vintiga-lg">
          <p className="typo-body-sm md:text-base text-white/80"><span className="font-semibold text-white">The core problem — </span>wineries lack tools to identify and nurture guests, and data stays fragmented across POS, clubs, and reservations.</p>
        </Reveal>
        <Reveal i={8}><p className="typo-caption text-white/40">Source: Silicon Valley Bank, 2026 State of the Wine Industry Survey</p></Reveal>
      </div>
    ),
  },

  // 5 — The Wedge
  {
    theme: 'light',
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-vintiga-2xl items-center h-full">
        <Reveal i={1} className="h-[70vh] max-h-[560px] order-last lg:order-first">
          <Frame src={img('mockups/iphone-guest-profile-wine.jpg')} alt="Hands holding an iPhone showing a Vintiga guest profile at a wine-bar table" className="h-full" />
        </Reveal>
        <div className="flex flex-col gap-vintiga-lg">
          <Reveal><Kicker>The Wedge</Kicker></Reveal>
          <Reveal i={1}><Title>Start small. Win big.</Title></Reveal>
          <Reveal i={2}><Lead>Vintiga Guest Intelligence layers into a winery's existing Commerce7 and Shopify (coming soon) stack — adopt quickly, no rip-and-replace.</Lead></Reveal>
          <ul className="flex flex-col gap-vintiga-md mt-vintiga-sm">
            {[
              'No migration required — works with Commerce7 and Shopify as an app.',
              'Immediate value from guest data and automated follow-up.',
              'The easiest way to start increasing Visit Value.',
            ].map((t, k) => (
              <Reveal key={t} i={3 + k}><Check>{t}</Check></Reveal>
            ))}
          </ul>
        </div>
      </div>
    ),
  },

  // 6 — Outcomes (3 steps)
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Outcomes</Kicker></Reveal>
          <Reveal i={1}><Title>More visitors. More members. More revenue.</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
          {[
            { icon: <CalendarIcon key="c" />, step: 'Step 01', title: 'Before the visit', sub: 'More of the right guests', items: ['Increase tasting-room reservations', 'Fill slow days & last-minute openings', 'Attract higher-value visitors', 'Lower customer acquisition cost', 'Improve marketing ROI'] },
            { icon: <UsersIcon key="u" />, step: 'Step 02', title: 'During the visit', sub: 'Convert guests into members', items: ['Increase wine-club conversion', 'Increase average spend per guest', 'Deliver personalized hospitality', 'Capture valuable guest intelligence', 'Create loyal customers'] },
            { icon: <StarIcon key="s" />, step: 'Step 03', title: 'After the visit', sub: 'Build lifelong relationships', items: ['Increase repeat visits', 'Grow customer lifetime value', 'Generate more 5-star reviews', 'Drive future purchases', 'Increase event attendance'] },
          ].map((c, k) => (
            <Reveal key={c.step} i={2 + k} className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-lg">
              <div className="flex items-center justify-between">
                <IconChip icon={c.icon} />
                <span className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-500">{c.step}</span>
              </div>
              <div>
                <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{c.title}</p>
                <p className="typo-body-sm text-vintiga-indigo-600 font-medium">{c.sub}</p>
              </div>
              <ul className="flex flex-col gap-2 mt-auto">
                {c.items.map((t) => <Check key={t}>{t}</Check>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  // 7 — The Solution
  {
    theme: 'light',
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-vintiga-2xl items-center h-full">
        <div className="flex flex-col gap-vintiga-lg">
          <Reveal><Kicker>The Solution</Kicker></Reveal>
          <Reveal i={1}><Title>A revenue growth platform for wineries</Title></Reveal>
          <ul className="flex flex-col gap-vintiga-md mt-vintiga-sm">
            {[
              'Grow wine-club membership',
              'Increase average order value',
              'Drive repeat purchases',
              'Deliver personalized hospitality at scale',
              'Measure & optimize revenue growth',
            ].map((t, k) => (
              <Reveal key={t} i={2 + k}>
                <div className="flex items-center gap-vintiga-md">
                  <IconChip icon={<TrendingUpIcon />} />
                  <span className="typo-title-subsection font-medium text-vintiga-slate-900">{t}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal i={2} className="h-[70vh] max-h-[560px]">
          <Frame src={img('mockups/dashboard-screen-closeup.jpg')} alt="Close-up of an angled monitor showing the Vintiga dashboard" className="h-full" />
        </Reveal>
      </div>
    ),
  },

  // 8 — Why wineries buy (cost table)
  {
    theme: 'light',
    render: () => {
      const rows = [
        ['eCommerce + POS', 'Commerce7 / Shopify', '$2,500', '$1,788', '$712'],
        ['Payment Processing', 'Shopify / FullSteam / Square', '$16,250', '$13,000', '$3,250'],
        ['Website Hosting + Mgmt', 'Agency + WordPress', '$5,000', 'Incl.', '$5,000'],
        ['Email Marketing', 'Mailchimp / Klaviyo', '$2,000', 'Incl.', '$2,000'],
        ['SMS Marketing', 'Redchirp / Twilio', '$1,000', 'Incl.', '$1,000'],
        ['Reservations', 'Tock / CellarPass', '$2,000', 'Incl.', '$2,000'],
        ['Guest Intelligence', 'Not available', '—', 'Incl.', '—'],
      ]
      return (
        <div className="flex flex-col gap-vintiga-lg h-full justify-center">
          <div className="flex flex-col gap-vintiga-sm max-w-4xl">
            <Reveal><Kicker>Why Wineries Buy Vintiga</Kicker></Reveal>
            <Reveal i={1}><Title>Increase revenue. Replace vendors. Lower costs.</Title></Reveal>
            <Reveal i={2}><Lead>Most wineries justify Vintiga through cost savings alone — <span className="text-vintiga-indigo-600 font-semibold">$13,962</span> a year at $500K DTC sales — before the upside of converting more members and lifting order value.</Lead></Reveal>
          </div>
          <Reveal i={3} className="overflow-x-auto rounded-vintiga-2xl border border-vintiga-slate-200">
            <table className="w-full border-collapse typo-body-sm">
              <thead>
                <tr className="bg-vintiga-slate-50 text-left">
                  {['Function', 'Typical vendor', 'Typical stack', 'With Vintiga', 'Savings'].map((h) => (
                    <th key={h} className="px-vintiga-md py-vintiga-sm font-semibold text-vintiga-slate-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r[0]} className="border-t border-vintiga-slate-100">
                    <td className="px-vintiga-md py-vintiga-sm font-medium text-vintiga-slate-900 whitespace-nowrap">{r[0]}</td>
                    <td className="px-vintiga-md py-vintiga-sm text-vintiga-slate-500 whitespace-nowrap">{r[1]}</td>
                    <td className="px-vintiga-md py-vintiga-sm text-vintiga-slate-500 tabular-nums">{r[2]}</td>
                    <td className="px-vintiga-md py-vintiga-sm text-vintiga-slate-500 tabular-nums">{r[3]}</td>
                    <td className="px-vintiga-md py-vintiga-sm font-semibold text-vintiga-slate-900 tabular-nums">{r[4]}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-vintiga-indigo-200 bg-vintiga-indigo-50/60">
                  <td className="px-vintiga-md py-vintiga-sm font-semibold text-vintiga-slate-900" colSpan={2}>Annual total</td>
                  <td className="px-vintiga-md py-vintiga-sm font-semibold text-vintiga-slate-700 tabular-nums">$28,750</td>
                  <td className="px-vintiga-md py-vintiga-sm font-semibold text-vintiga-slate-700 tabular-nums">$14,788</td>
                  <td className="px-vintiga-md py-vintiga-sm font-bold text-vintiga-indigo-600 tabular-nums">$13,962</td>
                </tr>
              </tbody>
            </table>
          </Reveal>
        </div>
      )
    },
  },

  // 9 — Validation & differentiators
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <Reveal><Kicker>Early Validation &amp; Differentiators</Kicker></Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1fr_1fr] gap-vintiga-2xl">
          <Reveal i={1} className="hidden lg:block">
            <Frame src={img('compositions/emma-desk-03.jpg')} alt="Winery operator working at her desk with the Vintiga dashboard on dual monitors" className="h-full" />
          </Reveal>
          <Reveal i={2} className="flex flex-col gap-vintiga-lg">
            <p className="typo-title-section font-semibold text-vintiga-slate-900">Market validation</p>
            <ul className="flex flex-col gap-vintiga-md">
              {['8 paid pilots (Q3 2026)', '24 wineries in active discussions', '3 agency partners & consultants recommending Vintiga', 'Participating in industry events across WA, OR & CA'].map((t) => (
                <Check key={t}>{t}</Check>
              ))}
            </ul>
          </Reveal>
          <Reveal i={3} className="flex flex-col gap-vintiga-lg">
            <p className="typo-title-section font-semibold text-vintiga-slate-900">Technology differentiators</p>
            <div className="flex flex-col gap-vintiga-md">
              {[
                ['Guest Intelligence', 'AI-powered guest insights on iPhone & iPad, built for the tasting room.'],
                ['Apple Tap to Pay', 'Seamless mobile checkout designed for winery hospitality.'],
                ['No migration required', 'Adds to Commerce7 and Shopify (coming soon).'],
                ['Fortis Certified', 'Embedded payments earn recurring revenue on every transaction.'],
              ].map(([h, s]) => (
                <div key={h} className="flex items-start gap-vintiga-md">
                  <IconChip icon={<SparklesIcon />} />
                  <div>
                    <p className="typo-body md:text-lg font-semibold text-vintiga-slate-900">{h}</p>
                    <p className="typo-body-sm text-vintiga-slate-500">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal i={4} className="rounded-vintiga-2xl bg-vintiga-indigo-50 border border-vintiga-indigo-100 p-vintiga-lg">
          <p className="typo-body md:text-lg text-vintiga-slate-900"><span className="font-semibold text-vintiga-indigo-600">Every winery generates subscription + payment revenue</span> — predictable growth and expanding margins.</p>
        </Reveal>
      </div>
    ),
  },

  // 10 — Three revenue streams
  {
    theme: 'light',
    render: () => {
      const streams = [
        {
          icon: <ChartIcon key="c" />,
          n: '1',
          title: 'Software Subscription',
          sub: 'Recurring SaaS revenue',
          stat: '$3.5K–$12K',
          statLabel: 'Annual subscription revenue',
          points: ['Predictable recurring revenue', 'High gross margins', 'Strong retention'],
        },
        {
          icon: <CreditCardIcon key="p" />,
          n: '2',
          title: 'Payments Revenue',
          sub: 'Variable revenue tied to growth',
          stat: '0.5%–0.75%',
          statLabel: 'of GMV',
          points: ['Scales with winery growth', 'High retention', 'Low-churn revenue stream'],
        },
        {
          icon: <TrendingUpIcon key="e" />,
          n: '3',
          title: 'Expansion Products',
          sub: 'High-margin add-on solutions',
          list: ['AI Guest Intelligence', 'Marketing Automation', 'SMS & Messaging', 'Premium Websites', 'API & MCP Access', 'AI Revenue Optimization'],
          note: 'Expand wallet share over time',
        },
      ]
      const tiers = [
        ['Small Winery', '~$500K DTC sales', '~$9K'],
        ['Growing Winery', '~$1M DTC sales', '~$15K'],
        ['Enterprise Winery', '~$4M+ DTC sales', '~$37K+'],
      ]
      return (
        <div className="flex flex-col justify-center h-full gap-vintiga-md">
          <Reveal><Kicker>Three Revenue Streams</Kicker></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-md">
            {streams.map((s, k) => (
              <Reveal key={s.title} i={1 + k} className="rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-md flex flex-col gap-vintiga-sm">
                <div className="flex items-center gap-vintiga-sm">
                  <IconChip icon={s.icon} />
                  <div>
                    <p className="typo-body font-semibold text-vintiga-slate-900"><span className="text-vintiga-indigo-600">{s.n}.</span> {s.title}</p>
                    <p className="typo-caption text-vintiga-slate-500">{s.sub}</p>
                  </div>
                </div>
                {s.stat ? (
                  <div className="mt-1">
                    <p className="font-vintiga-display font-light text-3xl text-vintiga-indigo-600 leading-none">{s.stat}</p>
                    <p className="typo-caption text-vintiga-slate-500 mt-0.5">{s.statLabel}</p>
                    <ul className="flex flex-col gap-1.5 mt-vintiga-sm">
                      {s.points!.map((p) => <Check key={p}>{p}</Check>)}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-1">
                    <ul className="grid grid-cols-1 gap-1.5">
                      {s.list!.map((t) => (
                        <li key={t} className="flex items-center gap-2 typo-body-sm text-vintiga-slate-700">
                          <SparklesIcon className="w-3.5 h-3.5 text-vintiga-indigo-500 shrink-0" />{t}
                        </li>
                      ))}
                    </ul>
                    <p className="typo-caption font-semibold text-vintiga-indigo-600 mt-vintiga-sm">{s.note}</p>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
          <Reveal i={4} className="rounded-vintiga-2xl bg-vintiga-slate-50 border border-vintiga-slate-200 p-vintiga-md grid grid-cols-2 lg:grid-cols-4 gap-vintiga-md items-center">
            <div className="flex items-center gap-vintiga-sm">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-vintiga-indigo-600 text-white [&>svg]:w-4 [&>svg]:h-4"><DollarIcon /></span>
              <div>
                <p className="typo-body-sm font-semibold text-vintiga-slate-900">Revenue per winery</p>
                <p className="typo-caption text-vintiga-slate-500">Grows as wineries grow</p>
              </div>
            </div>
            {tiers.map(([name, dtc, rev]) => (
              <div key={name}>
                <p className="typo-body-sm font-semibold text-vintiga-slate-900">{name}</p>
                <p className="typo-caption text-vintiga-slate-500">{dtc}</p>
                <p className="font-vintiga-display font-light text-2xl text-vintiga-indigo-600 mt-1 leading-none">{rev}</p>
              </div>
            ))}
          </Reveal>
          <Reveal i={5} className="rounded-vintiga-2xl border border-vintiga-slate-200 px-vintiga-lg py-vintiga-sm flex items-center gap-vintiga-sm">
            <TrendingUpIcon className="w-4 h-4 text-vintiga-indigo-600 shrink-0" />
            <p className="typo-body-sm text-vintiga-slate-700"><span className="font-semibold text-vintiga-indigo-600">Designed to scale.</span> More visitors. More members. More revenue. Year after year.</p>
          </Reveal>
        </div>
      )
    },
  },

  // 11 — Target market
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>The Target Market</Kicker></Reveal>
          <Reveal i={1}><Title>15,000+ wineries</Title></Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-vintiga-xl">
          {[
            [<GlobeIcon key="g" />, '15,000+', 'wineries across North America, AUS & NZ'],
            [<UsersIcon key="u" />, '35–40M', 'winery visits annually'],
            [<DollarIcon key="d" />, '$1M', 'avg. ICP DTC sales per year'],
            [<TargetIcon key="t" />, '$15B', 'annual GMV opportunity'],
          ].map(([icon, v, l], k) => (
            <Reveal key={l as string} i={2 + k} className="flex flex-col gap-vintiga-sm">
              <IconChip icon={icon} />
              <span className="font-vintiga-display font-light text-5xl lg:text-6xl text-vintiga-indigo-600 leading-none">{v}</span>
              <span className="typo-body-sm text-vintiga-slate-500">{l}</span>
            </Reveal>
          ))}
        </div>
        <Reveal i={6} className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-lg mt-vintiga-sm">
          <div className="rounded-vintiga-2xl border border-vintiga-slate-200 p-vintiga-lg">
            <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-600">Payments TAM</p>
            <p className="typo-body md:text-lg text-vintiga-slate-700 mt-1">15K wineries × $1M GMV × 0.75% ≈ <span className="font-semibold text-vintiga-slate-900">$112M</span> payments revenue.</p>
          </div>
          <div className="rounded-vintiga-2xl border border-vintiga-slate-200 p-vintiga-lg">
            <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-600">Then add software</p>
            <p className="typo-body md:text-lg text-vintiga-slate-700 mt-1"><span className="font-semibold text-vintiga-slate-900">$100M+</span> annual revenue opportunity from subscriptions + payments combined.</p>
          </div>
        </Reveal>
      </div>
    ),
  },

  // 12 — The Team
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>The Team</Kicker></Reveal>
          <Reveal i={1}><Title>Built by the people who built modern wine commerce</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
          {[
            ['JS', 'Jim Secord', 'Founder', 'Three-time founder and 25-year product veteran; previously led product at WineDirect, modernizing winery DTC. Founded Vintiga to turn tasting-room visitors into lifelong customers.'],
            ['DA', 'Donna Ataman', 'Product & Customer Lead', 'Product leader formerly of WineDirect and Intuit (QuickBooks Online), with deep winery-operations experience across clubs, compliance, fulfillment and tasting-room workflows.'],
            ['GS', 'Geoff Spears', 'Engineering Lead', 'Award-winning software architect; engineered an offline-first, iPhone-based commerce platform that replaces costly hardware with a reliable, high-performance system.'],
          ].map(([ini, name, role, bio], k) => (
            <Reveal key={name} i={2 + k} className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-lg">
              <Avatar initials={ini} />
              <div>
                <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{name}</p>
                <p className="typo-body-sm text-vintiga-indigo-600 font-medium">{role}</p>
              </div>
              <p className="typo-body-sm text-vintiga-slate-500 leading-relaxed">{bio}</p>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  // 13 — Go-to-market
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Go-To-Market</Kicker></Reveal>
          <Reveal i={1}><Title>A founder-led plan, focused on the West Coast</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-vintiga-2xl gap-y-vintiga-lg">
          {[
            [<TargetIcon key="t" />, 'Ideal customer profile', 'Premium wineries & distilleries doing $100K–$3M in annual DTC sales.'],
            [<GlobeIcon key="g" />, 'Regional beachhead', 'Initial rollout in WA, OR & CA — the top DTC markets.'],
            [<UsersIcon key="u" />, 'Direct outreach', 'Founder-led sales to early adopters.'],
            [<SparklesIcon key="s" />, 'Influencers', 'Sommelier & spokesperson Steven D. Moralez-Brown hosting events and webinars.'],
            [<BuildingIcon key="b" />, 'Agency partnerships', 'Consultants & marketing agencies who package Vintiga with their services.'],
            [<CalendarIcon key="c" />, 'Events', 'DTC conferences, partner events and regional trade shows.'],
          ].map(([icon, h, s], k) => (
            <Reveal key={h as string} i={2 + k}>
              <div className="flex items-start gap-vintiga-md">
                <IconChip icon={icon} />
                <div>
                  <p className="typo-body md:text-lg font-semibold text-vintiga-slate-900">{h}</p>
                  <p className="typo-body-sm text-vintiga-slate-500">{s}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  // 14 — Financial
  {
    theme: 'light',
    render: () => {
      const cols = ['Year 1 · 2026', 'Year 2 · 2027', 'Year 3 · 2028']
      const rows: [string, string[], boolean?][] = [
        ['Active wineries', ['71', '301', '723']],
        ['Annual GMV', ['$12M', '$141M', '$400M']],
        ['Subscription revenue', ['$57K', '$672K', '$1.85M']],
        ['Payments revenue', ['$71K', '$833K', '$2.36M']],
        ['Total revenue', ['$128K', '$1.51M', '$4.21M'], true],
        ['Net profit / (loss)', ['($589K)', '$535K', '$3.0M']],
        ['Ending cash', ['$67K', '$603K', '$3.61M']],
      ]
      return (
        <div className="flex flex-col gap-vintiga-lg h-full justify-center">
          <div className="flex flex-col gap-vintiga-sm max-w-4xl">
            <Reveal><Kicker>Financial</Kicker></Reveal>
            <Reveal i={1}><Title>Path to 70 wineries and cash-flow positive</Title></Reveal>
            <Reveal i={2}><Lead>Revenue forecast — subscription + payments.</Lead></Reveal>
          </div>
          <Reveal i={3} className="overflow-x-auto rounded-vintiga-2xl border border-vintiga-slate-200">
            <table className="w-full border-collapse typo-body-sm">
              <thead>
                <tr className="bg-vintiga-slate-50 text-left">
                  <th className="px-vintiga-lg py-vintiga-md font-semibold text-vintiga-slate-700"> </th>
                  {cols.map((c) => <th key={c} className="px-vintiga-lg py-vintiga-md font-semibold text-vintiga-slate-700 text-right whitespace-nowrap">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, vals, highlight]) => (
                  <tr key={label} className={`border-t border-vintiga-slate-100 ${highlight ? 'bg-vintiga-indigo-50/60' : ''}`}>
                    <td className={`px-vintiga-lg py-vintiga-md whitespace-nowrap ${highlight ? 'font-bold text-vintiga-indigo-700' : 'font-medium text-vintiga-slate-900'}`}>{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`px-vintiga-lg py-vintiga-md text-right tabular-nums ${highlight ? 'font-bold text-vintiga-indigo-700' : 'text-vintiga-slate-600'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      )
    },
  },

  // 15 — Funding: raise
  {
    theme: 'dark',
    render: () => (
      <div className="flex flex-col gap-vintiga-2xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-md max-w-4xl">
          <Reveal><Kicker dark>Funding</Kicker></Reveal>
          <Reveal i={1}>
            <div className="flex items-baseline gap-vintiga-lg flex-wrap">
              <span className="font-vintiga-display font-light text-white text-7xl lg:text-8xl leading-none">$500K</span>
              <span className="typo-body md:text-lg text-vintiga-indigo-200">SAFE financing · $200K committed · $300K remaining</span>
            </div>
          </Reveal>
          <Reveal i={2}><Lead dark>To reach 70 wineries, $60K+ MRR, and positive cash flow.</Lead></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-2xl">
          <Reveal i={3} className="flex flex-col gap-vintiga-md">
            <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-300">Use of funds</p>
            <ul className="flex flex-col gap-vintiga-md">
              {['Go-to-market with West Coast wineries', 'Build a repeatable sales process', 'Keep investing in Guest Intelligence & AI'].map((t) => <Check key={t} dark>{t}</Check>)}
            </ul>
          </Reveal>
          <Reveal i={4} className="flex flex-col gap-vintiga-md">
            <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-300">Expected outcomes</p>
            <ul className="flex flex-col gap-vintiga-md">
              {['70 active wineries', '$60K+ monthly recurring revenue', 'Positive cash flow', 'Payments embedded across the customer base'].map((t) => <Check key={t} dark>{t}</Check>)}
            </ul>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 16 — Funding: investor returns
  {
    theme: 'light',
    render: () => (
      <div className="flex flex-col gap-vintiga-xl h-full justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Funding</Kicker></Reveal>
          <Reveal i={1}><Title>Investor returns &amp; alignment</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-2xl">
          <Reveal i={2} className="flex flex-col gap-vintiga-lg">
            <div className="flex items-center gap-vintiga-md"><IconChip icon={<BuildingIcon />} /><p className="typo-title-section font-semibold text-vintiga-slate-900">A durable business</p></div>
            <ul className="flex flex-col gap-vintiga-md">
              {['Focused on sustainable growth and profitability', 'Revenue across software, payments, guest intelligence & hospitality services', 'Founder-led with a long-term operating horizon'].map((t) => <Check key={t}>{t}</Check>)}
            </ul>
          </Reveal>
          <Reveal i={3} className="flex flex-col gap-vintiga-lg">
            <div className="flex items-center gap-vintiga-md"><IconChip icon={<DollarIcon />} /><p className="typo-title-section font-semibold text-vintiga-slate-900">Investor outcomes</p></div>
            <ul className="flex flex-col gap-vintiga-md">
              {['Multiple liquidity paths — strategic acquisition or investor buyouts', 'Long-term cash-flow distributions', 'Future growth financing', 'May qualify for favorable QSBS tax treatment after a 5-year hold'].map((t) => <Check key={t}>{t}</Check>)}
            </ul>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 17 — Closing
  {
    theme: 'dark',
    render: () => (
      <>
        <PhotoBg src={img('locations/garden-path.jpg')} alt="Golden-hour garden path at a wine estate" />
        <div className="flex flex-col justify-between h-full">
          <div aria-hidden />
          <div className="flex flex-col gap-vintiga-lg max-w-4xl">
            <Reveal i={1}><Title dark className="!text-5xl md:!text-6xl lg:!text-7xl">Powering the world's most remarkable wineries</Title></Reveal>
            <Reveal i={2}><p className="text-2xl lg:text-3xl font-vintiga-display font-light text-vintiga-indigo-200">More visitors. More members. More revenue.</p></Reveal>
          </div>
          <Reveal i={3}>
            <div className="flex items-center gap-vintiga-md typo-body-sm text-white/70">
              <span className="font-semibold text-white">Jim Secord</span>
              <span className="text-white/40">·</span>
              <span>Founder</span>
              <span className="inline-flex items-center gap-1.5 text-white/70"><MailIcon className="w-4 h-4" /> jim@vintigalabs.com</span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1.5"><GlobeIcon className="w-4 h-4" /> VintigaLabs.com</span>
            </div>
          </Reveal>
        </div>
      </>
    ),
  },
]

// ─── Deck shell ───────────────────────────────────────────────────────────────

const THEME_BG: Record<Slide['theme'], string> = {
  light: 'bg-vintiga-white',
  dark: 'bg-[#0a0a12]',
  indigo: 'bg-vintiga-indigo-700',
}

function exitToHub() {
  localStorage.setItem('vintiga-hub-segment', 'Presentations')
  window.location.hash = '#/'
}

export function VintigaOverviewScreen() {
  const [index, setIndex] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[index]
  const dark = slide.theme !== 'light'

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(total - 1, i + 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); setIndex((i) => Math.min(total - 1, i + 1)) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)) }
      else if (e.key === 'Home') setIndex(0)
      else if (e.key === 'End') setIndex(total - 1)
      else if (e.key === 'Escape') exitToHub()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [total])

  const ctrl = `inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${dark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-vintiga-slate-500 hover:text-vintiga-slate-900 hover:bg-vintiga-slate-100'}`

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden font-vintiga-body ${THEME_BG[slide.theme]}`}>
      <style>{`@keyframes deckIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Slide stage — only the active slide is mounted, so it re-enters on change. */}
      <div key={index} className="absolute inset-0 animate-[deckIn_360ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="relative h-full w-full max-w-[1400px] mx-auto px-8 sm:px-14 lg:px-20 pt-16 pb-20 flex flex-col">
          {slide.render()}
        </div>
      </div>

      {/* Top chrome — wordmark + exit */}
      <div className="absolute top-0 inset-x-0 h-16 px-8 sm:px-14 lg:px-20 flex items-center justify-between pointer-events-none">
        <VintigaIconBlack size={30} className="pointer-events-auto rounded-[9px]" aria-label="Vintiga" />
        <span className="sr-only">Vintiga</span>
        <button type="button" onClick={exitToHub} aria-label="Exit presentation" className={`${ctrl} pointer-events-auto`}>
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom chrome — prev · counter · next + progress */}
      <div className="absolute bottom-0 inset-x-0">
        <div className="h-14 px-8 sm:px-14 lg:px-20 flex items-center justify-center gap-vintiga-md">
          <button type="button" onClick={prev} disabled={index === 0} aria-label="Previous slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className={`typo-body-sm tabular-nums min-w-[3.5rem] text-center ${dark ? 'text-white/60' : 'text-vintiga-slate-400'}`}>
            {index + 1} / {total}
          </span>
          <button type="button" onClick={next} disabled={index === total - 1} aria-label="Next slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Thin progress line */}
        <div className={`h-1 w-full ${dark ? 'bg-white/10' : 'bg-vintiga-slate-100'}`}>
          <div className="h-full bg-vintiga-indigo-500 transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
