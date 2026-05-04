#!/usr/bin/env node
// Scans src/prototypes/* and builds a contributors map from git log.
// Output: src/generated/contributors.json — consumed by the <Contributors /> component.

import { execSync } from 'node:child_process'
import { readdirSync, mkdirSync, writeFileSync, statSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const VALID_STATUSES = ['in-progress', 'approved']
const DEFAULT_STATUS = 'in-progress'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const prototypesDir = join(repoRoot, 'src/prototypes')
const outputPath = join(repoRoot, 'src/generated/contributors.json')

// Per-contributor avatar overrides — keyed by lowercased name. Lets specific
// contributors pin their own colour (and initials, if needed) instead of the
// auto-hashed default. Add new entries here.
const CONTRIBUTOR_OVERRIDES = {
  'fedja djukic': { colour: '#000000' },
  // GitHub web-UI merges author commits as the GH username (`fjodor1307`),
  // which would otherwise show as "FJ". Alias to the same identity as
  // local commits so the avatar is consistent everywhere.
  'fjodor1307':   { initials: 'FD', colour: '#000000' },
}

function colourFromName(name) {
  const override = CONTRIBUTOR_OVERRIDES[name.toLowerCase()]
  if (override?.colour) return override.colour
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 55%, 45%)`
}

function initialsFromName(name) {
  const override = CONTRIBUTOR_OVERRIDES[name.toLowerCase()]
  if (override?.initials) return override.initials
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function contributorsFor(relativePath) {
  try {
    const output = execSync(
      `git log --format='%an|%ae|%ad' --date=short -- "${relativePath}"`,
      { cwd: repoRoot, encoding: 'utf8' }
    )

    const byKey = new Map()
    for (const line of output.split('\n')) {
      if (!line.trim()) continue
      const [name, email, date] = line.split('|')
      const key = (email || name).toLowerCase()
      const existing = byKey.get(key)
      if (existing) {
        existing.commits += 1
        if (date > existing.lastCommit) existing.lastCommit = date
        if (!existing.firstCommit || date < existing.firstCommit) existing.firstCommit = date
      } else {
        byKey.set(key, {
          name,
          email,
          initials: initialsFromName(name),
          colour: colourFromName(name),
          commits: 1,
          firstCommit: date,
          lastCommit: date,
        })
      }
    }

    return [...byKey.values()].sort((a, b) => b.lastCommit.localeCompare(a.lastCommit))
  } catch {
    return []
  }
}

function statusFor(prototypeName) {
  const contextPath = join(prototypesDir, prototypeName, 'CONTEXT.md')
  if (!existsSync(contextPath)) return DEFAULT_STATUS
  try {
    const body = readFileSync(contextPath, 'utf8')
    const match = body.match(/\*\*Status:\*\*\s*([a-z-]+)/i)
    if (!match) return DEFAULT_STATUS
    const value = match[1].toLowerCase()
    return VALID_STATUSES.includes(value) ? value : DEFAULT_STATUS
  } catch {
    return DEFAULT_STATUS
  }
}

function listPrototypes() {
  try {
    return readdirSync(prototypesDir).filter((name) => {
      const full = join(prototypesDir, name)
      return !name.startsWith('.') && !name.startsWith('_') && statSync(full).isDirectory()
    })
  } catch {
    return []
  }
}

function main() {
  const prototypes = listPrototypes()
  const map = {}

  for (const name of prototypes) {
    map[name] = {
      status: statusFor(name),
      contributors: contributorsFor(`src/prototypes/${name}`),
    }
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(
    outputPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), prototypes: map }, null, 2) + '\n'
  )

  const total = Object.values(map).reduce((sum, entry) => sum + entry.contributors.length, 0)
  console.log(`✓ Generated contributors for ${prototypes.length} prototype(s) — ${total} contributor rows`)
}

main()
