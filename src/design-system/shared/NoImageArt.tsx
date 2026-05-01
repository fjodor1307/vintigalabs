// "No image" placeholder — Figma asset (Desktop/no-image.svg).
// Used as the thumbnail fallback in catalogue rows, collection product tables,
// and the product / experience editor header when no image has been uploaded.

interface NoImageArtProps {
  className?: string
}

export function NoImageArt({ className = '' }: NoImageArtProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="64" height="64" fill="#F3F4F6" />
      <path
        d="M22 22L42 42M30.41 30.4101C30.2242 30.5959 30.0036 30.7433 29.7608 30.8439C29.518 30.9444 29.2578 30.9962 28.995 30.9962C28.7322 30.9962 28.472 30.9444 28.2292 30.8439C27.9864 30.7433 27.7658 30.5959 27.58 30.4101C27.3942 30.2243 27.2468 30.0037 27.1462 29.7609C27.0457 29.5181 26.9939 29.2579 26.9939 28.9951C26.9939 28.7323 27.0457 28.4721 27.1462 28.2293C27.2468 27.9865 27.3942 27.7659 27.58 27.5801M33.5 33.5L26 41M38 32L41 35V25C41 24.4696 40.7893 23.9609 40.4142 23.5858C40.0391 23.2107 39.5304 23 39 23H29M23.59 23.5901C23.4036 23.7746 23.2555 23.9942 23.1542 24.2362C23.053 24.4782 23.0006 24.7378 23 25.0001V39.0001C23 39.5305 23.2107 40.0392 23.5858 40.4143C23.9609 40.7894 24.4696 41.0001 25 41.0001H39C39.55 41.0001 40.052 40.7801 40.41 40.4101"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
