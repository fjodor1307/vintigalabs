import { DownloadIcon } from '@ds/icons/Icons'
import { VintigaIconBlack, VintigaIconIndigo, VintigaLogoBlack, VintigaLogoIndigo } from '@ds/shared/VintigaLogo'

// ─── SVG source strings ────────────────────────────────────────────────────────

const SVG_ICON_BLACK = `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12C0 5.37258 5.37258 0 12 0H32C38.6274 0 44 5.37258 44 12V32C44 38.6274 38.6274 44 32 44H12C5.37258 44 0 38.6274 0 32V12Z" fill="black"/>
<path d="M12.375 13.75C17.6907 13.75 22 18.0593 22 23.375C22 18.0593 26.3093 13.75 31.625 13.75H33V20.625C33 25.9407 28.6907 30.25 23.375 30.25H20.625C15.3093 30.25 11 25.9407 11 20.625V13.75H12.375Z" fill="white"/>
</svg>`

const SVG_ICON_INDIGO = `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12C0 5.37258 5.37258 0 12 0H32C38.6274 0 44 5.37258 44 12V32C44 38.6274 38.6274 44 32 44H12C5.37258 44 0 38.6274 0 32V12Z" fill="#F1F5F9"/>
<path d="M12.375 13.75C17.6907 13.75 22 18.0593 22 23.375C22 18.0593 26.3093 13.75 31.625 13.75H33V20.625C33 25.9407 28.6907 30.25 23.375 30.25H20.625C15.3093 30.25 11 25.9407 11 20.625V13.75H12.375Z" fill="#4F46E5"/>
</svg>`

const WORDMARK_TEXT = `<path d="M153.854 14.773V30.0029H151.21V27.5891C150.597 28.432 149.821 29.0738 148.883 29.5144C147.944 29.955 146.909 30.1753 145.779 30.1753C144.304 30.1753 142.982 29.8496 141.814 29.1983C140.645 28.5469 139.725 27.637 139.055 26.4684C138.404 25.2807 138.078 23.9205 138.078 22.3879C138.078 20.8554 138.404 19.5048 139.055 18.3362C139.725 17.1676 140.645 16.2577 141.814 15.6063C142.982 14.955 144.304 14.6293 145.779 14.6293C146.871 14.6293 147.877 14.84 148.796 15.2615C149.716 15.6638 150.482 16.2672 151.095 17.0718V14.773H153.854ZM146.009 27.7615C146.967 27.7615 147.838 27.5412 148.624 27.1006C149.409 26.6408 150.022 26.0086 150.463 25.204C150.904 24.3803 151.124 23.4416 151.124 22.3879C151.124 21.3343 150.904 20.4052 150.463 19.6006C150.022 18.7768 149.409 18.1446 148.624 17.704C147.838 17.2634 146.967 17.0431 146.009 17.0431C145.032 17.0431 144.151 17.2634 143.365 17.704C142.599 18.1446 141.986 18.7768 141.526 19.6006C141.086 20.4052 140.865 21.3343 140.865 22.3879C140.865 23.4416 141.086 24.3803 141.526 25.204C141.986 26.0086 142.599 26.6408 143.365 27.1006C144.151 27.5412 145.032 27.7615 146.009 27.7615Z" fill="#0F172A"/><path d="M133.928 14.773V27.9339C133.928 30.5967 133.267 32.5603 131.945 33.8247C130.623 35.1082 128.65 35.75 126.025 35.75C124.589 35.75 123.219 35.5489 121.916 35.1466C120.613 34.7634 119.56 34.2079 118.755 33.4799L120.077 31.3534C120.786 31.9665 121.658 32.4454 122.692 32.7902C123.746 33.1542 124.828 33.3362 125.939 33.3362C127.721 33.3362 129.033 32.9148 129.876 32.0718C130.738 31.2289 131.169 29.9454 131.169 28.2213V27.0144C130.518 27.7998 129.713 28.3937 128.755 28.796C127.817 29.1791 126.792 29.3707 125.681 29.3707C124.225 29.3707 122.903 29.0642 121.715 28.4511C120.546 27.819 119.627 26.9473 118.956 25.8362C118.286 24.7059 117.951 23.4224 117.951 21.9856C117.951 20.5489 118.286 19.2749 118.956 18.1638C119.627 17.0335 120.546 16.1619 121.715 15.5489C122.903 14.9358 124.225 14.6293 125.681 14.6293C126.83 14.6293 127.893 14.84 128.87 15.2615C129.866 15.683 130.681 16.3056 131.313 17.1293V14.773H133.928ZM125.997 26.9569C126.993 26.9569 127.884 26.7462 128.669 26.3247C129.474 25.9033 130.096 25.319 130.537 24.5718C130.997 23.8056 131.227 22.9435 131.227 21.9856C131.227 20.5105 130.738 19.3228 129.761 18.4224C128.784 17.5029 127.529 17.0431 125.997 17.0431C124.445 17.0431 123.181 17.5029 122.204 18.4224C121.227 19.3228 120.738 20.5105 120.738 21.9856C120.738 22.9435 120.958 23.8056 121.399 24.5718C121.859 25.319 122.481 25.9033 123.267 26.3247C124.071 26.7462 124.981 26.9569 125.997 26.9569Z" fill="#0F172A"/><path d="M111.046 14.773H113.804V30.0029H111.046V14.773ZM112.425 11.842C111.889 11.842 111.438 11.6695 111.074 11.3247C110.729 10.9799 110.557 10.5584 110.557 10.0603C110.557 9.56226 110.729 9.1408 111.074 8.79598C111.438 8.43199 111.889 8.25 112.425 8.25C112.961 8.25 113.402 8.42241 113.747 8.76724C114.111 9.09291 114.293 9.50479 114.293 10.0029C114.293 10.5201 114.111 10.9607 113.747 11.3247C113.402 11.6695 112.961 11.842 112.425 11.842Z" fill="#0F172A"/><path d="M107.438 29.1121C107.036 29.4569 106.538 29.7251 105.944 29.9167C105.35 30.0891 104.737 30.1753 104.105 30.1753C102.572 30.1753 101.385 29.7634 100.542 28.9397C99.6989 28.1159 99.2774 26.9377 99.2774 25.4052V11.4397H102.036V14.773H106.404V17.0431H102.036V25.2902C102.036 26.114 102.237 26.7462 102.64 27.1868C103.061 27.6274 103.655 27.8477 104.421 27.8477C105.264 27.8477 105.982 27.6082 106.576 27.1293L107.438 29.1121Z" fill="#0F172A"/><path d="M87.7066 14.6293C89.6415 14.6293 91.1741 15.1944 92.3043 16.3247C93.4538 17.4358 94.0285 19.0738 94.0285 21.2385V30.0029H91.2699V21.5546C91.2699 20.0795 90.9154 18.9684 90.2066 18.2213C89.4978 17.4741 88.4825 17.1006 87.1607 17.1006C85.6664 17.1006 84.4882 17.5412 83.6262 18.4224C82.7641 19.2845 82.3331 20.5297 82.3331 22.158V30.0029H79.5745V14.773H82.2181V17.0718C82.7737 16.2864 83.5208 15.683 84.4595 15.2615C85.4174 14.84 86.4997 14.6293 87.7066 14.6293Z" fill="#0F172A"/><path d="M71.2613 14.773H74.02V30.0029H71.2613V14.773ZM72.6406 11.842C72.1042 11.842 71.654 11.6695 71.2901 11.3247C70.9452 10.9799 70.7728 10.5584 70.7728 10.0603C70.7728 9.56226 70.9452 9.1408 71.2901 8.79598C71.654 8.43199 72.1042 8.25 72.6406 8.25C73.177 8.25 73.6177 8.42241 73.9625 8.76724C74.3265 9.09291 74.5085 9.50479 74.5085 10.0029C74.5085 10.5201 74.3265 10.9607 73.9625 11.3247C73.6177 11.6695 73.177 11.842 72.6406 11.842Z" fill="#0F172A"/><path d="M68.3994 14.773L61.7328 30.0029H58.9167L52.25 14.773H55.1236L60.3535 26.9856L65.6983 14.773H68.3994Z" fill="#0F172A"/>`

const SVG_LOGO_BLACK = `<svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12C0 5.37258 5.37258 0 12 0H32C38.6274 0 44 5.37258 44 12V32C44 38.6274 38.6274 44 32 44H12C5.37258 44 0 38.6274 0 32V12Z" fill="black"/>
<path d="M12.375 13.75C17.6907 13.75 22 18.0593 22 23.375C22 18.0593 26.3093 13.75 31.625 13.75H33V20.625C33 25.9407 28.6907 30.25 23.375 30.25H20.625C15.3093 30.25 11 25.9407 11 20.625V13.75H12.375Z" fill="white"/>
${WORDMARK_TEXT}
</svg>`

const SVG_LOGO_INDIGO = `<svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12C0 5.37258 5.37258 0 12 0H32C38.6274 0 44 5.37258 44 12V32C44 38.6274 38.6274 44 32 44H12C5.37258 44 0 38.6274 0 32V12Z" fill="#F1F5F9"/>
<path d="M12.375 13.75C17.6907 13.75 22 18.0593 22 23.375C22 18.0593 26.3093 13.75 31.625 13.75H33V20.625C33 25.9407 28.6907 30.25 23.375 30.25H20.625C15.3093 30.25 11 25.9407 11 20.625V13.75H12.375Z" fill="#4F46E5"/>
${WORDMARK_TEXT}
</svg>`

// ─── Download helpers ──────────────────────────────────────────────────────────

function downloadSvg(svgStr: string, filename: string) {
  const blob = new Blob([svgStr], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadPng(svgStr: string, filename: string, scale = 4) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgStr, 'image/svg+xml')
  const svg = doc.documentElement as unknown as SVGSVGElement
  const w = parseFloat(svg.getAttribute('width') ?? '44')
  const h = parseFloat(svg.getAttribute('height') ?? '44')

  const canvas = document.createElement('canvas')
  canvas.width  = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  const blob  = new Blob([svgStr], { type: 'image/svg+xml' })
  const url   = URL.createObjectURL(blob)
  const img   = new Image()
  img.onload  = () => {
    ctx.drawImage(img, 0, 0, w, h)
    URL.revokeObjectURL(url)
    const a = document.createElement('a')
    a.href     = canvas.toDataURL('image/png')
    a.download = filename
    a.click()
  }
  img.src = url
}

// ─── Logo card ─────────────────────────────────────────────────────────────────

interface LogoCardProps {
  label: string
  description: string
  bg: string
  children: React.ReactNode
  svgStr: string
  svgFilename: string
  pngFilename: string
}

function LogoCard({ label, description, bg, children, svgStr, svgFilename, pngFilename }: LogoCardProps) {
  return (
    <div className="flex flex-col rounded-vintiga-lg border border-vintiga-slate-200 overflow-hidden">
      {/* Preview */}
      <div className={`flex items-center justify-center p-vintiga-2xl ${bg}`}>
        {children}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between gap-vintiga-md px-vintiga-md py-vintiga-sm bg-vintiga-white border-t border-vintiga-slate-200">
        <div className="flex flex-col">
          <span className="typo-body-sm font-semibold text-vintiga-slate-900">{label}</span>
          <span className="typo-caption text-vintiga-slate-500">{description}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => downloadSvg(svgStr, svgFilename)}
            title="Download SVG"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] border border-vintiga-slate-200 bg-vintiga-white typo-caption font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          >
            <DownloadIcon className="w-3 h-3" />
            SVG
          </button>
          <button
            type="button"
            onClick={() => downloadPng(svgStr, pngFilename)}
            title="Download PNG @4x"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] border border-vintiga-slate-200 bg-vintiga-white typo-caption font-semibold text-vintiga-slate-700 hover:bg-vintiga-slate-50 transition-colors cursor-pointer"
          >
            <DownloadIcon className="w-3 h-3" />
            PNG
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export function LogoSection() {
  return (
    <div id="logo" className="flex flex-col gap-vintiga-xl">
      <div>
        <h2 className="typo-title-section font-semibold text-vintiga-slate-900">Logo</h2>
        <p className="typo-body-sm text-vintiga-slate-500 mt-1">
          Official Vintiga logo assets. Use the black variant on light backgrounds, indigo on dark or coloured surfaces.
          Downloads are SVG (vector) and PNG at 4× resolution.
        </p>
      </div>

      {/* Icon-only */}
      <div>
        <h3 className="typo-body-sm font-semibold text-vintiga-slate-700 mb-vintiga-md">Icon only</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
          <LogoCard
            label="Icon — Black"
            description="44 × 44 · Use on white / light backgrounds"
            bg="bg-vintiga-white"
            svgStr={SVG_ICON_BLACK}
            svgFilename="vintiga-icon-black.svg"
            pngFilename="vintiga-icon-black.png"
          >
            <VintigaIconBlack size={64} />
          </LogoCard>

          <LogoCard
            label="Icon — Indigo"
            description="44 × 44 · Use on white / light backgrounds"
            bg="bg-vintiga-white"
            svgStr={SVG_ICON_INDIGO}
            svgFilename="vintiga-icon-indigo.svg"
            pngFilename="vintiga-icon-indigo.png"
          >
            <VintigaIconIndigo size={64} />
          </LogoCard>
        </div>
      </div>

      {/* Full wordmark */}
      <div>
        <h3 className="typo-body-sm font-semibold text-vintiga-slate-700 mb-vintiga-md">Wordmark</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-vintiga-md">
          <LogoCard
            label="Wordmark — Black"
            description="154 × 44 · Use on white / light backgrounds"
            bg="bg-vintiga-white"
            svgStr={SVG_LOGO_BLACK}
            svgFilename="vintiga-logo-black.svg"
            pngFilename="vintiga-logo-black.png"
          >
            <VintigaLogoBlack height={40} />
          </LogoCard>

          <LogoCard
            label="Wordmark — Indigo"
            description="154 × 44 · Use on white / light backgrounds"
            bg="bg-vintiga-white"
            svgStr={SVG_LOGO_INDIGO}
            svgFilename="vintiga-logo-indigo.svg"
            pngFilename="vintiga-logo-indigo.png"
          >
            <VintigaLogoIndigo height={40} />
          </LogoCard>
        </div>
      </div>

      {/* Usage rules */}
      <div className="border border-vintiga-slate-200 rounded-vintiga-lg p-vintiga-lg bg-vintiga-slate-50 flex flex-col gap-vintiga-sm">
        <p className="typo-body-sm font-semibold text-vintiga-slate-900">Usage rules</p>
        <ul className="flex flex-col gap-1 typo-body-sm text-vintiga-slate-600 list-disc list-inside">
          <li>Never recolour the mark — use only the provided colour variants.</li>
          <li>Maintain clear space equal to the height of the "V" glyph on all sides.</li>
          <li>Minimum size: 24 px height for digital, 8 mm for print.</li>
          <li>Do not stretch, rotate, or apply effects to the logo.</li>
        </ul>
      </div>
    </div>
  )
}
