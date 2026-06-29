#!/usr/bin/env node
// Builds a short "what changed lately" feed from git history.
// Output: src/generated/updates.json — consumed by the <LatestUpdatesModal />
// in the hub. One entry per (commit × touched area) over the last few weeks.

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const outputPath = join(repoRoot, 'src/generated/updates.json')
const SINCE = '21 days ago'

// Resolve the repo URL from the origin remote (falls back to the known repo).
let repoUrl = 'https://github.com/fjodor1307/vintigalabs'
try {
  const remote = execSync('git config --get remote.origin.url', { cwd: repoRoot, encoding: 'utf8' }).trim()
  const m = remote.match(/github\.com[:/](.+?)(?:\.git)?$/)
  if (m) repoUrl = `https://github.com/${m[1]}`
} catch {
  /* keep fallback */
}

// Known prototype slugs (so a commit touching src/prototypes/<slug> is grouped there).
let slugs = []
try {
  slugs = readdirSync(join(repoRoot, 'src/prototypes')).filter((n) => {
    try {
      return statSync(join(repoRoot, 'src/prototypes', n)).isDirectory() && !n.startsWith('_')
    } catch {
      return false
    }
  })
} catch {
  /* none */
}

function areasFor(files) {
  const set = new Set()
  for (const f of files) {
    const m = f.match(/^src\/prototypes\/([^/]+)\//)
    if (m && slugs.includes(m[1])) set.add(m[1])
    else if (f.startsWith('src/design-system/')) set.add('design-system')
    else if (f.startsWith('src/') || f.startsWith('scripts/') || /^[A-Z].*\.md$/.test(f)) set.add('builder')
  }
  if (set.size === 0) set.add('builder')
  return [...set]
}

const prFrom = (s) => {
  const m = s.match(/\(#(\d+)\)/)
  return m ? Number(m[1]) : null
}

// Strip the "(#123)" suffix and the conventional-commit "type(scope): " prefix
// so the bullet reads like a plain accomplishment.
const cleanLabel = (s) =>
  s
    .replace(/\s*\(#\d+\)\s*$/, '')
    .replace(/^\w+(\([^)]*\))?!?:\s*/, '')
    .trim()

const raw = execSync(
  `git log --since="${SINCE}" --no-merges --date=short --name-only --pretty=format:"@@@%h|%ad|%s"`,
  { cwd: repoRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
)

const items = []
let cur = null
const flush = (c) => {
  if (!c || !cleanLabel(c.subject)) return
  const pr = prFrom(c.subject)
  const label = cleanLabel(c.subject)
  for (const area of areasFor(c.files)) items.push({ date: c.date, label, pr, area })
}
for (const line of raw.split('\n')) {
  if (line.startsWith('@@@')) {
    flush(cur)
    const [hash, date, ...rest] = line.slice(3).split('|')
    cur = { hash, date, subject: rest.join('|'), files: [] }
  } else if (line.trim() && cur) {
    cur.files.push(line.trim())
  }
}
flush(cur)

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(
  outputPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), repoUrl, items }, null, 2) + '\n',
)
console.log(`generate-updates: wrote ${items.length} items to ${outputPath}`)
