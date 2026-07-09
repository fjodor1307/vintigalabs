// Presentations → Vintiga Overview Slides (July 2026).
// A short branded deck (Figma 08. Soc — 5203:2112 / 5243:708 / 5248:797).
// Light theme throughout. Shares the Vintiga Overview deck's motion language:
// fadeUp reveals with staggered delays + the deckIn slide transition. The title
// slide adds a small "living dashboard" composition — images ease in, then the
// Total Revenue counts up and the goal progress bar fills.

import { useEffect, useState, useRef, type ReactNode } from 'react'
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
  EllipsisIcon,
} from '@ds/icons/Icons'
import { VintigaIconBlack } from '@ds/shared/VintigaLogo'

const img = (p: string) => `/brand/imagery/${p}`

// ─── Reusable slide primitives (shared motion language) ───────────────────────

function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <div className={`animate-[fadeUp_0.5s_ease-out_both] ${className}`} style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="typo-caption font-semibold uppercase tracking-[0.16em] text-vintiga-indigo-600">
      {children}
    </span>
  )
}

function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`font-vintiga-display font-light leading-[1.05] text-4xl md:text-5xl lg:text-[3.4rem] text-vintiga-slate-900 ${className}`}>
      {children}
    </h1>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="typo-body md:text-lg leading-relaxed text-vintiga-slate-500">{children}</p>
}

function IconChip({ icon }: { icon: ReactNode }) {
  return (
    <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-vintiga-indigo-50 text-vintiga-indigo-600 [&>svg]:w-5 [&>svg]:h-5">
      {icon}
    </span>
  )
}

function Frame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-vintiga-2xl bg-vintiga-slate-100 ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-vintiga-display font-light leading-none text-5xl lg:text-6xl text-vintiga-indigo-600">{value}</span>
      <span className="typo-body-sm leading-snug text-vintiga-slate-500">{label}</span>
    </div>
  )
}

function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-4 h-4 mt-1 shrink-0 text-vintiga-indigo-600 [&>svg]:w-4 [&>svg]:h-4"><CheckIcon /></span>
      <span className="typo-body-sm md:text-base text-vintiga-slate-700">{children}</span>
    </li>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-vintiga-indigo-600 text-white font-vintiga-display text-lg font-medium shrink-0">
      {initials}
    </span>
  )
}

// Team headshot with a graceful fallback: if the photo is missing (or fails to
// load) we fall back to the indigo initials avatar, so the slide never shows a
// broken image.
function PersonAvatar({ src, initials }: { src?: string; initials: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <Avatar initials={initials} />
  return (
    <span className="w-14 h-14 rounded-full overflow-hidden bg-vintiga-indigo-100 shrink-0">
      <img src={src} alt="" className="w-full h-full object-cover" onError={() => setFailed(true)} />
    </span>
  )
}

// ─── Title-slide composition ──────────────────────────────────────────────────
// A relative, aspect-locked stage so every layered element scales together on
// any viewport. Children are positioned in % so the whole composition shrinks
// as one unit down to mobile.

const AVATARS = [
  img('character-sheets/emma-portrait-01.jpg'),
  img('character-sheets/mika-portrait-cream.jpg'),
  img('character-sheets/sarah-portrait-tank.jpg'),
  img('character-sheets/mika-portrait-apron.jpg'),
]

/** Count a number up to `end` once on mount, easing out over `duration` ms. */
function useCountUp(end: number, duration = 1400, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    let start = 0
    const tick = (t: number) => {
      if (!start) start = t
      const elapsed = t - start - delay
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return }
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(Math.round(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, delay])
  return value
}

function DashboardComposition() {
  const revenue = useCountUp(38920, 1500, 650)
  // Progress bar fills after the cards settle in.
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setFilled(true), 750)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[520px] mx-auto aspect-[47/58]">
      {/* Persona photo — main frame, eases in first */}
      <Reveal i={0} className="absolute top-0 left-0 w-[92%] h-[72%]">
        <div className="w-full h-full animate-[compIn_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Frame
            src={img('compositions/emma-desk-03.jpg')}
            alt="Winery operator working at her desk with the Vintiga dashboard on dual monitors"
            className="w-full h-full shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]"
          />
        </div>
      </Reveal>

      {/* Terrace photo — offset lower-right, eases in second */}
      <Reveal i={2} className="absolute bottom-0 right-0 w-[54%] h-[42%]">
        <div className="w-full h-full animate-[compIn_0.7s_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:140ms]">
          <Frame
            src={img('locations/estate-terrace.jpg')}
            alt="Vineyard estate terrace with a parasol under a tree at golden hour"
            className="w-full h-full ring-4 ring-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.5)]"
          />
        </div>
      </Reveal>

      {/* Total Revenue card — glassy overlay, reveals after the images */}
      <Reveal i={4} className="absolute left-[6%] top-[40%] w-[66%]">
        <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-vintiga-slate-900/25 border border-white/30 shadow-[0_20px_46px_-16px_rgba(15,23,42,0.6)]">
          {/* Figma glass: -45° light sheen + a bright top edge highlight */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/5 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" />
          <div className="relative p-3.5 [text-shadow:0_1px_3px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between gap-2">
              <span className="typo-caption text-white/85">Total Revenue</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/25 text-white [&>svg]:w-3.5 [&>svg]:h-3.5"><DollarIcon /></span>
            </div>
            <p className="font-vintiga-display font-light text-white text-2xl md:text-[1.7rem] leading-none mt-1 tabular-nums">
              ${revenue.toLocaleString('en-US')}
            </p>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-vintiga-indigo-500 transition-[width] duration-[1200ms] ease-out"
                style={{ width: filled ? '78%' : '0%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="typo-caption text-white/70">Goal: $50,000.00</span>
              <span className="typo-caption text-white font-semibold tabular-nums">78%</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Avatars pill — reveals last */}
      <Reveal i={5} className="absolute left-[8%] bottom-[10%] ">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-xl px-2.5 py-1.5 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.4)] border border-white/50">
          <div className="flex -space-x-2">
            {AVATARS.map((src, k) => (
              <span key={k} className="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden bg-vintiga-slate-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </span>
            ))}
            <span className="w-6 h-6 rounded-full ring-2 ring-white bg-vintiga-indigo-100 text-vintiga-indigo-700 inline-flex items-center justify-center typo-caption font-semibold">A</span>
          </div>
          <span className="typo-caption font-semibold text-vintiga-slate-700">+6</span>
          <span className="text-vintiga-slate-500 [&>svg]:w-4 [&>svg]:h-4"><EllipsisIcon /></span>
        </div>
      </Reveal>
    </div>
  )
}

// ─── Slides ───────────────────────────────────────────────────────────────────

type Slide = { render: () => ReactNode }

function TitleSlide() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
      <div className="flex flex-col justify-center gap-vintiga-md lg:gap-vintiga-lg order-2 lg:order-1">
        <Reveal i={1}><Kicker>Guest Intelligence</Kicker></Reveal>
        <Reveal i={2}>
          <Title className="!text-[2.5rem] sm:!text-5xl md:!text-6xl lg:!text-7xl">Powering the world's most remarkable wineries</Title>
        </Reveal>
        <Reveal i={3}>
          <p className="text-xl sm:text-2xl lg:text-3xl font-vintiga-display font-light text-vintiga-indigo-600">More visitors. More members. More revenue.</p>
        </Reveal>
        <Reveal i={4} className="mt-vintiga-md">
          <div className="flex items-center gap-vintiga-md typo-body-sm text-vintiga-slate-500 flex-wrap">
            <span className="font-semibold text-vintiga-slate-900">Jim Secord</span>
            <span className="text-vintiga-slate-300">·</span>
            <span>Founder</span>
            <span className="text-vintiga-slate-300">·</span>
            <span>VintigaLabs.com</span>
            <span className="text-vintiga-slate-300">·</span>
            <span>jim@vintigalabs.com</span>
          </div>
        </Reveal>
      </div>
      <div className="order-1 lg:order-2 w-full">
        <DashboardComposition />
      </div>
    </div>
  )
}

const SLIDES: Slide[] = [
  // 1 — Title + living dashboard composition
  { render: () => <TitleSlide /> },

  // 2 — The Problem
  {
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
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
        <Reveal i={2} className="h-[42vh] lg:h-[60vh] max-h-[560px] order-first lg:order-last">
          <Frame src={img('locations/wine-barrels.jpg')} alt="Oak wine barrels in warm evening light" className="h-full" />
        </Reveal>
      </div>
    ),
  },

  // 3 — Why Vintiga Now
  {
    render: () => (
      <div className="flex flex-col gap-vintiga-xl lg:gap-vintiga-2xl justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Why Vintiga Now?</Kicker></Reveal>
          <Reveal i={1}><Title>The winery business has fundamentally changed</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
          {[
            [<SparklesIcon key="s" />, 'AI makes personalized hospitality possible', 'Every winery can now deliver the guest intelligence once reserved for luxury brands.'],
            [<TrendingUpIcon key="t" />, 'Slowing demand makes personalization essential', 'Declining visits and slower club growth make conversion and retention mission-critical.'],
            [<ChartIcon key="c" />, 'Relationships beat volume', "The next decade won't be won by producing more wine — it'll be won by building better customer relationships."],
          ].map(([icon, h, s], k) => (
            <Reveal key={h as string} i={2 + k} className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-lg">
              <IconChip icon={icon} />
              <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{h}</p>
              <p className="typo-body-sm md:text-base text-vintiga-slate-500 leading-relaxed">{s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  // 4 — Core problem: the tasting room
  {
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>The Core Problem</Kicker></Reveal>
          <Reveal i={1}><Title>The tasting room is the most underutilized asset</Title></Reveal>
          <Reveal i={2}><Lead>It drives the majority of customer relationships — yet most visits never become long-term revenue.</Lead></Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-vintiga-lg">
          {[
            ['55%', 'of all DTC transactions happen in the tasting room'],
            ['47%', 'of all new customer records are created in tasting rooms'],
            ['39%', 'of DTC revenue comes from wine clubs'],
            ['72%', 'of guests leave without a digital profile or contact info'],
          ].map(([v, l], k) => (
            <Reveal key={l} i={3 + k}><Stat value={v} label={l} /></Reveal>
          ))}
        </div>
        <Reveal i={7} className="max-w-3xl rounded-vintiga-2xl bg-vintiga-indigo-50 border border-vintiga-indigo-100 p-vintiga-lg">
          <p className="typo-body-sm md:text-base text-vintiga-slate-900"><span className="font-semibold text-vintiga-indigo-600">The core problem — </span>wineries lack tools to identify and nurture guests, and data stays fragmented across POS, clubs, and reservations.</p>
        </Reveal>
        <Reveal i={8}><p className="typo-caption text-vintiga-slate-400">Source: Silicon Valley Bank, 2026 State of the Wine Industry Survey</p></Reveal>
      </div>
    ),
  },

  // 5 — The Wedge
  {
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
        <Reveal i={1} className="h-[38vh] lg:h-[62vh] max-h-[560px] order-first lg:order-first">
          <Frame src={img('mockups/iphone-guest-profile-wine.jpg')} alt="Hands holding an iPhone showing a Vintiga guest profile at a wine-bar table" className="h-full" />
        </Reveal>
        <div className="flex flex-col gap-vintiga-md lg:gap-vintiga-lg">
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
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
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
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
        <div className="flex flex-col gap-vintiga-md lg:gap-vintiga-lg">
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
        <Reveal i={2} className="h-[38vh] lg:h-[62vh] max-h-[560px] order-first lg:order-last">
          <Frame src={img('mockups/dashboard-desk-window.jpg')} alt="Angled desktop monitor with the Vintiga dashboard on a wooden desk by a window" className="h-full" />
        </Reveal>
      </div>
    ),
  },

  // 8 — Why wineries buy (cost table)
  {
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
        <div className="flex flex-col gap-vintiga-lg justify-center">
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
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
        <Reveal><Kicker>Early Validation &amp; Differentiators</Kicker></Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1fr_1fr] gap-vintiga-xl lg:gap-vintiga-2xl">
          <Reveal i={1} className="hidden lg:block">
            <Frame src={img('mockups/dashboard-screen-closeup.jpg')} alt="Close-up of an angled monitor showing the Vintiga dashboard" className="h-full" />
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
    render: () => {
      const streams = [
        { icon: <ChartIcon key="c" />, n: '1', title: 'Software Subscription', sub: 'Recurring SaaS revenue', stat: '$3.5K–$12K', statLabel: 'Annual subscription revenue', points: ['Predictable recurring revenue', 'High gross margins', 'Strong retention'] },
        { icon: <CreditCardIcon key="p" />, n: '2', title: 'Payments Revenue', sub: 'Variable revenue tied to growth', stat: '0.5%–0.75%', statLabel: 'of GMV', points: ['Scales with winery growth', 'High retention', 'Low-churn revenue stream'] },
        { icon: <TrendingUpIcon key="e" />, n: '3', title: 'Expansion Products', sub: 'High-margin add-on solutions', list: ['AI Guest Intelligence', 'Marketing Automation', 'SMS & Messaging', 'Premium Websites', 'API & MCP Access', 'AI Revenue Optimization'], note: 'Expand wallet share over time' },
      ]
      const tiers = [
        ['Small Winery', '~$500K DTC sales', '~$9K'],
        ['Growing Winery', '~$1M DTC sales', '~$15K'],
        ['Enterprise Winery', '~$4M+ DTC sales', '~$37K+'],
      ]
      return (
        <div className="flex flex-col justify-center gap-vintiga-md">
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
        </div>
      )
    },
  },

  // 11 — Target market
  {
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>The Target Market</Kicker></Reveal>
          <Reveal i={1}><Title>15,000+ wineries</Title></Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-vintiga-lg">
          {[
            [<GlobeIcon key="g" />, '15,000+', 'wineries across North America, AUS & NZ'],
            [<UsersIcon key="u" />, '35–40M', 'winery visits annually'],
            [<DollarIcon key="d" />, '$1M', 'avg. ICP DTC sales per year'],
            [<TargetIcon key="t" />, '$15B', 'annual GMV opportunity'],
          ].map(([icon, v, l], k) => (
            <Reveal key={l as string} i={2 + k} className="flex flex-col gap-vintiga-sm">
              <IconChip icon={icon} />
              <span className="font-vintiga-display font-light text-4xl lg:text-6xl text-vintiga-indigo-600 leading-none">{v}</span>
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
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>The Team</Kicker></Reveal>
          <Reveal i={1}><Title>Built by the people who built modern wine commerce</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
          {[
            { ini: 'JS', photo: img('team/jim-secord.jpg'),  name: 'Jim Secord',   role: 'Founder', bio: 'Three-time founder and 25-year product veteran; previously led product at WineDirect, modernizing winery DTC. Founded Vintiga to turn tasting-room visitors into lifelong customers.' },
            { ini: 'DA', photo: img('team/donna-ataman.jpg'), name: 'Donna Ataman', role: 'Product & Customer Lead', bio: 'Product leader formerly of WineDirect and Intuit (QuickBooks Online), with deep winery-operations experience across clubs, compliance, fulfillment and tasting-room workflows.' },
            { ini: 'GS', photo: img('team/geoff-spears.jpg'), name: 'Geoff Spears', role: 'Engineering Lead', bio: 'Award-winning software architect; engineered an offline-first, iPhone-based commerce platform that replaces costly hardware with a reliable, high-performance system.' },
          ].map((m, k) => (
            <Reveal key={m.name} i={2 + k} className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-lg">
              <PersonAvatar src={m.photo} initials={m.ini} />
              <div>
                <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{m.name}</p>
                <p className="typo-body-sm text-vintiga-indigo-600 font-medium">{m.role}</p>
              </div>
              <p className="typo-body-sm text-vintiga-slate-500 leading-relaxed">{m.bio}</p>
            </Reveal>
          ))}
        </div>
      </div>
    ),
  },

  // 13 — Go-to-market
  {
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
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
        <div className="flex flex-col gap-vintiga-lg justify-center">
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
    render: () => (
      <div className="flex flex-col gap-vintiga-xl lg:gap-vintiga-2xl justify-center">
        <div className="flex flex-col gap-vintiga-md max-w-4xl">
          <Reveal><Kicker>Funding</Kicker></Reveal>
          <Reveal i={1}>
            <div className="flex items-baseline gap-vintiga-lg flex-wrap">
              <span className="font-vintiga-display font-light text-vintiga-indigo-600 text-6xl lg:text-8xl leading-none">$500K</span>
              <span className="typo-body md:text-lg text-vintiga-slate-500">SAFE financing · $200K committed · $300K remaining</span>
            </div>
          </Reveal>
          <Reveal i={2}><Lead>To reach 70 wineries, $60K+ MRR, and positive cash flow.</Lead></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-vintiga-xl lg:gap-vintiga-2xl">
          <Reveal i={3} className="flex flex-col gap-vintiga-md">
            <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-600">Use of funds</p>
            <ul className="flex flex-col gap-vintiga-md">
              {['Go-to-market with West Coast wineries', 'Build a repeatable sales process', 'Keep investing in Guest Intelligence & AI'].map((t) => <Check key={t}>{t}</Check>)}
            </ul>
          </Reveal>
          <Reveal i={4} className="flex flex-col gap-vintiga-md">
            <p className="typo-caption font-semibold uppercase tracking-wider text-vintiga-indigo-600">Expected outcomes</p>
            <ul className="flex flex-col gap-vintiga-md">
              {['70 active wineries', '$60K+ monthly recurring revenue', 'Positive cash flow', 'Payments embedded across the customer base'].map((t) => <Check key={t}>{t}</Check>)}
            </ul>
          </Reveal>
        </div>
      </div>
    ),
  },

  // 16 — Funding: investor returns
  {
    render: () => (
      <div className="flex flex-col gap-vintiga-xl justify-center">
        <div className="flex flex-col gap-vintiga-sm max-w-4xl">
          <Reveal><Kicker>Funding</Kicker></Reveal>
          <Reveal i={1}><Title>Investor returns &amp; alignment</Title></Reveal>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-vintiga-xl lg:gap-vintiga-2xl">
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
    render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-vintiga-xl lg:gap-vintiga-2xl items-center">
        <div className="flex flex-col gap-vintiga-lg order-2 lg:order-1">
          <Reveal i={1}><Title className="!text-4xl sm:!text-5xl lg:!text-6xl">Powering the world's most remarkable wineries</Title></Reveal>
          <Reveal i={2}><p className="text-xl sm:text-2xl lg:text-3xl font-vintiga-display font-light text-vintiga-indigo-600">More visitors. More members. More revenue.</p></Reveal>
          <Reveal i={3} className="mt-vintiga-md">
            <div className="flex items-center gap-vintiga-md typo-body-sm text-vintiga-slate-500 flex-wrap">
              <span className="font-semibold text-vintiga-slate-900">Jim Secord</span>
              <span className="text-vintiga-slate-300">·</span>
              <span>Founder</span>
              <span className="inline-flex items-center gap-1.5"><MailIcon className="w-4 h-4" /> jim@vintigalabs.com</span>
              <span className="text-vintiga-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5"><GlobeIcon className="w-4 h-4" /> VintigaLabs.com</span>
            </div>
          </Reveal>
        </div>
        <Reveal i={2} className="h-[38vh] lg:h-[62vh] max-h-[560px] order-1 lg:order-2">
          <Frame src={img('locations/garden-path.jpg')} alt="Golden-hour garden path at a wine estate" className="h-full" />
        </Reveal>
      </div>
    ),
  },
]

// ─── Deck shell ───────────────────────────────────────────────────────────────

function exitToHub() {
  localStorage.setItem('vintiga-hub-segment', 'Presentations')
  window.location.hash = '#/'
}

export function VintigaOverviewSlidesScreen() {
  const [index, setIndex] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[index]
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

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

  const ctrl = 'inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors text-vintiga-slate-500 hover:text-vintiga-slate-900 hover:bg-vintiga-slate-100'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-vintiga-body bg-vintiga-white">
      <style>{`
        @keyframes compIn { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes deckIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Slide stage — only the active slide is mounted, so it re-enters (and
          re-runs its animations) on change. */}
      <div
        key={index}
        className="absolute inset-0 overflow-y-auto animate-[deckIn_360ms_cubic-bezier(0.16,1,0.3,1)]"
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY }}
        onTouchEnd={(e) => {
          if (startX.current === null || startY.current === null) return
          const dx = e.changedTouches[0].clientX - startX.current
          const dy = e.changedTouches[0].clientY - startY.current
          // Only treat as a slide swipe when it's clearly horizontal — leave
          // vertical gestures to scroll the (occasionally tall) mobile slide.
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) next()
            else prev()
          }
          startX.current = null
          startY.current = null
        }}
      >
        <div className="relative min-h-full w-full max-w-[1400px] mx-auto px-6 sm:px-14 lg:px-20 pt-20 pb-24 lg:pt-16 lg:pb-20 flex flex-col justify-start lg:justify-center">
          {slide.render()}
        </div>
      </div>

      {/* Top chrome — wordmark + exit */}
      <div className="absolute top-0 inset-x-0 h-16 px-6 sm:px-14 lg:px-20 flex items-center justify-between pointer-events-none">
        <VintigaIconBlack size={30} className="pointer-events-auto rounded-[9px]" aria-label="Vintiga" />
        <span className="sr-only">Vintiga</span>
        <button type="button" onClick={exitToHub} aria-label="Exit presentation" className={`${ctrl} pointer-events-auto`}>
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom chrome — prev · counter · next + progress */}
      <div className="absolute bottom-0 inset-x-0">
        <div className="h-14 px-6 sm:px-14 lg:px-20 flex items-center justify-center gap-vintiga-md">
          <button type="button" onClick={prev} disabled={index === 0} aria-label="Previous slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="typo-body-sm tabular-nums min-w-[3.5rem] text-center text-vintiga-slate-400">
            {index + 1} / {total}
          </span>
          <button type="button" onClick={next} disabled={index === total - 1} aria-label="Next slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="h-1 w-full bg-vintiga-slate-100">
          <div className="h-full bg-vintiga-indigo-500 transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
