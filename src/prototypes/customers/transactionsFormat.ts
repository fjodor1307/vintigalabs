// ─── Ledger entry formatters ─────────────────────────────────────────────────
// Pure functions split out so `TransactionsTable.tsx` can stay
// component-only (react-refresh/only-export-components).

export function formatCurrency(n: number): string {
  const sign = n < 0 ? '−' : '+'
  const abs = Math.abs(n)
  return `${sign}$${abs.toFixed(2)}`
}

export function formatPoints(n: number): string {
  const sign = n < 0 ? '−' : '+'
  return `${sign}${Math.abs(n).toLocaleString()}`
}
