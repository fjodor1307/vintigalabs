import { SectionHeader } from './SectionHeader'

interface Swatch { shade: string; hex: string; bgClass: string; dark?: boolean }
interface HueFamily { name: string; swatches: Swatch[] }

/* Primitive palettes — mirror tokens.css exactly. Regenerated from Figma variables. */
const PALETTES: HueFamily[] = [
  {
    name: 'Slate',
    swatches: [
      { shade: '50', hex: '#F8FAFC', bgClass: 'bg-vintiga-slate-50' },
      { shade: '100', hex: '#F1F5F9', bgClass: 'bg-vintiga-slate-100' },
      { shade: '200', hex: '#E2E8F0', bgClass: 'bg-vintiga-slate-200' },
      { shade: '300', hex: '#CBD5E1', bgClass: 'bg-vintiga-slate-300' },
      { shade: '400', hex: '#94A3B8', bgClass: 'bg-vintiga-slate-400' },
      { shade: '500', hex: '#64748B', bgClass: 'bg-vintiga-slate-500', dark: true },
      { shade: '600', hex: '#475569', bgClass: 'bg-vintiga-slate-600', dark: true },
      { shade: '700', hex: '#334155', bgClass: 'bg-vintiga-slate-700', dark: true },
      { shade: '800', hex: '#1E293B', bgClass: 'bg-vintiga-slate-800', dark: true },
      { shade: '900', hex: '#0F172A', bgClass: 'bg-vintiga-slate-900', dark: true },
      { shade: '950', hex: '#020617', bgClass: 'bg-vintiga-slate-950', dark: true },
    ],
  },
  {
    name: 'Gray',
    swatches: [
      { shade: '50', hex: '#F9FAFB', bgClass: 'bg-vintiga-gray-50' },
      { shade: '100', hex: '#F3F4F6', bgClass: 'bg-vintiga-gray-100' },
      { shade: '200', hex: '#E5E7EB', bgClass: 'bg-vintiga-gray-200' },
      { shade: '300', hex: '#D1D5DB', bgClass: 'bg-vintiga-gray-300' },
      { shade: '400', hex: '#9CA3AF', bgClass: 'bg-vintiga-gray-400' },
      { shade: '500', hex: '#6B7280', bgClass: 'bg-vintiga-gray-500', dark: true },
      { shade: '600', hex: '#4B5563', bgClass: 'bg-vintiga-gray-600', dark: true },
      { shade: '700', hex: '#374151', bgClass: 'bg-vintiga-gray-700', dark: true },
      { shade: '800', hex: '#1F2937', bgClass: 'bg-vintiga-gray-800', dark: true },
      { shade: '900', hex: '#111827', bgClass: 'bg-vintiga-gray-900', dark: true },
      { shade: '950', hex: '#030712', bgClass: 'bg-vintiga-gray-950', dark: true },
    ],
  },
  {
    name: 'Zinc',
    swatches: [
      { shade: '50', hex: '#FAFAFA', bgClass: 'bg-vintiga-zinc-50' },
      { shade: '100', hex: '#F4F4F5', bgClass: 'bg-vintiga-zinc-100' },
      { shade: '200', hex: '#E4E4E7', bgClass: 'bg-vintiga-zinc-200' },
      { shade: '300', hex: '#D4D4D8', bgClass: 'bg-vintiga-zinc-300' },
      { shade: '400', hex: '#A1A1AA', bgClass: 'bg-vintiga-zinc-400' },
      { shade: '500', hex: '#71717A', bgClass: 'bg-vintiga-zinc-500', dark: true },
      { shade: '600', hex: '#52525B', bgClass: 'bg-vintiga-zinc-600', dark: true },
      { shade: '700', hex: '#3F3F46', bgClass: 'bg-vintiga-zinc-700', dark: true },
      { shade: '800', hex: '#27272A', bgClass: 'bg-vintiga-zinc-800', dark: true },
      { shade: '900', hex: '#18181B', bgClass: 'bg-vintiga-zinc-900', dark: true },
      { shade: '950', hex: '#09090B', bgClass: 'bg-vintiga-zinc-950', dark: true },
    ],
  },
  {
    name: 'Neutral',
    swatches: [
      { shade: '50', hex: '#FAFAFA', bgClass: 'bg-vintiga-neutral-50' },
      { shade: '100', hex: '#F5F5F5', bgClass: 'bg-vintiga-neutral-100' },
      { shade: '200', hex: '#E5E5E5', bgClass: 'bg-vintiga-neutral-200' },
      { shade: '300', hex: '#D4D4D4', bgClass: 'bg-vintiga-neutral-300' },
      { shade: '400', hex: '#A3A3A3', bgClass: 'bg-vintiga-neutral-400' },
      { shade: '500', hex: '#737373', bgClass: 'bg-vintiga-neutral-500', dark: true },
      { shade: '600', hex: '#525252', bgClass: 'bg-vintiga-neutral-600', dark: true },
      { shade: '700', hex: '#404040', bgClass: 'bg-vintiga-neutral-700', dark: true },
      { shade: '800', hex: '#262626', bgClass: 'bg-vintiga-neutral-800', dark: true },
      { shade: '900', hex: '#171717', bgClass: 'bg-vintiga-neutral-900', dark: true },
      { shade: '950', hex: '#0A0A0A', bgClass: 'bg-vintiga-neutral-950', dark: true },
    ],
  },
  {
    name: 'Stone',
    swatches: [
      { shade: '50', hex: '#FAFAF9', bgClass: 'bg-vintiga-stone-50' },
      { shade: '100', hex: '#F5F5F4', bgClass: 'bg-vintiga-stone-100' },
      { shade: '200', hex: '#E7E5E4', bgClass: 'bg-vintiga-stone-200' },
      { shade: '300', hex: '#D6D3D1', bgClass: 'bg-vintiga-stone-300' },
      { shade: '400', hex: '#A8A29E', bgClass: 'bg-vintiga-stone-400' },
      { shade: '500', hex: '#78716C', bgClass: 'bg-vintiga-stone-500', dark: true },
      { shade: '600', hex: '#57534E', bgClass: 'bg-vintiga-stone-600', dark: true },
      { shade: '700', hex: '#44403C', bgClass: 'bg-vintiga-stone-700', dark: true },
      { shade: '800', hex: '#292524', bgClass: 'bg-vintiga-stone-800', dark: true },
      { shade: '900', hex: '#1C1917', bgClass: 'bg-vintiga-stone-900', dark: true },
      { shade: '950', hex: '#0C0A09', bgClass: 'bg-vintiga-stone-950', dark: true },
    ],
  },
  {
    name: 'Red',
    swatches: [
      { shade: '50', hex: '#FEF2F2', bgClass: 'bg-vintiga-red-50' },
      { shade: '100', hex: '#FEE2E2', bgClass: 'bg-vintiga-red-100' },
      { shade: '200', hex: '#FECACA', bgClass: 'bg-vintiga-red-200' },
      { shade: '300', hex: '#FCA5A5', bgClass: 'bg-vintiga-red-300' },
      { shade: '400', hex: '#F87171', bgClass: 'bg-vintiga-red-400' },
      { shade: '500', hex: '#EF4444', bgClass: 'bg-vintiga-red-500', dark: true },
      { shade: '600', hex: '#DC2626', bgClass: 'bg-vintiga-red-600', dark: true },
      { shade: '700', hex: '#B91C1C', bgClass: 'bg-vintiga-red-700', dark: true },
      { shade: '800', hex: '#991B1B', bgClass: 'bg-vintiga-red-800', dark: true },
      { shade: '900', hex: '#7F1D1D', bgClass: 'bg-vintiga-red-900', dark: true },
      { shade: '950', hex: '#450A0A', bgClass: 'bg-vintiga-red-950', dark: true },
    ],
  },
  {
    name: 'Orange',
    swatches: [
      { shade: '50', hex: '#FFF7ED', bgClass: 'bg-vintiga-orange-50' },
      { shade: '100', hex: '#FFEDD5', bgClass: 'bg-vintiga-orange-100' },
      { shade: '200', hex: '#FED7AA', bgClass: 'bg-vintiga-orange-200' },
      { shade: '300', hex: '#FDBA74', bgClass: 'bg-vintiga-orange-300' },
      { shade: '400', hex: '#FB923C', bgClass: 'bg-vintiga-orange-400' },
      { shade: '500', hex: '#F97316', bgClass: 'bg-vintiga-orange-500', dark: true },
      { shade: '600', hex: '#EA580C', bgClass: 'bg-vintiga-orange-600', dark: true },
      { shade: '700', hex: '#C2410C', bgClass: 'bg-vintiga-orange-700', dark: true },
      { shade: '800', hex: '#9A3412', bgClass: 'bg-vintiga-orange-800', dark: true },
      { shade: '900', hex: '#7C2D12', bgClass: 'bg-vintiga-orange-900', dark: true },
      { shade: '950', hex: '#431407', bgClass: 'bg-vintiga-orange-950', dark: true },
    ],
  },
  {
    name: 'Amber',
    swatches: [
      { shade: '50', hex: '#FFFBEB', bgClass: 'bg-vintiga-amber-50' },
      { shade: '100', hex: '#FEF3C7', bgClass: 'bg-vintiga-amber-100' },
      { shade: '200', hex: '#FDE68A', bgClass: 'bg-vintiga-amber-200' },
      { shade: '300', hex: '#FCD34D', bgClass: 'bg-vintiga-amber-300' },
      { shade: '400', hex: '#FBBF24', bgClass: 'bg-vintiga-amber-400' },
      { shade: '500', hex: '#F59E0B', bgClass: 'bg-vintiga-amber-500', dark: true },
      { shade: '600', hex: '#D97706', bgClass: 'bg-vintiga-amber-600', dark: true },
      { shade: '700', hex: '#B45309', bgClass: 'bg-vintiga-amber-700', dark: true },
      { shade: '800', hex: '#92400E', bgClass: 'bg-vintiga-amber-800', dark: true },
      { shade: '900', hex: '#78350F', bgClass: 'bg-vintiga-amber-900', dark: true },
      { shade: '950', hex: '#451A03', bgClass: 'bg-vintiga-amber-950', dark: true },
    ],
  },
  {
    name: 'Yellow',
    swatches: [
      { shade: '50', hex: '#FEFCE8', bgClass: 'bg-vintiga-yellow-50' },
      { shade: '100', hex: '#FEF9C3', bgClass: 'bg-vintiga-yellow-100' },
      { shade: '200', hex: '#FEF08A', bgClass: 'bg-vintiga-yellow-200' },
      { shade: '300', hex: '#FDE047', bgClass: 'bg-vintiga-yellow-300' },
      { shade: '400', hex: '#FACC15', bgClass: 'bg-vintiga-yellow-400' },
      { shade: '500', hex: '#EAB308', bgClass: 'bg-vintiga-yellow-500', dark: true },
      { shade: '600', hex: '#CA8A04', bgClass: 'bg-vintiga-yellow-600', dark: true },
      { shade: '700', hex: '#A16207', bgClass: 'bg-vintiga-yellow-700', dark: true },
      { shade: '800', hex: '#854D0E', bgClass: 'bg-vintiga-yellow-800', dark: true },
      { shade: '900', hex: '#713F12', bgClass: 'bg-vintiga-yellow-900', dark: true },
      { shade: '950', hex: '#422006', bgClass: 'bg-vintiga-yellow-950', dark: true },
    ],
  },
  {
    name: 'Lime',
    swatches: [
      { shade: '50', hex: '#F7FEE7', bgClass: 'bg-vintiga-lime-50' },
      { shade: '100', hex: '#ECFCCB', bgClass: 'bg-vintiga-lime-100' },
      { shade: '200', hex: '#D9F99D', bgClass: 'bg-vintiga-lime-200' },
      { shade: '300', hex: '#BEF264', bgClass: 'bg-vintiga-lime-300' },
      { shade: '400', hex: '#A3E635', bgClass: 'bg-vintiga-lime-400' },
      { shade: '500', hex: '#84CC16', bgClass: 'bg-vintiga-lime-500', dark: true },
      { shade: '600', hex: '#65A30D', bgClass: 'bg-vintiga-lime-600', dark: true },
      { shade: '700', hex: '#4D7C0F', bgClass: 'bg-vintiga-lime-700', dark: true },
      { shade: '800', hex: '#3F6212', bgClass: 'bg-vintiga-lime-800', dark: true },
      { shade: '900', hex: '#365314', bgClass: 'bg-vintiga-lime-900', dark: true },
      { shade: '950', hex: '#1A2E05', bgClass: 'bg-vintiga-lime-950', dark: true },
    ],
  },
  {
    name: 'Green',
    swatches: [
      { shade: '50', hex: '#F0FDF4', bgClass: 'bg-vintiga-green-50' },
      { shade: '100', hex: '#DCFCE7', bgClass: 'bg-vintiga-green-100' },
      { shade: '200', hex: '#BBF7D0', bgClass: 'bg-vintiga-green-200' },
      { shade: '300', hex: '#86EFAC', bgClass: 'bg-vintiga-green-300' },
      { shade: '400', hex: '#4ADE80', bgClass: 'bg-vintiga-green-400' },
      { shade: '500', hex: '#22C55E', bgClass: 'bg-vintiga-green-500', dark: true },
      { shade: '600', hex: '#16A34A', bgClass: 'bg-vintiga-green-600', dark: true },
      { shade: '700', hex: '#15803D', bgClass: 'bg-vintiga-green-700', dark: true },
      { shade: '800', hex: '#166534', bgClass: 'bg-vintiga-green-800', dark: true },
      { shade: '900', hex: '#14532D', bgClass: 'bg-vintiga-green-900', dark: true },
      { shade: '950', hex: '#052E16', bgClass: 'bg-vintiga-green-950', dark: true },
    ],
  },
  {
    name: 'Emerald',
    swatches: [
      { shade: '50', hex: '#ECFDF5', bgClass: 'bg-vintiga-emerald-50' },
      { shade: '100', hex: '#D1FAE5', bgClass: 'bg-vintiga-emerald-100' },
      { shade: '200', hex: '#A7F3D0', bgClass: 'bg-vintiga-emerald-200' },
      { shade: '300', hex: '#6EE7B7', bgClass: 'bg-vintiga-emerald-300' },
      { shade: '400', hex: '#34D399', bgClass: 'bg-vintiga-emerald-400' },
      { shade: '500', hex: '#10B981', bgClass: 'bg-vintiga-emerald-500', dark: true },
      { shade: '600', hex: '#059669', bgClass: 'bg-vintiga-emerald-600', dark: true },
      { shade: '700', hex: '#047857', bgClass: 'bg-vintiga-emerald-700', dark: true },
      { shade: '800', hex: '#065F46', bgClass: 'bg-vintiga-emerald-800', dark: true },
      { shade: '900', hex: '#064E3B', bgClass: 'bg-vintiga-emerald-900', dark: true },
      { shade: '950', hex: '#022C22', bgClass: 'bg-vintiga-emerald-950', dark: true },
    ],
  },
  {
    name: 'Teal',
    swatches: [
      { shade: '50', hex: '#F0FDFA', bgClass: 'bg-vintiga-teal-50' },
      { shade: '100', hex: '#CCFBF1', bgClass: 'bg-vintiga-teal-100' },
      { shade: '200', hex: '#99F6E4', bgClass: 'bg-vintiga-teal-200' },
      { shade: '300', hex: '#5EEAD4', bgClass: 'bg-vintiga-teal-300' },
      { shade: '400', hex: '#2DD4BF', bgClass: 'bg-vintiga-teal-400' },
      { shade: '500', hex: '#14B8A6', bgClass: 'bg-vintiga-teal-500', dark: true },
      { shade: '600', hex: '#0D9488', bgClass: 'bg-vintiga-teal-600', dark: true },
      { shade: '700', hex: '#0F766E', bgClass: 'bg-vintiga-teal-700', dark: true },
      { shade: '800', hex: '#115E59', bgClass: 'bg-vintiga-teal-800', dark: true },
      { shade: '900', hex: '#134E4A', bgClass: 'bg-vintiga-teal-900', dark: true },
      { shade: '950', hex: '#042F2E', bgClass: 'bg-vintiga-teal-950', dark: true },
    ],
  },
  {
    name: 'Cyan',
    swatches: [
      { shade: '50', hex: '#ECFEFF', bgClass: 'bg-vintiga-cyan-50' },
      { shade: '100', hex: '#CFFAFE', bgClass: 'bg-vintiga-cyan-100' },
      { shade: '200', hex: '#A5F3FC', bgClass: 'bg-vintiga-cyan-200' },
      { shade: '300', hex: '#67E8F9', bgClass: 'bg-vintiga-cyan-300' },
      { shade: '400', hex: '#22D3EE', bgClass: 'bg-vintiga-cyan-400' },
      { shade: '500', hex: '#06B6D4', bgClass: 'bg-vintiga-cyan-500', dark: true },
      { shade: '600', hex: '#0891B2', bgClass: 'bg-vintiga-cyan-600', dark: true },
      { shade: '700', hex: '#0E7490', bgClass: 'bg-vintiga-cyan-700', dark: true },
      { shade: '800', hex: '#155E75', bgClass: 'bg-vintiga-cyan-800', dark: true },
      { shade: '900', hex: '#164E63', bgClass: 'bg-vintiga-cyan-900', dark: true },
      { shade: '950', hex: '#083344', bgClass: 'bg-vintiga-cyan-950', dark: true },
    ],
  },
  {
    name: 'Sky',
    swatches: [
      { shade: '50', hex: '#F0F9FF', bgClass: 'bg-vintiga-sky-50' },
      { shade: '100', hex: '#E0F2FE', bgClass: 'bg-vintiga-sky-100' },
      { shade: '200', hex: '#BAE6FD', bgClass: 'bg-vintiga-sky-200' },
      { shade: '300', hex: '#7DD3FC', bgClass: 'bg-vintiga-sky-300' },
      { shade: '400', hex: '#38BDF8', bgClass: 'bg-vintiga-sky-400' },
      { shade: '500', hex: '#0EA5E9', bgClass: 'bg-vintiga-sky-500', dark: true },
      { shade: '600', hex: '#0284C7', bgClass: 'bg-vintiga-sky-600', dark: true },
      { shade: '700', hex: '#0369A1', bgClass: 'bg-vintiga-sky-700', dark: true },
      { shade: '800', hex: '#075985', bgClass: 'bg-vintiga-sky-800', dark: true },
      { shade: '900', hex: '#0C4A6E', bgClass: 'bg-vintiga-sky-900', dark: true },
      { shade: '950', hex: '#082F49', bgClass: 'bg-vintiga-sky-950', dark: true },
    ],
  },
  {
    name: 'Blue',
    swatches: [
      { shade: '50', hex: '#EFF6FF', bgClass: 'bg-vintiga-blue-50' },
      { shade: '100', hex: '#DBEAFE', bgClass: 'bg-vintiga-blue-100' },
      { shade: '200', hex: '#BFDBFE', bgClass: 'bg-vintiga-blue-200' },
      { shade: '300', hex: '#93C5FD', bgClass: 'bg-vintiga-blue-300' },
      { shade: '400', hex: '#60A5FA', bgClass: 'bg-vintiga-blue-400' },
      { shade: '500', hex: '#3B82F6', bgClass: 'bg-vintiga-blue-500', dark: true },
      { shade: '600', hex: '#2563EB', bgClass: 'bg-vintiga-blue-600', dark: true },
      { shade: '700', hex: '#1D4ED8', bgClass: 'bg-vintiga-blue-700', dark: true },
      { shade: '800', hex: '#1E40AF', bgClass: 'bg-vintiga-blue-800', dark: true },
      { shade: '900', hex: '#1E3A8A', bgClass: 'bg-vintiga-blue-900', dark: true },
      { shade: '950', hex: '#172554', bgClass: 'bg-vintiga-blue-950', dark: true },
    ],
  },
  {
    name: 'Indigo',
    swatches: [
      { shade: '50', hex: '#EEF2FF', bgClass: 'bg-vintiga-indigo-50' },
      { shade: '100', hex: '#E0E7FF', bgClass: 'bg-vintiga-indigo-100' },
      { shade: '200', hex: '#C7D2FE', bgClass: 'bg-vintiga-indigo-200' },
      { shade: '300', hex: '#A5B4FC', bgClass: 'bg-vintiga-indigo-300' },
      { shade: '400', hex: '#818CF8', bgClass: 'bg-vintiga-indigo-400' },
      { shade: '500', hex: '#6366F1', bgClass: 'bg-vintiga-indigo-500', dark: true },
      { shade: '600', hex: '#4F46E5', bgClass: 'bg-vintiga-indigo-600', dark: true },
      { shade: '700', hex: '#4338CA', bgClass: 'bg-vintiga-indigo-700', dark: true },
      { shade: '800', hex: '#3730A3', bgClass: 'bg-vintiga-indigo-800', dark: true },
      { shade: '900', hex: '#312E81', bgClass: 'bg-vintiga-indigo-900', dark: true },
      { shade: '950', hex: '#1E1B4B', bgClass: 'bg-vintiga-indigo-950', dark: true },
    ],
  },
  {
    name: 'Violet',
    swatches: [
      { shade: '50', hex: '#F5F3FF', bgClass: 'bg-vintiga-violet-50' },
      { shade: '100', hex: '#EDE9FE', bgClass: 'bg-vintiga-violet-100' },
      { shade: '200', hex: '#DDD6FE', bgClass: 'bg-vintiga-violet-200' },
      { shade: '300', hex: '#C4B5FD', bgClass: 'bg-vintiga-violet-300' },
      { shade: '400', hex: '#A78BFA', bgClass: 'bg-vintiga-violet-400' },
      { shade: '500', hex: '#8B5CF6', bgClass: 'bg-vintiga-violet-500', dark: true },
      { shade: '600', hex: '#7C3AED', bgClass: 'bg-vintiga-violet-600', dark: true },
      { shade: '700', hex: '#6D28D9', bgClass: 'bg-vintiga-violet-700', dark: true },
      { shade: '800', hex: '#5B21B6', bgClass: 'bg-vintiga-violet-800', dark: true },
      { shade: '900', hex: '#4C1D95', bgClass: 'bg-vintiga-violet-900', dark: true },
      { shade: '950', hex: '#2E1065', bgClass: 'bg-vintiga-violet-950', dark: true },
    ],
  },
  {
    name: 'Purple',
    swatches: [
      { shade: '50', hex: '#FAF5FF', bgClass: 'bg-vintiga-purple-50' },
      { shade: '100', hex: '#F3E8FF', bgClass: 'bg-vintiga-purple-100' },
      { shade: '200', hex: '#E9D5FF', bgClass: 'bg-vintiga-purple-200' },
      { shade: '300', hex: '#D8B4FE', bgClass: 'bg-vintiga-purple-300' },
      { shade: '400', hex: '#C084FC', bgClass: 'bg-vintiga-purple-400' },
      { shade: '500', hex: '#A855F7', bgClass: 'bg-vintiga-purple-500', dark: true },
      { shade: '600', hex: '#9333EA', bgClass: 'bg-vintiga-purple-600', dark: true },
      { shade: '700', hex: '#7E22CE', bgClass: 'bg-vintiga-purple-700', dark: true },
      { shade: '800', hex: '#6B21A8', bgClass: 'bg-vintiga-purple-800', dark: true },
      { shade: '900', hex: '#581C87', bgClass: 'bg-vintiga-purple-900', dark: true },
      { shade: '950', hex: '#3B0764', bgClass: 'bg-vintiga-purple-950', dark: true },
    ],
  },
  {
    name: 'Fuchsia',
    swatches: [
      { shade: '50', hex: '#FDF4FF', bgClass: 'bg-vintiga-fuchsia-50' },
      { shade: '100', hex: '#FAE8FF', bgClass: 'bg-vintiga-fuchsia-100' },
      { shade: '200', hex: '#F5D0FE', bgClass: 'bg-vintiga-fuchsia-200' },
      { shade: '300', hex: '#F0ABFC', bgClass: 'bg-vintiga-fuchsia-300' },
      { shade: '400', hex: '#E879F9', bgClass: 'bg-vintiga-fuchsia-400' },
      { shade: '500', hex: '#D946EF', bgClass: 'bg-vintiga-fuchsia-500', dark: true },
      { shade: '600', hex: '#C026D3', bgClass: 'bg-vintiga-fuchsia-600', dark: true },
      { shade: '700', hex: '#A21CAF', bgClass: 'bg-vintiga-fuchsia-700', dark: true },
      { shade: '800', hex: '#86198F', bgClass: 'bg-vintiga-fuchsia-800', dark: true },
      { shade: '900', hex: '#701A75', bgClass: 'bg-vintiga-fuchsia-900', dark: true },
      { shade: '950', hex: '#4A044E', bgClass: 'bg-vintiga-fuchsia-950', dark: true },
    ],
  },
  {
    name: 'Pink',
    swatches: [
      { shade: '50', hex: '#FDF2F8', bgClass: 'bg-vintiga-pink-50' },
      { shade: '100', hex: '#FCE7F3', bgClass: 'bg-vintiga-pink-100' },
      { shade: '200', hex: '#FBCFE8', bgClass: 'bg-vintiga-pink-200' },
      { shade: '300', hex: '#F9A8D4', bgClass: 'bg-vintiga-pink-300' },
      { shade: '400', hex: '#F472B6', bgClass: 'bg-vintiga-pink-400' },
      { shade: '500', hex: '#EC4899', bgClass: 'bg-vintiga-pink-500', dark: true },
      { shade: '600', hex: '#DB2777', bgClass: 'bg-vintiga-pink-600', dark: true },
      { shade: '700', hex: '#BE185D', bgClass: 'bg-vintiga-pink-700', dark: true },
      { shade: '800', hex: '#9D174D', bgClass: 'bg-vintiga-pink-800', dark: true },
      { shade: '900', hex: '#831843', bgClass: 'bg-vintiga-pink-900', dark: true },
      { shade: '950', hex: '#500724', bgClass: 'bg-vintiga-pink-950', dark: true },
    ],
  },
  {
    name: 'Rose',
    swatches: [
      { shade: '50', hex: '#FFF1F2', bgClass: 'bg-vintiga-rose-50' },
      { shade: '100', hex: '#FFE4E6', bgClass: 'bg-vintiga-rose-100' },
      { shade: '200', hex: '#FECDD3', bgClass: 'bg-vintiga-rose-200' },
      { shade: '300', hex: '#FDA4AF', bgClass: 'bg-vintiga-rose-300' },
      { shade: '400', hex: '#FB7185', bgClass: 'bg-vintiga-rose-400' },
      { shade: '500', hex: '#F43F5E', bgClass: 'bg-vintiga-rose-500', dark: true },
      { shade: '600', hex: '#E11D48', bgClass: 'bg-vintiga-rose-600', dark: true },
      { shade: '700', hex: '#BE123C', bgClass: 'bg-vintiga-rose-700', dark: true },
      { shade: '800', hex: '#9F1239', bgClass: 'bg-vintiga-rose-800', dark: true },
      { shade: '900', hex: '#881337', bgClass: 'bg-vintiga-rose-900', dark: true },
      { shade: '950', hex: '#4C0519', bgClass: 'bg-vintiga-rose-950', dark: true },
    ],
  },
]

function Swatch({ s }: { s: Swatch }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`${s.bgClass} rounded-vintiga-lg w-full aspect-square flex items-center justify-center border border-vintiga-border`}
      >
        <span className={`typo-caption font-semibold ${s.dark ? 'text-white' : 'text-vintiga-foreground'}`}>{s.shade}</span>
      </div>
      <span className="typo-caption text-vintiga-foreground-muted font-mono">{s.hex}</span>
    </div>
  )
}

export function ColorPaletteSection() {
  return (
    <section className="flex flex-col gap-vintiga-2xl">
      <SectionHeader id='colors' title='Colours' description='Full Tailwind palette sourced from the Vintiga Figma variables. The semantic layer picks sensible defaults — re-map when the brand direction firms up.' />

      <div className="flex flex-col gap-vintiga-xl">
        {PALETTES.map((p) => (
          <div key={p.name} className="flex flex-col gap-vintiga-md">
            <h3 className="typo-title-subsection font-semibold text-vintiga-foreground">{p.name}</h3>
            <div className='grid grid-cols-6 sm:grid-cols-11 gap-vintiga-sm'>
              {p.swatches.map((s) => (<Swatch key={s.shade} s={s} />))}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
