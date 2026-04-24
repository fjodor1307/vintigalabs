import type { ComponentType } from 'react'

// Every prototype folder exports a `config` from `prototype.config.ts`.
// This file globs them all so App.tsx never has to import a screen directly.

export type PrototypeFrame = 'mobile' | 'web'

export type PrototypeEntry = {
  name: string
  description: string
  path: string
  screens: number
}

export type PrototypeConfig = {
  slug: string
  frame: PrototypeFrame
  tags?: string[]
  entries: PrototypeEntry[]
  routes: Record<string, ComponentType>
}

const modules = import.meta.glob('./*/prototype.config.ts', { eager: true }) as Record<
  string,
  { config: PrototypeConfig }
>

export const prototypeConfigs: PrototypeConfig[] = Object.values(modules).map((m) => m.config)

export const allRoutes: Record<string, ComponentType> = Object.fromEntries(
  prototypeConfigs.flatMap((c) => Object.entries(c.routes)),
)

export type EnrichedEntry = PrototypeEntry & {
  slug: string
  tags: string[]
  frame: PrototypeFrame
}

export const allEntries: EnrichedEntry[] = prototypeConfigs.flatMap((c) =>
  c.entries.map((e) => ({ ...e, slug: c.slug, tags: c.tags ?? [], frame: c.frame })),
)

export function configForPath(path: string): PrototypeConfig | undefined {
  return prototypeConfigs.find((c) => path in c.routes)
}

export function frameForPath(path: string): PrototypeFrame | null {
  return configForPath(path)?.frame ?? null
}

export function configBySlug(slug: string): PrototypeConfig | undefined {
  return prototypeConfigs.find((c) => c.slug === slug)
}
