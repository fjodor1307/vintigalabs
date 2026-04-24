#!/usr/bin/env node
// Scaffolds a new prototype folder with all templates + a starter config.
// Usage: npm run new-prototype <slug> [--name "Pretty Name"] [--frame mobile|web]

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, appendFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const templatesDir = join(repoRoot, '_templates')
const prototypesDir = join(repoRoot, 'src/prototypes')

function parseArgs(argv) {
  const args = { slug: null, name: null, frame: 'mobile' }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--name') args.name = argv[++i]
    else if (a === '--frame') args.frame = argv[++i]
    else rest.push(a)
  }
  args.slug = rest[0] ?? null
  return args
}

function toPascal(slug) {
  return slug.split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('')
}

function toPretty(slug) {
  return slug.split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}

function main() {
  const { slug, name, frame } = parseArgs(process.argv.slice(2))
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    console.error('Usage: npm run new-prototype <slug> [--name "Pretty Name"] [--frame mobile|web]')
    console.error('Slug must be lowercase, hyphens only (e.g. "lending-origination").')
    process.exit(1)
  }
  if (!['mobile', 'web'].includes(frame)) {
    console.error(`Invalid --frame "${frame}". Use "mobile" or "web".`)
    process.exit(1)
  }

  const target = join(prototypesDir, slug)
  if (existsSync(target)) {
    console.error(`✗ src/prototypes/${slug} already exists.`)
    process.exit(1)
  }

  const prettyName = name ?? toPretty(slug)
  const pascal = toPascal(slug)

  mkdirSync(target, { recursive: true })

  // 1. Copy the four markdown templates and replace the {Feature} placeholder.
  for (const file of readdirSync(templatesDir)) {
    if (!file.endsWith('.md')) continue
    const body = readFileSync(join(templatesDir, file), 'utf8').replaceAll('{Feature}', prettyName)
    writeFileSync(join(target, file), body)
  }

  // 2. Add a starter WelcomeScreen so the prototype renders something.
  writeFileSync(join(target, 'WelcomeScreen.tsx'), starterScreen(pascal, prettyName))

  // 3. Add a prototype.config.ts — this is what the router auto-discovers.
  writeFileSync(join(target, 'prototype.config.ts'), starterConfig(slug, prettyName, pascal, frame))

  // 4. Append to the root CHANGELOG index if present.
  const rootChangelog = join(repoRoot, 'CHANGELOG.md')
  if (existsSync(rootChangelog)) {
    const date = new Date().toISOString().slice(0, 10)
    appendFileSync(rootChangelog, `\n## ${date} — Scaffolded \`${slug}\` prototype\n\nCreated \`src/prototypes/${slug}/\` via \`npm run new-prototype\`.\n`)
  }

  console.log(`✓ Scaffolded src/prototypes/${slug}/`)
  console.log(`  Entry point: #/web/${slug}/welcome`)
  console.log(`  Next steps:`)
  console.log(`    1. Fill in CONTEXT.md (Tags, Status, epic link, user stories).`)
  console.log(`    2. Map the journey in JOURNEY.md.`)
  console.log(`    3. Add more screens alongside WelcomeScreen.tsx and register them in prototype.config.ts.`)
  console.log(`    4. Run \`npm run dev\` — the prototype appears on the home page automatically.`)
}

function starterScreen(pascal, prettyName) {
  return `export function WelcomeScreen() {
  return (
    <div className="flex flex-col gap-vintiga-md p-vintiga-lg">
      <h1 className="typo-title-screen font-light text-vintiga-foreground">${prettyName}</h1>
      <p className="typo-body text-vintiga-foreground-muted">
        Starter screen — replace with the first step of your journey.
      </p>
    </div>
  )
}
`
}

function starterConfig(slug, prettyName, pascal, frame) {
  return `import type { PrototypeConfig } from '../_registry'
import { WelcomeScreen } from './WelcomeScreen'

export const config: PrototypeConfig = {
  slug: '${slug}',
  frame: '${frame}',
  tags: [],
  entries: [
    {
      name: '${prettyName}',
      description: 'TODO — describe the flow in one sentence.',
      path: '#/web/${slug}/welcome',
      screens: 1,
    },
  ],
  routes: {
    '#/web/${slug}/welcome': WelcomeScreen,
  },
}
`
}

main()
