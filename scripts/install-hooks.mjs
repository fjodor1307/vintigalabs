#!/usr/bin/env node
// Points Git at the repo's .githooks/ folder so everyone shares the same
// pre-push protection. Run once after cloning: `npm run install-hooks`.
//
// Uses `git config core.hooksPath` — no copying of files, so future edits
// to any hook propagate on the next `git pull`.

import { execSync } from 'node:child_process'
import { chmodSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const hooksDir = join(repoRoot, '.githooks')

function main() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: repoRoot, stdio: 'ignore' })
  } catch {
    // Runs as `postinstall`, so exit gracefully (0) when git isn't around —
    // e.g. installing from a tarball or a non-git checkout. Nothing to do.
    console.log('ℹ Skipping hook install — not inside a git repository.')
    return
  }

  execSync('git config core.hooksPath .githooks', { cwd: repoRoot })

  // Ensure every hook is executable (git silently ignores non-executable ones).
  for (const name of readdirSync(hooksDir)) {
    const path = join(hooksDir, name)
    if (!statSync(path).isFile()) continue
    chmodSync(path, 0o755)
  }

  console.log('✓ Git hooks installed (core.hooksPath = .githooks)')
  console.log('  Active hooks:')
  for (const name of readdirSync(hooksDir)) {
    if (name.startsWith('.')) continue
    console.log(`    - ${name}`)
  }
  console.log('')
  console.log('  The pre-push hook blocks direct pushes to `main`.')
  console.log('  Emergency override: VINTIGA_ALLOW_MAIN_PUSH=1 git push')
}

main()
