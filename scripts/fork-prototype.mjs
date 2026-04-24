#!/usr/bin/env node
// Duplicates an existing prototype into a new slug so you can iterate
// without touching someone else's folder.
//
// Usage:
//   npm run fork-prototype -- <source-slug> <new-slug>
//
// Example:
//   npm run fork-prototype -- invited-director invited-director-ogi

import {
  readdirSync, mkdirSync, writeFileSync, readFileSync, existsSync,
  statSync, copyFileSync, appendFileSync,
} from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const prototypesDir = join(repoRoot, 'src/prototypes')

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    const stat = statSync(srcPath)
    if (stat.isDirectory()) copyDir(srcPath, destPath)
    else copyFileSync(srcPath, destPath)
  }
}

function rewriteRoutes(configPath, sourceSlug, newSlug) {
  if (!existsSync(configPath)) return
  let body = readFileSync(configPath, 'utf8')
  body = body.replaceAll(`'${sourceSlug}'`, `'${newSlug}'`)
  body = body.replaceAll(`"${sourceSlug}"`, `"${newSlug}"`)
  body = body.replaceAll(`/web/${sourceSlug}/`, `/web/${newSlug}/`)
  writeFileSync(configPath, body)
}

function main() {
  const [sourceSlug, newSlug] = process.argv.slice(2)
  if (!sourceSlug || !newSlug || !/^[a-z0-9][a-z0-9-]*$/.test(newSlug)) {
    console.error('Usage: npm run fork-prototype -- <source-slug> <new-slug>')
    console.error('New slug must be lowercase, hyphens only.')
    process.exit(1)
  }

  const source = join(prototypesDir, sourceSlug)
  const target = join(prototypesDir, newSlug)

  if (!existsSync(source)) {
    console.error(`✗ src/prototypes/${sourceSlug} does not exist.`)
    process.exit(1)
  }
  if (existsSync(target)) {
    console.error(`✗ src/prototypes/${newSlug} already exists.`)
    process.exit(1)
  }

  copyDir(source, target)
  rewriteRoutes(join(target, 'prototype.config.ts'), sourceSlug, newSlug)

  const changelogPath = join(target, 'CHANGELOG.md')
  if (existsSync(changelogPath)) {
    const date = new Date().toISOString().slice(0, 10)
    const entry = `\n## ${date} — Forked from \`${sourceSlug}\`\n\nCreated as an iteration fork via \`npm run fork-prototype\`.\n`
    appendFileSync(changelogPath, entry)
  }

  console.log(`✓ Forked src/prototypes/${sourceSlug} → src/prototypes/${newSlug}`)
  console.log(`  Routes rewritten to /web/${newSlug}/*`)
  console.log(`  Next steps:`)
  console.log(`    1. Update CONTEXT.md (Owner, Status, what's different).`)
  console.log(`    2. Update the entries[] names/descriptions in prototype.config.ts.`)
  console.log(`    3. Claim ownership in .github/CODEOWNERS.`)
  console.log(`    4. npm run dev — your fork appears on the home page.`)
}

main()
