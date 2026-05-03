import React from 'react'

/**
 * ElementMock — canonical visual mocks for every Element_Type in the Mobile Heuristics CSV.
 *
 * Design system (wireframe-fidelity, designed not sketchy):
 *   slate-50/100/200 .... neutral surfaces
 *   slate-300/400/500 .... neutral strokes/placeholders
 *   blue-500 ............ primary target / CTA
 *   violet-500 .......... complex containers (Repeater, Tabs, Accordion, Lightbox)
 *   amber-500 ........... pinned / rule-affected callouts
 *   emerald-500 ......... maps / success
 *   red-500 ............. hidden / error
 *   indigo/purple grad .. "magical" text (Mask, Marquee)
 *
 * Every mock accepts { name, className, fullWidth } and may accept extra props
 * (e.g. `variant`) for state variants that the scene builder passes in.
 */

const ICON = {
  image: 'm2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z',
  play: 'M8 5v14l11-7z',
  code: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
  expand: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15',
  star: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
  check: 'M4.5 12.75l6 6 9-13.5',
  calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
  upload: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3',
  pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
  search: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
  drag: 'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'
}

/** Classify any CSV element_type or wizard element name into one mock type. */
function classify(raw) {
  const n = String(raw || '').toLowerCase().trim()

  // -------- Non-visual: scope selectors / states / DOM-order --------
  if (!n || n === 'any' || n === 'any element' || n === 'any element (exception: vertical line)'
    || n === 'any element (header)' || n === 'any other element'
    || n === 'any container' || n === 'any child element'
    || n === 'any parent' || n === 'all descendants' || n === 'children of above'
    || n.includes('virtual group')) return 'scope'
  if (n === 'any pinned element' || n === 'pinned element' || n.includes('pinned')) return 'pinned'
  if (n.includes('1st element') || n.includes('first element')) return 'domFirst'
  if (n.includes('2nd element') || n.includes('second element')) return 'domSecond'
  if (n.includes('two elements (no hamburger)')) return 'stateHeader2'
  if (n.includes('header row elements')) return 'stateHeaderRow'

  // -------- Text family --------
  if (n.includes('text mask')) return 'textMask'
  if (n.includes('text marquee')) return 'textMarquee'
  if (n === 'rich text') return 'richText'
  if (n === 'collapsible text' || n.includes('collapsible')) return 'collapsible'
  if (n === 'text / button / collapsible') return 'textButtonCollapsible'
  if (n === 'text box (form)') return 'textBoxForm'
  if (n === 'text box' || n === 'text') return 'text'

  // -------- Header composites --------
  if (n === 'logo + hamburger' || n === 'logo + hamburger') return 'stateHeaderLogoHam'
  if (n === 'hamburger menu + shape' || n === 'hamburger menu | shape') return 'stateHeaderHamShape'
  if (n === 'logo component') return 'logoComponent'
  if (n === 'logo') return 'logo'
  if (n.includes('hamburger')) return 'hamburger'
  if (n.includes('breadcrumb')) return 'breadcrumb'
  if (n.includes('site search')) return 'siteSearch'
  if (n.includes('social bar')) return 'social'

  // -------- Media --------
  if (n.includes('transparent video')) return 'videoTransparent'
  if (n.includes('single video player')) return 'videoSingle'
  if (n === 'video box' || n.includes('video')) return 'video'
  if (n.includes('audio player') || n === 'audio') return 'audio'
  if (n.includes('lottie')) return 'lottie'
  if (n.includes('lightbox')) return 'lightbox'
  if (n.includes('google map') || n.includes('maps')) return 'map'
  if (n.includes('custom element')) return 'customElement'
  if (n.includes('embed')) return 'embed'
  if (n === 'image') return 'image'

  // -------- Shapes / lines --------
  if (n.includes('horizontal line')) return 'hline'
  if (n.includes('vertical line')) return 'vline'
  if (n.includes('shape') || n.includes('svg')) return 'shape'

  // -------- Controls / interactive --------
  if (n === 'button' || (n.includes('button') && !n.includes('radio') && !n.includes('upload'))) return 'button'
  if (n.includes('accordion')) return 'accordion'
  if (n === 'tabs') return 'tabs'
  if (n === 'tags') return 'tags'
  if (n === 'sliders' || n === 'slider') return 'slider'
  if (n.includes('progress bar')) return 'progress'
  if (n.includes('rating')) return 'ratings'
  if (n.includes('switch')) return 'switch'

  // -------- Form inputs --------
  if (n.includes('address input')) return 'addressInput'
  if (n.includes('date picker')) return 'datePicker'
  if (n.includes('dropdown') || n.includes('select')) return 'dropdown'
  if (n.includes('multi checkbox')) return 'multiCheckbox'
  if (n.includes('checkbox')) return 'checkbox'
  if (n.includes('radio')) return 'radio'
  if (n.includes('signature')) return 'signature'
  if (n.includes('upload')) return 'upload'
  if (n.includes('recaptcha')) return 'recaptcha'
  if (n.includes('text input')) return 'textInput'

  // -------- Containers --------
  if (n.includes('repeater')) return 'repeater'
  if (n === 'system container' || n === 'system container (header)' || n.includes('system container')) return 'systemContainer'
  if (n.includes('container box (blank)')) return 'boxBlank'
  if (n.includes('container box (with elements)')) return 'boxFilled'
  if (n.includes('container box') || n === 'box') return 'box'
  if (n === 'section') return 'section'
  if (n === 'cell') return 'cell'
  if (n === 'easy grid') return 'easyGrid'
  if (n.includes('header')) return 'header'
  if (n.includes('list item')) return 'listItem'

  return 'generic'
}

export function parseElements(elementType) {
  if (!elementType) return ['Unknown']
  const cleaned = elementType.replace(/\(.*?\)/g, '').replace(/→.*$/g, '').trim()
  if (cleaned.includes('+')) return cleaned.split('+').map(e => e.trim()).filter(Boolean)
  if (cleaned.includes('/')) return cleaned.split('/').map(e => e.trim()).filter(Boolean)
  return [elementType.trim()]
}

export default function ElementMock({ name, className = '', fullWidth = false }) {
  const type = classify(name)
  const fw = fullWidth ? 'w-full' : ''
  const label = name || 'Element'

  switch (type) {
    // ──────────────────────── TEXT ────────────────────────
    case 'text':
      return (
        <div className={`flex flex-col gap-[3px] ${fw || 'w-24'} ${className}`}>
          <div className="h-[5px] bg-slate-500 rounded-sm w-full" />
          <div className="h-[5px] bg-slate-400 rounded-sm w-4/5" />
          <div className="h-[5px] bg-slate-300 rounded-sm w-11/12" />
          <span className="text-[6px] text-slate-400 mt-0.5">Text</span>
        </div>
      )

    case 'richText':
      return (
        <div className={`flex flex-col gap-[3px] ${fw || 'w-28'} ${className}`}>
          <div className="flex gap-[3px] items-center">
            <span className="text-[7px] font-bold text-slate-700">H1</span>
            <div className="h-[6px] bg-slate-700 rounded-sm flex-1" />
          </div>
          <div className="h-[4px] bg-slate-400 rounded-sm w-11/12" />
          <div className="flex gap-[3px]">
            <div className="h-[4px] bg-slate-700 rounded-sm w-1/4" />
            <div className="h-[4px] bg-slate-400 rounded-sm italic w-1/4" />
            <div className="h-[4px] bg-blue-500 rounded-sm underline w-1/2" />
          </div>
          <div className="h-[4px] bg-slate-300 rounded-sm w-3/4" />
          <span className="text-[6px] text-slate-400 mt-0.5">Rich Text</span>
        </div>
      )

    case 'textBoxForm':
      return (
        <div className={`flex flex-col gap-[3px] ${fw || 'w-28'} px-2 py-1.5 bg-blue-50/60 border border-dashed border-blue-200 rounded ${className}`}>
          <div className="h-[5px] bg-slate-500 rounded-sm w-2/3" />
          <div className="h-[4px] bg-slate-300 rounded-sm w-full" />
          <span className="text-[6px] text-blue-500 mt-0.5">Form · helper text</span>
        </div>
      )

    case 'textMask':
      return (
        <div className={`bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-500 rounded px-3 py-2 flex items-center justify-center ${fw || 'w-28'} ${className}`}>
          <span className="text-[8px] text-white font-extrabold tracking-[0.12em]">TEXT MASK</span>
        </div>
      )

    case 'textMarquee':
      return (
        <div className={`${fw || 'w-32'} h-6 bg-slate-900 rounded flex items-center overflow-hidden relative ${className}`}>
          <div className="absolute inset-0 flex items-center whitespace-nowrap animate-[marquee_6s_linear_infinite]">
            <span className="text-[8px] text-amber-300 font-bold tracking-[0.15em] px-2">◂◂ BREAKING · TICKER · LIVE · MARQUEE · NEWS · ◂◂</span>
            <span className="text-[8px] text-amber-300 font-bold tracking-[0.15em] px-2">◂◂ BREAKING · TICKER · LIVE · MARQUEE · NEWS · ◂◂</span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-slate-900 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-slate-900 to-transparent" />
        </div>
      )

    case 'collapsible':
      return (
        <div className={`${fw || 'w-28'} border border-slate-200 bg-white rounded overflow-hidden ${className}`}>
          <div className="px-2 py-1.5">
            <div className="h-[4px] bg-slate-500 rounded-sm w-full mb-1" />
            <div className="h-[4px] bg-slate-300 rounded-sm w-4/5" />
            <div className="mt-1 text-[6px] text-blue-500 font-semibold">Read more ▾</div>
          </div>
        </div>
      )

    case 'textButtonCollapsible':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="flex flex-col gap-[3px] w-16">
            <div className="h-[4px] bg-slate-500 rounded-sm w-full" />
            <div className="h-[4px] bg-slate-300 rounded-sm w-3/4" />
          </div>
          <div className="bg-blue-500 text-white text-[7px] font-semibold px-2 py-0.5 rounded">Btn</div>
          <div className="border border-slate-200 rounded px-1.5 py-0.5 text-[6px] text-slate-500">▾</div>
        </div>
      )

    // ──────────────────────── MEDIA ────────────────────────
    case 'image':
      return (
        <div className={`${fw || 'w-24'} h-16 rounded-md bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center border border-sky-200/60 ${className}`}>
          <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON.image} />
          </svg>
        </div>
      )

    case 'video':
    case 'videoSingle':
      return (
        <div className={`${fw || 'w-28'} h-16 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-3 h-3 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d={ICON.play} />
            </svg>
          </div>
          <div className="absolute bottom-1 right-1.5 h-[3px] bg-white/40 rounded-full w-10" />
          <div className="absolute bottom-1 left-1.5 text-[5px] text-white/70">{type === 'videoSingle' ? 'Video' : 'Video Box'}</div>
        </div>
      )

    case 'videoTransparent':
      return (
        <div
          className={`${fw || 'w-28'} h-16 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-200 ${className}`}
          style={{
            backgroundImage:
              'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0'
          }}
        >
          <div className="w-7 h-7 rounded-full bg-slate-900/70 flex items-center justify-center">
            <svg className="w-3 h-3 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d={ICON.play} />
            </svg>
          </div>
          <span className="absolute bottom-1 left-1.5 text-[5px] text-slate-600 font-semibold">Transparent</span>
        </div>
      )

    case 'audio':
      return (
        <div className={`${fw || 'w-28'} h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center px-2 gap-1.5 ${className}`}>
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d={ICON.play} /></svg>
          </div>
          <div className="flex items-end gap-[1.5px] h-4 flex-1">
            {[3, 6, 4, 9, 5, 7, 4, 8, 5, 3, 7, 4, 9, 6].map((h, i) => (
              <div key={i} className="w-[2px] bg-slate-400 rounded-full" style={{ height: h + 'px' }} />
            ))}
          </div>
          <span className="text-[6px] text-slate-400">0:24</span>
        </div>
      )

    case 'lottie':
      return (
        <div className={`${fw || 'w-24'} h-16 rounded-lg bg-gradient-to-br from-pink-100 via-fuchsia-100 to-violet-100 border border-violet-200/60 flex items-center justify-center relative ${className}`}>
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-fuchsia-400 border-dashed animate-spin" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-1.5 rounded-full bg-fuchsia-500" />
          </div>
          <span className="absolute bottom-1 text-[6px] text-fuchsia-600 font-semibold">Lottie</span>
        </div>
      )

    case 'lightbox':
      return (
        <div className={`${fw || 'w-28'} h-16 border border-dashed border-violet-300 bg-violet-50/50 rounded-lg flex items-center justify-center relative ${className}`}>
          <div className="w-10 h-10 bg-violet-100 rounded border border-violet-200/60 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={ICON.expand} />
            </svg>
          </div>
          <span className="absolute bottom-0.5 left-1 text-[6px] text-violet-500">Lightbox</span>
        </div>
      )

    case 'map':
      return (
        <div className={`${fw || 'w-28'} h-16 rounded-lg border border-emerald-200/60 relative overflow-hidden ${className}`}
          style={{
            backgroundImage:
              'linear-gradient(0deg, #d1fae5 1px, transparent 1px), linear-gradient(90deg, #d1fae5 1px, transparent 1px)',
            backgroundSize: '12px 12px',
            backgroundColor: '#f0fdf4'
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={ICON.pin} />
            </svg>
          </div>
          <span className="absolute bottom-0.5 right-1 text-[6px] text-emerald-600 font-semibold">Maps</span>
        </div>
      )

    case 'embed':
    case 'customElement': {
      const isCustom = type === 'customElement'
      return (
        <div className={`${fw || 'w-28'} h-16 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="text-[7px] font-mono text-emerald-300 whitespace-pre leading-[8px]">
            {'<div>'}
            {'\n  <iframe'}
            {'\n    src="…"'}
            {'\n  />'}
            {'\n</div>'}
          </div>
          <span className="absolute bottom-0.5 right-1 text-[6px] text-slate-400">{isCustom ? 'Custom' : 'Embed'}</span>
        </div>
      )
    }

    // ──────────────────────── SHAPES / LINES ────────────────────────
    case 'hline':
      return (
        <div className={`flex flex-col items-center gap-1 ${fw || 'w-24'} ${className}`}>
          <div className="w-full h-[2px] bg-slate-500 rounded-full" />
          <span className="text-[6px] text-slate-400">H-Line</span>
        </div>
      )
    case 'vline':
      return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
          <div className="w-[2px] h-14 bg-slate-500 rounded-full" />
          <span className="text-[6px] text-slate-400">V-Line</span>
        </div>
      )
    case 'shape':
      return (
        <div className={`${fw || 'w-14'} h-14 bg-indigo-50 rounded-lg border border-dashed border-indigo-200 flex items-center justify-center relative ${className}`}>
          <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
          <span className="absolute bottom-0.5 text-[6px] text-indigo-500">SVG</span>
        </div>
      )

    // ──────────────────────── HEADER PRIMITIVES ────────────────────────
    case 'hamburger':
      return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
          <div className="flex flex-col gap-[3px] w-5">
            <div className="w-full h-[2px] bg-slate-700 rounded-full" />
            <div className="w-full h-[2px] bg-slate-700 rounded-full" />
            <div className="w-full h-[2px] bg-slate-700 rounded-full" />
          </div>
          <span className="text-[6px] text-slate-400">Menu</span>
        </div>
      )

    case 'logo':
      return (
        <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-md px-3 py-1 flex items-center justify-center shadow-sm ${className}`}>
          <span className="text-[7px] text-white font-bold tracking-wide">LOGO</span>
        </div>
      )

    case 'logoComponent':
      return (
        <div className={`relative ${className}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md px-3 py-1 flex items-center justify-center shadow-sm">
            <span className="text-[7px] text-white font-bold tracking-wide">LOGO</span>
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-violet-500 rounded-sm flex items-center justify-center shadow">
            <span className="text-[6px] text-white font-bold leading-none">C</span>
          </div>
        </div>
      )

    case 'breadcrumb':
      return (
        <div className={`flex items-center gap-0.5 ${className}`}>
          <span className="text-[7px] text-blue-500">Home</span>
          <span className="text-[7px] text-slate-300">/</span>
          <span className="text-[7px] text-blue-500">Page</span>
          <span className="text-[7px] text-slate-300">/</span>
          <span className="text-[7px] text-slate-600 font-medium">Current</span>
        </div>
      )

    case 'siteSearch':
      return (
        <div className={`${fw || 'w-32'} h-6 bg-white border border-slate-200 rounded-full flex items-center gap-1 px-2 ${className}`}>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON.search} />
          </svg>
          <span className="text-[7px] text-slate-400">Search…</span>
        </div>
      )

    case 'social':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {['#1DA1F2', '#E4405F', '#0A66C2', '#25D366'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full" style={{ background: c, opacity: 0.85 }} />
          ))}
        </div>
      )

    // ──────────────────────── CONTROLS / INTERACTIVE ────────────────────────
    case 'button':
      return (
        <div className={`bg-blue-500 text-white text-[8px] font-semibold px-4 py-1.5 rounded-md flex items-center justify-center shadow-sm ${fw ? 'w-full' : ''} ${className}`}>
          Button
        </div>
      )

    case 'accordion':
      return (
        <div className={`${fw || 'w-28'} border border-violet-300 bg-white rounded-lg overflow-hidden ${className}`}>
          {['Section 1', 'Section 2', 'Section 3'].map((s, i) => (
            <div key={s} className={`flex items-center justify-between px-2 py-1 ${i === 0 ? 'bg-violet-50' : ''} ${i > 0 ? 'border-t border-violet-200/60' : ''}`}>
              <span className={`text-[6px] ${i === 0 ? 'font-semibold text-violet-700' : 'text-violet-400'}`}>{s}</span>
              <span className="text-[8px] text-violet-400">{i === 0 ? '▾' : '▸'}</span>
            </div>
          ))}
        </div>
      )

    case 'tabs':
      return (
        <div className={`${fw || 'w-28'} border border-violet-300 bg-white rounded-lg overflow-hidden ${className}`}>
          <div className="flex border-b border-violet-200/60 bg-violet-50">
            <div className="px-2 py-1 text-[6px] font-semibold text-violet-700 bg-white border-b-2 border-violet-500">Tab 1</div>
            <div className="px-2 py-1 text-[6px] text-violet-400">Tab 2</div>
            <div className="px-2 py-1 text-[6px] text-violet-400">Tab 3</div>
          </div>
          <div className="p-2 h-8">
            <div className="h-[4px] bg-slate-200 rounded w-full mb-1" />
            <div className="h-[4px] bg-slate-200 rounded w-3/4" />
          </div>
        </div>
      )

    case 'tags':
      return (
        <div className={`flex flex-wrap items-center gap-1 ${className}`}>
          {['Design', 'UX', 'Mobile', 'New'].map((t, i) => (
            <span key={t} className={`text-[6px] px-1.5 py-[2px] rounded-full font-medium ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              {t}
            </span>
          ))}
        </div>
      )

    case 'slider':
      return (
        <div className={`${fw || 'w-24'} flex flex-col gap-1 ${className}`}>
          <div className="relative h-[3px] bg-slate-200 rounded-full">
            <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: '55%' }} />
            <div className="absolute -top-[3px] w-[9px] h-[9px] rounded-full bg-white border-2 border-blue-500 shadow-sm" style={{ left: 'calc(55% - 4px)' }} />
          </div>
          <div className="flex justify-between text-[6px] text-slate-400"><span>0</span><span>55</span><span>100</span></div>
        </div>
      )

    case 'progress':
      return (
        <div className={`${fw || 'w-24'} flex flex-col gap-1 ${className}`}>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-3/5 h-full bg-blue-500 rounded-full" />
          </div>
          <span className="text-[6px] text-slate-400">Progress · 60%</span>
        </div>
      )

    case 'ratings':
      return (
        <div className={`flex items-center gap-0.5 ${className}`}>
          {[0, 1, 2, 3, 4].map(i => (
            <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d={ICON.star} />
            </svg>
          ))}
          <span className="text-[6px] text-slate-400 ml-0.5">4.0</span>
        </div>
      )

    case 'switch':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="w-7 h-4 bg-blue-500 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
          <span className="text-[6px] text-slate-400">Switch</span>
        </div>
      )

    // ──────────────────────── FORM INPUTS ────────────────────────
    case 'textInput':
      return (
        <div className={`${fw || 'w-24'} h-6 bg-white border border-slate-200 rounded-md flex items-center px-2 ${className}`}>
          <span className="text-[7px] text-slate-300">Text input…</span>
          <div className="ml-auto w-[1px] h-3 bg-slate-400 animate-pulse" />
        </div>
      )

    case 'addressInput':
      return (
        <div className={`${fw || 'w-28'} h-6 bg-white border border-slate-200 rounded-md flex items-center gap-1 px-2 ${className}`}>
          <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON.pin} />
          </svg>
          <span className="text-[7px] text-slate-400">123 Main St…</span>
        </div>
      )

    case 'datePicker':
      return (
        <div className={`${fw || 'w-24'} h-6 bg-white border border-slate-200 rounded-md flex items-center gap-1 px-2 ${className}`}>
          <svg className="w-3 h-3 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON.calendar} />
          </svg>
          <span className="text-[7px] text-slate-400">MM / DD / YY</span>
        </div>
      )

    case 'dropdown':
      return (
        <div className={`${fw || 'w-24'} h-6 bg-white border border-slate-200 rounded-md flex items-center justify-between px-2 ${className}`}>
          <span className="text-[7px] text-slate-400">Select…</span>
          <span className="text-[8px] text-slate-400">▾</span>
        </div>
      )

    case 'checkbox':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="w-3 h-3 border-2 border-blue-500 rounded-sm bg-blue-500 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={ICON.check} />
            </svg>
          </div>
          <span className="text-[7px] text-slate-500">Checkbox</span>
        </div>
      )

    case 'multiCheckbox':
      return (
        <div className={`flex flex-col gap-1 ${className}`}>
          {[true, false, true].map((checked, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${checked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                {checked && (
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={ICON.check} />
                  </svg>
                )}
              </div>
              <div className="h-[4px] bg-slate-300 rounded-sm w-10" />
            </div>
          ))}
        </div>
      )

    case 'radio':
      return (
        <div className={`flex flex-col gap-1 ${className}`}>
          {[true, false, false].map((checked, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${checked ? 'border-blue-500' : 'border-slate-300 bg-white'}`}>
                {checked && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </div>
              <div className="h-[4px] bg-slate-300 rounded-sm w-10" />
            </div>
          ))}
        </div>
      )

    case 'signature':
      return (
        <div className={`${fw || 'w-28'} h-10 bg-white border border-slate-200 rounded-md flex items-end p-1 ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
            <path className="text-slate-700" d="M5 22 C 12 10, 22 8, 30 18 S 48 28, 58 12 S 80 22, 95 14" />
            <line className="text-slate-300" x1="2" y1="27" x2="98" y2="27" strokeDasharray="2,2" />
          </svg>
        </div>
      )

    case 'upload':
      return (
        <div className={`flex items-center gap-1 px-3 py-1.5 border-2 border-dashed border-slate-300 rounded-md bg-slate-50 ${fw ? 'w-full justify-center' : ''} ${className}`}>
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON.upload} />
          </svg>
          <span className="text-[7px] text-slate-500 font-medium">Upload file</span>
        </div>
      )

    case 'recaptcha':
      return (
        <div className={`${fw || 'w-32'} h-10 bg-slate-50 border border-slate-300 rounded flex items-center gap-2 px-2 ${className}`}>
          <div className="w-4 h-4 bg-white border-2 border-slate-400 rounded-sm" />
          <span className="text-[7px] text-slate-700 flex-1">I'm not a robot</span>
          <div className="flex flex-col items-center gap-[1px]">
            <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1l3.22 6.966L23 9.26l-5.5 5.362L18.44 22 12 18.27 5.56 22l.94-7.378L1 9.26l7.78-1.294L12 1z" />
            </svg>
            <span className="text-[5px] text-slate-400 font-bold">reCAPTCHA</span>
          </div>
        </div>
      )

    // ──────────────────────── CONTAINERS ────────────────────────
    case 'box':
      return (
        <div className={`${fw || 'w-28'} h-14 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-[7px] text-slate-400 font-medium">Container Box</span>
        </div>
      )

    case 'boxBlank':
      return (
        <div className={`${fw || 'w-28'} h-14 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50/30 ${className}`}>
          <span className="text-[7px] text-slate-300 italic">empty box</span>
        </div>
      )

    case 'boxFilled':
      return (
        <div className={`${fw || 'w-32'} border-2 border-dashed border-slate-300 rounded-lg p-1.5 flex flex-col gap-1 ${className}`}>
          <div className="h-[4px] bg-slate-500 rounded w-3/4" />
          <div className="h-[4px] bg-slate-300 rounded w-full" />
          <div className="mt-0.5 bg-blue-500 text-white text-[6px] font-semibold px-2 py-0.5 rounded self-start">Button</div>
        </div>
      )

    case 'systemContainer':
      return (
        <div className={`${fw || 'w-32'} h-14 rounded-lg border-2 border-dotted border-violet-400 bg-violet-50/40 flex items-center justify-center relative ${className}`}>
          <div className="absolute inset-1.5 border border-dotted border-violet-300 rounded" />
          <div className="relative flex flex-col items-center">
            <span className="text-[7px] text-violet-600 font-bold tracking-wider uppercase">System</span>
            <span className="text-[6px] text-violet-400">background + content layer</span>
          </div>
        </div>
      )

    case 'section':
      return (
        <div className={`${fw || 'w-full'} h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center ${className}`}>
          <span className="text-[8px] text-slate-400 font-semibold tracking-wider">SECTION</span>
        </div>
      )

    case 'cell':
      return (
        <div className={`${fw || 'w-20'} h-14 rounded border border-slate-200 bg-white flex items-center justify-center ${className}`}>
          <span className="text-[6px] text-slate-400">Cell</span>
        </div>
      )

    case 'easyGrid':
      return (
        <div className={`${fw || 'w-32'} grid grid-cols-3 gap-1 p-1 rounded-lg border border-slate-200 bg-slate-50 ${className}`}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-6 rounded bg-white border border-slate-200" />
          ))}
        </div>
      )

    case 'repeater':
      return (
        <div className={`${fw || 'w-32'} border border-violet-300 bg-white rounded-lg p-1.5 flex gap-1 ${className}`}>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-1 bg-violet-50/60 border border-violet-200/60 rounded p-1">
              <div className="h-6 rounded bg-gradient-to-br from-sky-100 to-blue-200" />
              <div className="h-[3px] bg-slate-400 rounded w-full" />
              <div className="h-[3px] bg-slate-300 rounded w-3/4" />
            </div>
          ))}
        </div>
      )

    case 'header':
      return (
        <div className={`${fw || 'w-full'} h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-between px-2 ${className}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded px-1.5 py-0.5">
            <span className="text-[5px] text-white font-bold">LOGO</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-6 h-1 bg-slate-200 rounded-full" />
            <div className="w-6 h-1 bg-slate-200 rounded-full" />
            <div className="w-6 h-1 bg-slate-200 rounded-full" />
          </div>
          <div className="flex flex-col gap-[2px] w-3">
            <div className="w-full h-[1px] bg-slate-400" />
            <div className="w-full h-[1px] bg-slate-400" />
            <div className="w-full h-[1px] bg-slate-400" />
          </div>
        </div>
      )

    case 'listItem':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
          <div className="h-[4px] bg-slate-400 rounded w-16" />
        </div>
      )

    // ──────────────────────── STATES / SCOPES ────────────────────────
    case 'pinned':
      return (
        <div className={`px-2 py-1 border-2 border-dashed border-amber-400 bg-amber-50 rounded-md flex items-center gap-1 ${className}`}>
          <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON.pin} />
          </svg>
          <span className="text-[7px] text-amber-700 font-semibold">Pinned</span>
        </div>
      )

    case 'scope':
      return (
        <div className={`${fw || 'w-24'} h-12 border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-lg flex flex-col items-center justify-center ${className}`}>
          <span className="text-[6px] text-blue-600 font-bold tracking-wider uppercase">Scope</span>
          <span className="text-[7px] text-blue-500 font-medium text-center px-1 leading-tight">{label}</span>
        </div>
      )

    case 'domFirst':
    case 'domSecond': {
      const nth = type === 'domFirst' ? 1 : 2
      return (
        <div className={`relative ${fw || 'w-28'} h-14 border-2 border-blue-400 bg-white rounded-lg flex items-center justify-center ${className}`}>
          <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold shadow">
            {nth}
          </div>
          <span className="text-[7px] text-blue-600 font-semibold">Nth in row (DOM)</span>
        </div>
      )
    }

    case 'stateHeader2':
      return (
        <div className={`${fw || 'w-full'} h-10 bg-white border-2 border-amber-400 rounded-lg flex items-center justify-between px-2 ${className}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded px-1.5 py-0.5">
            <span className="text-[5px] text-white font-bold">LOGO</span>
          </div>
          <div className="bg-blue-500 text-white text-[6px] font-bold px-2 py-0.5 rounded">CTA</div>
          <span className="absolute text-[5px] text-amber-600 font-bold uppercase tracking-wider right-1 top-0.5">state: 2 · no hamburger</span>
        </div>
      )

    case 'stateHeaderLogoHam':
      return (
        <div className={`${fw || 'w-full'} h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-between px-2 ${className}`}>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded px-1.5 py-0.5">
            <span className="text-[5px] text-white font-bold">LOGO</span>
          </div>
          <div className="flex flex-col gap-[2px] w-3">
            <div className="w-full h-[1px] bg-slate-700" />
            <div className="w-full h-[1px] bg-slate-700" />
            <div className="w-full h-[1px] bg-slate-700" />
          </div>
        </div>
      )

    case 'stateHeaderHamShape':
      return (
        <div className={`${fw || 'w-full'} h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-between px-2 ${className}`}>
          <div className="w-6 h-6 bg-indigo-100 border border-indigo-300 rounded" />
          <div className="flex flex-col gap-[2px] w-3">
            <div className="w-full h-[1px] bg-slate-700" />
            <div className="w-full h-[1px] bg-slate-700" />
            <div className="w-full h-[1px] bg-slate-700" />
          </div>
        </div>
      )

    case 'stateHeaderRow':
      return (
        <div className={`${fw || 'w-full'} h-10 bg-white border border-slate-200 rounded-lg grid grid-cols-4 gap-1 p-1 relative ${className}`}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-[5px] text-slate-400">•</span>
            </div>
          ))}
          <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[5px] font-bold px-1.5 py-[1px] rounded-full">header row</div>
        </div>
      )

    // ──────────────────────── DEFAULT ────────────────────────
    default:
      return (
        <div className={`${fw || 'w-20'} h-12 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center ${className}`}>
          <span className="text-[7px] text-blue-400 font-medium text-center px-1 leading-tight">{label}</span>
        </div>
      )
  }
}

export function HiddenMock({ name }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border-2 border-dashed border-red-200 rounded-lg opacity-70">
      <span className="text-red-500 text-xs font-bold">✕</span>
      <span className="text-[8px] text-red-500 font-medium">{name || 'Hidden'}</span>
    </div>
  )
}

export function Annotation({ children, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-500',
    green: 'text-emerald-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    slate: 'text-slate-500',
    violet: 'text-violet-500'
  }
  return (
    <div className={`text-[8px] font-medium mt-1.5 text-center ${colors[color] || colors.blue}`}>
      {children}
    </div>
  )
}

export function PaddingIndicator({ lr = 24, children }) {
  return (
    <div className="relative w-full" style={{ padding: `0 ${Math.min(lr, 20)}px` }}>
      <div
        className="absolute left-0 top-0 bottom-0 bg-blue-500/8 border-r border-dashed border-blue-300 flex items-end justify-end pb-0.5 pr-0.5"
        style={{ width: Math.min(lr, 20) }}
      >
        <span className="text-[5px] text-blue-500">{lr}</span>
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 bg-blue-500/8 border-l border-dashed border-blue-300 flex items-end justify-start pb-0.5 pl-0.5"
        style={{ width: Math.min(lr, 20) }}
      >
        <span className="text-[5px] text-blue-500">{lr}</span>
      </div>
      {children}
    </div>
  )
}

export function MarginIndicator({ top, bottom, children }) {
  return (
    <div className="flex flex-col items-center w-full">
      {top && (
        <div
          className="w-4/5 bg-emerald-500/8 border-b border-dashed border-emerald-300 flex items-center justify-center"
          style={{ height: Math.min(top / 2, 16) }}
        >
          <span className="text-[5px] text-emerald-500">{top}px</span>
        </div>
      )}
      {children}
      {bottom && (
        <div
          className="w-4/5 bg-emerald-500/8 border-t border-dashed border-emerald-300 flex items-center justify-center"
          style={{ height: Math.min(bottom / 2, 16) }}
        >
          <span className="text-[5px] text-emerald-500">{bottom}px</span>
        </div>
      )}
    </div>
  )
}
