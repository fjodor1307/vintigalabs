// ─── BlindEnthusiasmLogo ─────────────────────────────────────────────────────
// Club brand mark for Blind Enthusiasm — extracted from the Figma SVG export
// (path geometry only; the original 1.7 MB asset embedded a raster image we
// don't need). Drop it anywhere a Blind Enthusiasm reference should carry the
// brand mark — uses currentColor for the white logo path so it inherits sizing
// from its parent.

interface BlindEnthusiasmLogoProps {
  className?: string
  /** When true, omits the rounded black background — useful when the parent
   *  already supplies a coloured tile. */
  bare?: boolean
  size?: number | string
}

export function BlindEnthusiasmLogo({ className, bare = false, size }: BlindEnthusiasmLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {!bare && (
        <path
          d="M0 6C0 2.68629 2.68629 0 6 0H42C45.3137 0 48 2.68629 48 6V42C48 45.3137 45.3137 48 42 48H6C2.68629 48 0 45.3137 0 42V6Z"
          fill="black"
        />
      )}
      <path
        d="M24.0252 15.0001L9.44434 24.0001L23.975 33L38.5559 24.0001L24.0252 15.0001ZM27.7459 24.0001C27.7459 26.0615 26.0867 27.771 24.0252 27.771C21.9638 27.771 20.3046 26.1118 20.3046 24.0001C20.3046 23.5978 20.3549 23.2459 20.5057 22.8436C21.0588 22.7934 21.6118 22.7431 22.2152 22.6928C21.9638 23.0448 21.813 23.4973 21.813 24.0001C21.813 25.257 22.8185 26.2626 24.0755 26.2626V24.0001H26.3381C26.3381 23.4973 26.1872 23.095 25.9358 22.6928C26.5392 22.7431 27.0923 22.7934 27.6453 22.8436C27.6956 23.2459 27.7459 23.5978 27.7459 24.0001ZM24.0252 21.2347C20.9582 21.2347 18.2432 21.7375 16.1817 22.2403C18.1426 20.933 20.9582 19.5252 24.0252 19.5252C27.0923 19.5252 29.9079 20.933 31.8688 22.2403C29.8073 21.6872 27.0923 21.2347 24.0252 21.2347ZM18.9471 23.095C18.8968 23.3967 18.8465 23.6984 18.8465 24.0001C18.8465 25.609 19.6007 27.0671 20.7571 28.0224C17.7906 27.1676 15.3773 25.3073 14.1706 24.3017C15.1761 23.9498 16.8856 23.447 18.9471 23.095ZM29.204 24.0001C29.204 23.6984 29.1537 23.3967 29.1034 23.095C31.1648 23.447 32.8241 23.9498 33.8799 24.3017C32.6732 25.3576 30.2598 27.1676 27.2934 28.0224C28.4498 27.0671 29.204 25.609 29.204 24.0001ZM26.69 18.3688C25.8353 18.1677 24.9303 18.0671 24.0252 18.0671C23.1202 18.0671 22.2152 18.1677 21.3605 18.3688L24.0252 16.7096L26.69 18.3688ZM21.3605 29.6313C22.2152 29.8324 23.1202 29.933 24.0252 29.933C24.9303 29.933 25.8353 29.8324 26.69 29.6313L24.0252 31.2905L21.3605 29.6313Z"
        fill={bare ? 'currentColor' : 'white'}
      />
    </svg>
  )
}
