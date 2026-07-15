// Presentations → "Why Vintiga Now" — a deck BUILT FROM the Deck Builder's
// generated prompt, to prove the builder → prompt → real deck flow end-to-end.
// Same conventions as the Vintiga Overview deck: Vintiga tokens + Inter, snappy
// fade-rise transitions, keyboard + on-screen nav. Deck chrome = the vertical
// Vintiga logo lockup + page number (top-left on the top-header intro, down a
// vertical left rail with a divider on content slides).

import { useEffect, useState, type ReactNode } from 'react'
import {
  ChevronLeftIcon, ChevronRightIcon, XIcon,
  SparklesIcon, TrendingUpIcon, UsersIcon,
} from '@ds/icons/Icons'
import { VintigaIconNeutral } from '@ds/shared/VintigaLogo'
import { BlockGlassRevenue, BlockAvatarsPill } from './blocks/blocks'

const img = (p: string) => `/brand/imagery/${p}`

function exitToHub() {
  localStorage.setItem('vintiga-hub-segment', 'Presentations')
  window.location.hash = '#/'
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <div className={`animate-[fadeUp_0.5s_ease-out_both] ${className}`} style={{ animationDelay: `${i * 70}ms` }}>
      {children}
    </div>
  )
}

// The provided vertical logo lockup (Logo.svg) — icon + "Vintiga Labs" wordmark.
function VintigaLockup({ invert = false, className = '' }: { invert?: boolean; className?: string }) {
  const dark = invert ? '#FFFFFF' : '#0A0A0A'
  const light = invert ? '#0A0A0A' : '#FFFFFF'
  return (
    <svg viewBox="0 0 40 143" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-auto ${className}`}>
      <rect x="6.25073e-06" y="143" width="40" height="40" rx="10" transform="rotate(-90 6.25073e-06 143)" fill={dark} />
      <path d="M21.25 123C16.4175 123 12.5 126.918 12.5 131.75L12.5 133L18.75 133C23.5825 133 27.5 129.082 27.5 124.25L27.5 123L21.25 123Z" fill={light} />
      <path d="M21.25 123C16.4175 123 12.5 119.082 12.5 114.25L12.5 113L18.75 113C23.5825 113 27.5 116.918 27.5 121.75L27.5 123L21.25 123Z" fill={light} />
      <path d="M14.3636 92.7045L23.8409 89.4659L23.8409 89.3352L14.3636 86.0966L14.3636 84.1989L26 88.3864L26 90.4148L14.3636 94.6023L14.3636 92.7045ZM26 82.6548L17.2727 82.6548L17.2727 80.956L26 80.956L26 82.6548ZM15.9261 81.7969C15.9261 82.0923 15.8277 82.3461 15.6307 82.5582C15.4299 82.7666 15.1913 82.8707 14.9148 82.8707C14.6345 82.8707 14.3958 82.7666 14.1989 82.5582C13.9981 82.3461 13.8977 82.0923 13.8977 81.7969C13.8977 81.5014 13.9981 81.2495 14.1989 81.0412C14.3958 80.8291 14.6345 80.723 14.9148 80.723C15.1913 80.723 15.4299 80.8291 15.6307 81.0412C15.8277 81.2495 15.9261 81.5014 15.9261 81.7969ZM20.8182 76.9716L26 76.9716L26 78.6705L17.2727 78.6705L17.2727 77.0398L18.6932 77.0398L18.6932 76.9318C18.2311 76.7311 17.8599 76.4167 17.5796 75.9886C17.2992 75.5568 17.1591 75.0133 17.1591 74.358C17.1591 73.7633 17.2841 73.2424 17.5341 72.7955C17.7803 72.3485 18.1477 72.0019 18.6364 71.7557C19.125 71.5095 19.7292 71.3864 20.4489 71.3864L26 71.3864L26 73.0852L20.6534 73.0852C20.0208 73.0852 19.5265 73.25 19.1705 73.5795C18.8106 73.9091 18.6307 74.3617 18.6307 74.9375C18.6307 75.3314 18.7159 75.6818 18.8864 75.9886C19.0568 76.2917 19.3068 76.5322 19.6364 76.7102C19.9621 76.8845 20.3561 76.9716 20.8182 76.9716ZM17.2727 65.0341L18.6364 65.0341L18.6364 69.8011L17.2727 69.8011L17.2727 65.0341ZM15.1818 68.5227L15.1818 66.8239L23.4375 66.8239C23.7671 66.8239 24.0152 66.7746 24.1818 66.6761C24.3447 66.5777 24.4564 66.4508 24.5171 66.2955C24.5739 66.1364 24.6023 65.964 24.6023 65.7784C24.6023 65.642 24.5928 65.5227 24.5739 65.4205C24.5549 65.3182 24.5398 65.2386 24.5284 65.1818L25.9318 64.875C25.9697 64.9735 26.0076 65.1136 26.0455 65.2955C26.0871 65.4773 26.1099 65.7045 26.1136 65.9773C26.1212 66.4242 26.0417 66.8409 25.875 67.2273C25.7083 67.6136 25.4508 67.9261 25.1023 68.1648C24.7538 68.4034 24.3163 68.5227 23.7898 68.5227L15.1818 68.5227ZM26 63.1548L17.2727 63.1548L17.2727 61.456L26 61.456L26 63.1548ZM15.9261 62.2969C15.9261 62.5923 15.8277 62.8461 15.6307 63.0582C15.4299 63.2666 15.1913 63.3707 14.9148 63.3707C14.6345 63.3707 14.3958 63.2666 14.1989 63.0582C13.9981 62.8461 13.8977 62.5923 13.8977 62.2969C13.8977 62.0014 13.9981 61.7495 14.1989 61.5412C14.3958 61.3291 14.6345 61.223 14.9148 61.223C15.1913 61.223 15.4299 61.3291 15.6307 61.5412C15.8277 61.7495 15.9261 62.0014 15.9261 62.2969ZM29.4546 55.5114C29.4546 56.2045 29.3636 56.8011 29.1818 57.3011C29 57.7973 28.7595 58.2027 28.4602 58.517C28.161 58.8314 27.8333 59.0663 27.4773 59.2216L26.875 57.7614C27.0417 57.6591 27.2178 57.5227 27.4034 57.3523C27.5928 57.178 27.7538 56.9432 27.8864 56.6477C28.0189 56.3485 28.0852 55.964 28.0852 55.4943C28.0852 54.8504 27.928 54.3182 27.6136 53.8977C27.303 53.4773 26.8068 53.267 26.125 53.267L24.4091 53.267L24.4091 53.375C24.5947 53.4773 24.8011 53.625 25.0284 53.8182C25.2557 54.0076 25.4527 54.2689 25.6193 54.6023C25.786 54.9356 25.8693 55.3693 25.8693 55.9034C25.8693 56.5928 25.7083 57.214 25.3864 57.767C25.0606 58.3163 24.5814 58.7519 23.9489 59.0739C23.3125 59.392 22.5303 59.5511 21.6023 59.5511C20.6742 59.5511 19.8788 59.3939 19.2159 59.0795C18.553 58.7614 18.0455 58.3258 17.6932 57.7727C17.3371 57.2197 17.1591 56.5928 17.1591 55.892C17.1591 55.3504 17.25 54.9129 17.4318 54.5795C17.6099 54.2462 17.8182 53.9867 18.0568 53.8011C18.2955 53.6117 18.5057 53.4659 18.6875 53.3636L18.6875 53.2386L17.2727 53.2386L17.2727 51.5739L26.1932 51.5739C26.9432 51.5739 27.5587 51.7481 28.0398 52.0966C28.5208 52.4451 28.8769 52.9167 29.108 53.5114C29.339 54.1023 29.4545 54.7689 29.4546 55.5114ZM24.4602 55.5284C24.4602 55.0398 24.3466 54.6269 24.1193 54.2898C23.8883 53.9489 23.5587 53.6913 23.1307 53.517C22.6989 53.339 22.1818 53.25 21.5795 53.25C20.9924 53.25 20.4754 53.3371 20.0284 53.5114C19.5814 53.6856 19.233 53.9413 18.983 54.2784C18.7292 54.6155 18.6023 55.0322 18.6023 55.5284C18.6023 56.0398 18.7349 56.4659 19 56.8068C19.2614 57.1477 19.6174 57.4053 20.0682 57.5795C20.5189 57.75 21.0227 57.8352 21.5796 57.8352C22.1515 57.8352 22.6534 57.7481 23.0852 57.5739C23.5171 57.3996 23.8542 57.142 24.0966 56.8011C24.339 56.4564 24.4602 56.0322 24.4602 55.5284ZM26.1932 46.7557C26.1932 47.3087 26.0909 47.8087 25.8864 48.2557C25.678 48.7027 25.3769 49.0568 24.983 49.3182C24.589 49.5758 24.1061 49.7045 23.5341 49.7045C23.0417 49.7045 22.6364 49.6098 22.3182 49.4205C22 49.2311 21.7481 48.9754 21.5625 48.6534C21.3769 48.3314 21.2367 47.9716 21.142 47.5739C21.0474 47.1761 20.9754 46.7708 20.9261 46.358C20.8655 45.8352 20.8163 45.411 20.7784 45.0852C20.7367 44.7595 20.6705 44.5227 20.5795 44.375C20.4886 44.2273 20.3409 44.1534 20.1364 44.1534L20.0966 44.1534C19.6004 44.1534 19.2159 44.2936 18.9432 44.5739C18.6705 44.8504 18.5341 45.2633 18.5341 45.8125C18.5341 46.3845 18.661 46.8352 18.9148 47.1648C19.1648 47.4905 19.4432 47.7159 19.75 47.8409L19.3864 49.4375C18.8561 49.2481 18.428 48.9716 18.1023 48.608C17.7727 48.2405 17.5341 47.8182 17.3864 47.3409C17.2349 46.8636 17.1591 46.3617 17.1591 45.8352C17.1591 45.4867 17.2008 45.1174 17.2841 44.7273C17.3636 44.3333 17.5114 43.9659 17.7273 43.625C17.9432 43.2803 18.2519 42.9981 18.6534 42.7784C19.0511 42.5587 19.5682 42.4489 20.2045 42.4489L26 42.4489L26 44.108L24.8068 44.108L24.8068 44.1761C25.0265 44.286 25.2424 44.4508 25.4545 44.6705C25.6667 44.8902 25.8428 45.1723 25.983 45.517C26.1231 45.8617 26.1932 46.2746 26.1932 46.7557ZM24.8295 46.3864C24.8295 45.9167 24.7367 45.5152 24.5511 45.1818C24.3655 44.8447 24.1231 44.589 23.8239 44.4148C23.5208 44.2367 23.197 44.1477 22.8523 44.1477L21.7273 44.1477C21.7879 44.2083 21.8447 44.3258 21.8977 44.5C21.947 44.6705 21.9905 44.8655 22.0284 45.0852C22.0625 45.3049 22.0947 45.5189 22.125 45.7273C22.1515 45.9356 22.1742 46.1098 22.1932 46.25C22.2349 46.5795 22.3049 46.8807 22.4034 47.1534C22.5019 47.4223 22.6439 47.6383 22.8295 47.8011C23.0114 47.9602 23.2538 48.0398 23.5568 48.0398C23.9773 48.0398 24.2955 47.8845 24.5114 47.5739C24.7235 47.2633 24.8295 46.8674 24.8295 46.3864ZM26 35.8153L14.3636 35.8153L14.3636 34.0597L24.4886 34.0597L24.4886 28.7869L26 28.7869L26 35.8153ZM26.1932 24.3807C26.1932 24.9337 26.0909 25.4337 25.8864 25.8807C25.678 26.3277 25.3769 26.6818 24.983 26.9432C24.589 27.2008 24.1061 27.3295 23.5341 27.3295C23.0417 27.3295 22.6364 27.2348 22.3182 27.0455C22 26.8561 21.7481 26.6004 21.5625 26.2784C21.3769 25.9564 21.2367 25.5966 21.142 25.1989C21.0474 24.8011 20.9754 24.3958 20.9261 23.983C20.8655 23.4602 20.8163 23.036 20.7784 22.7102C20.7367 22.3845 20.6705 22.1477 20.5795 22C20.4886 21.8523 20.3409 21.7784 20.1364 21.7784L20.0966 21.7784C19.6004 21.7784 19.2159 21.9186 18.9432 22.1989C18.6705 22.4754 18.5341 22.8883 18.5341 23.4375C18.5341 24.0095 18.661 24.4602 18.9148 24.7898C19.1648 25.1155 19.4432 25.3409 19.75 25.4659L19.3864 27.0625C18.8561 26.8731 18.428 26.5966 18.1023 26.233C17.7727 25.8655 17.5341 25.4432 17.3864 24.9659C17.2349 24.4886 17.1591 23.9867 17.1591 23.4602C17.1591 23.1117 17.2008 22.7424 17.2841 22.3523C17.3636 21.9583 17.5114 21.5909 17.7273 21.25C17.9432 20.9053 18.2519 20.6231 18.6534 20.4034C19.0511 20.1837 19.5682 20.0739 20.2045 20.0739L26 20.0739L26 21.733L24.8068 21.733L24.8068 21.8011C25.0265 21.911 25.2424 22.0758 25.4545 22.2955C25.6667 22.5152 25.8428 22.7973 25.983 23.142C26.1231 23.4867 26.1932 23.8996 26.1932 24.3807ZM24.8295 24.0114C24.8295 23.5417 24.7367 23.1402 24.5511 22.8068C24.3655 22.4697 24.1231 22.214 23.8239 22.0398C23.5208 21.8617 23.197 21.7727 22.8523 21.7727L21.7273 21.7727C21.7879 21.8333 21.8447 21.9508 21.8977 22.125C21.947 22.2955 21.9905 22.4905 22.0284 22.7102C22.0625 22.9299 22.0947 23.1439 22.125 23.3523C22.1515 23.5606 22.1742 23.7348 22.1932 23.875C22.2349 24.2045 22.3049 24.5057 22.4034 24.7784C22.5019 25.0473 22.6439 25.2633 22.8295 25.4261C23.0114 25.5852 23.2538 25.6648 23.5568 25.6648C23.9773 25.6648 24.2955 25.5095 24.5114 25.1989C24.7235 24.8883 24.8295 24.4924 24.8295 24.0114ZM26 17.6747L14.3636 17.6747L14.3636 15.9759L18.6875 15.9759L18.6875 15.8736C18.5057 15.7751 18.2955 15.6331 18.0568 15.4474C17.8182 15.2618 17.6099 15.0043 17.4318 14.6747C17.25 14.3452 17.1591 13.9096 17.1591 13.3679C17.1591 12.6634 17.3371 12.0346 17.6932 11.4815C18.0492 10.9285 18.5625 10.4948 19.233 10.1804C19.9034 9.86222 20.7102 9.70313 21.6534 9.70313C22.5966 9.70313 23.4053 9.86032 24.0795 10.1747C24.75 10.4891 25.267 10.9209 25.6307 11.4702C25.9905 12.0194 26.1705 12.6463 26.1705 13.3509C26.1705 13.8812 26.0814 14.3149 25.9034 14.652C25.7254 14.9853 25.517 15.2467 25.2784 15.4361C25.0398 15.6255 24.8277 15.7713 24.642 15.8736L24.642 16.0156L26 16.0156L26 17.6747ZM21.6364 16.0099C22.25 16.0099 22.7879 15.9209 23.25 15.7429C23.7121 15.5649 24.0739 15.3073 24.3352 14.9702C24.5928 14.6331 24.7216 14.2202 24.7216 13.7315C24.7216 13.224 24.5871 12.7997 24.3182 12.4588C24.0455 12.1179 23.6761 11.8603 23.2102 11.6861C22.7443 11.5081 22.2197 11.419 21.6364 11.419C21.0606 11.419 20.5436 11.5062 20.0852 11.6804C19.6269 11.8509 19.2652 12.1084 19 12.4531C18.7349 12.794 18.6023 13.2202 18.6023 13.7315C18.6023 14.224 18.7292 14.6406 18.983 14.9815C19.2367 15.3187 19.5909 15.5743 20.0455 15.7486C20.5 15.9228 21.0303 16.0099 21.6364 16.0099ZM19.4034 1.25568L19.6761 2.79546C19.4792 2.85985 19.2917 2.96212 19.1136 3.10227C18.9356 3.23864 18.7898 3.42424 18.6761 3.65909C18.5625 3.89394 18.5057 4.1875 18.5057 4.53977C18.5057 5.02083 18.6136 5.42235 18.8295 5.74432C19.0417 6.06629 19.3163 6.22727 19.6534 6.22727C19.9451 6.22727 20.1799 6.11932 20.358 5.90341C20.536 5.6875 20.6818 5.33902 20.7955 4.85796L21.1136 3.47159C21.2992 2.66856 21.5852 2.07008 21.9716 1.67614C22.358 1.2822 22.8599 1.08523 23.4773 1.08523C24 1.08523 24.4659 1.23674 24.875 1.53977C25.2803 1.83902 25.5985 2.25758 25.8295 2.79546C26.0606 3.32955 26.1761 3.94886 26.1761 4.65341C26.1761 5.63068 25.9678 6.42803 25.5511 7.04546C25.1307 7.66288 24.5341 8.04167 23.7614 8.18182L23.5114 6.53977C23.9394 6.4375 24.2633 6.22727 24.483 5.90909C24.6989 5.59091 24.8068 5.17614 24.8068 4.66477C24.8068 4.10796 24.6913 3.66288 24.4602 3.32955C24.2254 2.99621 23.9394 2.82955 23.6023 2.82955C23.3295 2.82955 23.1004 2.93182 22.9148 3.13636C22.7292 3.33712 22.589 3.64583 22.4943 4.0625L22.1705 5.53977C21.9849 6.35417 21.6894 6.95644 21.2841 7.34659C20.8788 7.73296 20.3655 7.92614 19.7443 7.92614C19.2292 7.92614 18.7784 7.7822 18.392 7.49432C18.0057 7.20644 17.7045 6.80871 17.4886 6.30114C17.2689 5.79356 17.1591 5.21212 17.1591 4.55682C17.1591 3.61364 17.3636 2.87121 17.7727 2.32955C18.178 1.78788 18.7216 1.42993 19.4034 1.25568Z" fill={dark} />
    </svg>
  )
}

// Vertical left rail — logo lockup (top) + page number (bottom), with a divider.
function Rail({ index, invert }: { index: number; invert: boolean }) {
  return (
    <div className={`absolute left-0 inset-y-0 w-20 lg:w-[104px] border-r ${invert ? 'border-white/15' : 'border-vintiga-slate-200'} flex flex-col items-center justify-between py-8 z-10`}>
      <Reveal><VintigaLockup invert={invert} className="h-24 lg:h-28" /></Reveal>
      <span className={`typo-body-sm tabular-nums ${invert ? 'text-white/50' : 'text-vintiga-slate-400'}`}>{String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}

// Eyebrow + title + optional subtitle — the shared content-slide header.
function Header({ eyebrow, title, subtitle, dark, center }: { eyebrow?: string; title: string; subtitle?: string; dark?: boolean; center?: boolean }) {
  return (
    <div className={`flex flex-col gap-vintiga-md ${center ? 'items-center text-center' : ''}`}>
      {eyebrow && <Reveal><span className="typo-caption font-semibold uppercase tracking-[0.16em] text-vintiga-indigo-600">{eyebrow}</span></Reveal>}
      <Reveal i={1}><h1 className={`font-vintiga-display font-light leading-[1.05] text-4xl md:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-vintiga-slate-900'}`}>{title}</h1></Reveal>
      {subtitle && <Reveal i={2}><p className={`typo-body md:text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-vintiga-slate-500'}`}>{subtitle}</p></Reveal>}
    </div>
  )
}

// The product composition — photo + glass revenue card + avatars pill.
function Composition({ photo }: { photo: string }) {
  return (
    <div className="relative w-full max-w-md aspect-[4/5]">
      <div className="absolute inset-0 rounded-vintiga-2xl overflow-hidden bg-vintiga-slate-100 shadow-[0_30px_60px_-24px_rgba(15,23,42,0.5)]">
        <img src={photo} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute left-[2%] top-[46%] w-[70%]"><BlockGlassRevenue rounded /></div>
      <div className="absolute right-[2%] bottom-[8%]"><BlockAvatarsPill /></div>
    </div>
  )
}

// ─── Slides ───────────────────────────────────────────────────────────────────

type Slide = { theme: 'dark' | 'light'; render: (index: number) => ReactNode }

const POINTS = [
  ['U.S. wine sales down ~20% from peak', 'A prolonged, industry-wide demand slowdown.'],
  ['Tasting-room visitation is falling', 'Wineries are cutting fees and adding promotions just to attract guests.'],
  ['Club growth & retention under pressure', 'Fewer visitors mean fewer chances to acquire loyal members.'],
]
const CARDS: [ReactNode, string, string][] = [
  [<SparklesIcon key="s" />, 'AI-powered hospitality', 'Guest intelligence once reserved for luxury brands, for every winery.'],
  [<TrendingUpIcon key="t" />, 'Personalization is essential', 'Slower demand makes conversion and retention mission-critical.'],
  [<UsersIcon key="u" />, 'Relationships beat volume', 'Won by better customer relationships, not more wine.'],
]

const SLIDES: Slide[] = [
  // 1 — Intro · header across the top · image bg, no media, full-width headline
  {
    theme: 'dark',
    render: () => (
      <>
        <div className="absolute inset-0 -z-10">
          <img src={img('locations/estate-terrace.jpg')} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="absolute inset-0 px-10 sm:px-16 lg:px-24 py-16 flex flex-col justify-between">
          <div aria-hidden />
          <div className="flex flex-col gap-vintiga-lg max-w-5xl">
            <Reveal i={1}><span className="typo-caption font-semibold uppercase tracking-[0.16em] text-vintiga-indigo-200">Guest Intelligence</span></Reveal>
            <Reveal i={2}><h1 className="font-vintiga-display font-light leading-[1.04] text-5xl md:text-6xl lg:text-7xl text-white">Powering the world's most remarkable wineries</h1></Reveal>
            <Reveal i={3}><p className="text-xl lg:text-2xl font-vintiga-display font-light text-vintiga-indigo-200">More visitors. More members. More revenue.</p></Reveal>
          </div>
          <Reveal i={4}>
            <p className="typo-body-sm text-white/70">Jim Secord, Founder, VintigaLabs.com, jim@vintigalabs.com</p>
          </Reveal>
        </div>
      </>
    ),
  },

  // 2 — Title + points, image right
  {
    theme: 'light',
    render: (index) => (
      <>
        <Rail index={index} invert={false} />
        <div className="absolute inset-0 pl-20 lg:pl-[104px]">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-vintiga-2xl items-center px-10 sm:px-16 py-16">
            <div className="flex flex-col gap-vintiga-lg">
              <Header eyebrow="The Problem" title="The winery growth crisis" subtitle="Wineries are facing unprecedented headwinds." />
              <ul className="flex flex-col gap-vintiga-lg mt-vintiga-sm">
                {POINTS.map(([p, d], k) => (
                  <Reveal key={p} i={3 + k}>
                    <li className="flex flex-col gap-1">
                      <span className="typo-body md:text-lg font-semibold text-vintiga-slate-900">{p}</span>
                      <span className="typo-body-sm text-vintiga-slate-500">{d}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal i={2} className="hidden lg:block">
              <div className="w-full aspect-[4/5] max-h-[70vh] rounded-vintiga-2xl overflow-hidden bg-vintiga-slate-100 shadow-[0_30px_60px_-24px_rgba(15,23,42,0.4)]">
                <img src={img('locations/wine-barrels.jpg')} alt="Oak wine barrels in warm evening light" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </>
    ),
  },

  // 3 — Title + 3 cards
  {
    theme: 'light',
    render: (index) => (
      <>
        <Rail index={index} invert={false} />
        <div className="absolute inset-0 pl-20 lg:pl-[104px]">
          <div className="h-full flex flex-col justify-center gap-vintiga-2xl px-10 sm:px-16 py-16">
            <Header eyebrow="The Problem" title="The winery growth crisis" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-vintiga-lg">
              {CARDS.map(([icon, title, body], k) => (
                <Reveal key={title} i={2 + k}>
                  <div className="flex flex-col gap-vintiga-md rounded-vintiga-2xl border border-vintiga-slate-200 bg-vintiga-white p-vintiga-xl h-full">
                    <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-vintiga-indigo-50 text-vintiga-indigo-600 [&>svg]:w-6 [&>svg]:h-6">{icon}</span>
                    <p className="typo-title-subsection font-semibold text-vintiga-slate-900">{title}</p>
                    <p className="typo-body-sm text-vintiga-slate-500 leading-relaxed">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 4 — Text + media (product composition)
  {
    theme: 'light',
    render: (index) => (
      <>
        <Rail index={index} invert={false} />
        <div className="absolute inset-0 pl-20 lg:pl-[104px]">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-vintiga-2xl items-center px-10 sm:px-16 py-16">
            <Header eyebrow="The Problem" title="The winery growth crisis" subtitle="Wineries are facing unprecedented headwinds." />
            <Reveal i={2} className="hidden lg:flex justify-center">
              <Composition photo={img('locations/wine-barrels.jpg')} />
            </Reveal>
          </div>
        </div>
      </>
    ),
  },

  // 5 — Centered text
  {
    theme: 'light',
    render: (index) => (
      <>
        <Rail index={index} invert={false} />
        <div className="absolute inset-0 pl-20 lg:pl-[104px]">
          <div className="h-full flex flex-col justify-center items-center px-10 sm:px-16 py-16">
            <div className="max-w-3xl">
              <Header eyebrow="The Problem" title="The winery growth crisis" subtitle="Wineries are facing unprecedented headwinds." center />
            </div>
          </div>
        </div>
      </>
    ),
  },

  // 6 — Closing
  {
    theme: 'dark',
    render: () => (
      <div className="absolute inset-0 bg-[#0a0a12] flex flex-col items-center justify-center gap-vintiga-lg text-center px-10">
        <Reveal><VintigaIconNeutral size={56} className="rounded-[14px]" /></Reveal>
        <Reveal i={1}><h1 className="font-vintiga-display font-light leading-[1.05] text-5xl md:text-6xl text-white">That's Vintiga.</h1></Reveal>
        <Reveal i={2}><p className="typo-body md:text-lg text-white/70 max-w-xl">The winery business has changed — win the next decade with better guest relationships, not more wine.</p></Reveal>
      </div>
    ),
  },
]

// ─── Screen ───────────────────────────────────────────────────────────────────

export function WhyVintigaNowScreen() {
  const [index, setIndex] = useState(0)
  const total = SLIDES.length
  const slide = SLIDES[index]
  const dark = slide.theme === 'dark'

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
    <div className={`fixed inset-0 z-50 overflow-hidden font-vintiga-body ${dark ? 'bg-[#0a0a12]' : 'bg-vintiga-white'}`}>
      <style>{`@keyframes deckIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div key={index} className="absolute inset-0 animate-[deckIn_360ms_cubic-bezier(0.16,1,0.3,1)]">
        {slide.render(index)}
      </div>

      {/* Intro (top-header) shows the icon mark top-left; content slides use the rail. */}
      {index === 0 && (
        <div className="absolute top-8 left-10 sm:left-16 lg:left-24 z-10">
          <VintigaIconNeutral size={40} className="rounded-[10px]" />
        </div>
      )}

      {/* Exit */}
      <button type="button" onClick={exitToHub} aria-label="Exit presentation" className={`absolute top-6 right-6 z-20 ${ctrl}`}>
        <XIcon className="w-5 h-5" />
      </button>

      {/* Bottom chrome — prev · counter · next + progress */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="h-14 flex items-center justify-center gap-vintiga-md">
          <button type="button" onClick={prev} disabled={index === 0} aria-label="Previous slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className={`typo-body-sm tabular-nums min-w-[3.5rem] text-center ${dark ? 'text-white/60' : 'text-vintiga-slate-400'}`}>{index + 1} / {total}</span>
          <button type="button" onClick={next} disabled={index === total - 1} aria-label="Next slide" className={`${ctrl} disabled:opacity-30 disabled:pointer-events-none`}>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
        <div className={`h-1 w-full ${dark ? 'bg-white/10' : 'bg-vintiga-slate-100'}`}>
          <div className="h-full bg-vintiga-indigo-500 transition-[width] duration-300 ease-out" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
