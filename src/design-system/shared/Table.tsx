import type { ReactNode, HTMLAttributes } from 'react'

// Thin styled wrappers around native <table>. Use for any tabular data.
// Children handle their own content — cells can host text, tags, buttons, etc.

export function Table({ children, className = '', ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full border border-vintiga-slate-200 rounded-vintiga-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table
          {...rest}
          className={`w-full border-collapse typo-body-sm ${className}`}
        >
          {children}
        </table>
      </div>
    </div>
  )
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-vintiga-slate-50 border-b border-vintiga-slate-200">
      {children}
    </thead>
  )
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="bg-vintiga-white">{children}</tbody>
}

export function TableRow({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <tr
      onClick={onClick}
      className={[
        'border-b border-vintiga-slate-100 last:border-b-0',
        onClick ? 'hover:bg-vintiga-slate-50 cursor-pointer transition-colors' : '',
        className,
      ].join(' ')}
    >
      {children}
    </tr>
  )
}

export function TableHeader({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`text-left typo-body-sm font-semibold text-vintiga-slate-700 px-vintiga-lg py-vintiga-md ${className}`}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td className={`typo-body-sm text-vintiga-slate-900 px-vintiga-lg py-vintiga-md ${className}`}>
      {children}
    </td>
  )
}
