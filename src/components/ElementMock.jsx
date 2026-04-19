import React from 'react'

export function parseElements(elementType) {
  if (!elementType) return ['Unknown']
  const cleaned = elementType
    .replace(/\(.*?\)/g, '')
    .replace(/→.*$/g, '')
    .trim()

  if (cleaned.includes('+')) {
    return cleaned.split('+').map(e => e.trim()).filter(Boolean)
  }
  if (cleaned.includes('/')) {
    return cleaned.split('/').map(e => e.trim()).filter(Boolean)
  }
  return [elementType.trim()]
}

function classify(name) {
  const n = name.toLowerCase()
  if (n.includes('text mask') || n.includes('text marquee')) return 'textMask'
  if (n.includes('text box') || n === 'rich text' || n.includes('text input')) return 'text'
  if (n.includes('image')) return 'image'
  if (n.includes('button') && !n.includes('radio') && !n.includes('upload')) return 'button'
  if (n.includes('horizontal line')) return 'hline'
  if (n.includes('vertical line')) return 'vline'
  if (n.includes('hamburger')) return 'hamburger'
  if (n.includes('shape') || n.includes('svg')) return 'shape'
  if (n.includes('social bar')) return 'social'
  if (n.includes('logo')) return 'logo'
  if (n.includes('video') || n.includes('lottie') || n.includes('audio')) return 'video'
  if (n.includes('google map') || n.includes('maps')) return 'map'
  if (n.includes('custom element') || n.includes('embed')) return 'embed'
  if (n.includes('repeater')) return 'repeater'
  if (n.includes('lightbox')) return 'lightbox'
  if (n.includes('tabs')) return 'tabs'
  if (n.includes('accordion')) return 'accordion'
  if (n.includes('collapsible')) return 'collapsible'
  if (n.includes('container box') || (n.includes('box') && !n.includes('text'))) return 'box'
  if (n.includes('system container')) return 'container'
  if (n.includes('header')) return 'header'
  if (n.includes('pinned')) return 'pinned'
  if (n.includes('progress bar')) return 'progress'
  if (n.includes('breadcrumb')) return 'breadcrumb'
  if (n.includes('slider') || n.includes('switch') || n.includes('toggle')) return 'toggle'
  if (n.includes('dropdown') || n.includes('select')) return 'dropdown'
  if (n.includes('checkbox') || n.includes('radio')) return 'checkbox'
  if (n.includes('date picker') || n.includes('signature') || n.includes('recaptcha')
    || n.includes('rating') || n.includes('tag') || n.includes('upload')
    || n.includes('address') || n.includes('site search')) return 'formInput'
  if (n.includes('all descendants') || n.includes('any element') || n.includes('any parent')
    || n.includes('children')) return 'generic'
  return 'generic'
}

export default function ElementMock({ name, className = '', fullWidth = false }) {
  const type = classify(name)
  const fw = fullWidth ? 'w-full' : ''

  switch (type) {
    case 'text':
      return (
        <div className={`flex flex-col gap-[3px] ${fw || 'w-24'} ${className}`}>
          <div className="h-[5px] bg-slate-500 rounded-sm w-full" />
          <div className="h-[5px] bg-slate-400 rounded-sm w-4/5" />
          <div className="h-[5px] bg-slate-300 rounded-sm w-11/12" />
          <span className="text-[6px] text-slate-400 mt-0.5">Text</span>
        </div>
      )

    case 'textMask':
      return (
        <div className={`bg-gradient-to-r from-indigo-500 to-purple-500 rounded px-4 py-2 flex items-center justify-center ${fw} ${className}`}>
          <span className="text-[8px] text-white font-bold tracking-[0.12em]">TEXT MASK</span>
        </div>
      )

    case 'image':
      return (
        <div className={`${fw || 'w-24'} h-16 rounded-md bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center border border-sky-200/60 ${className}`}>
          <svg className="w-5 h-5 text-sky-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
      )

    case 'button':
      return (
        <div className={`bg-blue-500 text-white text-[8px] font-semibold px-4 py-1.5 rounded-md flex items-center justify-center shadow-sm ${fw ? 'w-full' : ''} ${className}`}>
          Button
        </div>
      )

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

    case 'shape':
      return (
        <div className={`${fw || 'w-14'} h-14 bg-indigo-50 rounded-lg border border-dashed border-indigo-200 flex items-center justify-center ${className}`}>
          <svg className="w-5 h-5 text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12l10 10 10-10z" />
          </svg>
        </div>
      )

    case 'social':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          {['#1DA1F2', '#E4405F', '#0A66C2', '#25D366'].map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
          <span className="text-[6px] text-slate-400 ml-0.5">Social</span>
        </div>
      )

    case 'logo':
      return (
        <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-md px-3 py-1 flex items-center justify-center shadow-sm ${className}`}>
          <span className="text-[7px] text-white font-bold tracking-wide">LOGO</span>
        </div>
      )

    case 'video':
      return (
        <div className={`${fw || 'w-28'} h-18 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-3 h-3 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="absolute bottom-1 left-1.5">
            <span className="text-[6px] text-white/60">{name}</span>
          </div>
        </div>
      )

    case 'map':
      return (
        <div className={`${fw || 'w-28'} h-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-emerald-200/60 flex items-center justify-center ${className}`}>
          <span className="text-lg opacity-30">📍</span>
        </div>
      )

    case 'embed':
      return (
        <div className={`${fw || 'w-28'} h-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center ${className}`}>
          <div className="flex flex-col items-center gap-0.5">
            <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            <span className="text-[6px] text-slate-400">{name}</span>
          </div>
        </div>
      )

    case 'repeater':
      return (
        <div className={`${fw || 'w-28'} border border-dashed border-violet-300 bg-violet-50/50 rounded-lg flex items-center p-1.5 gap-1 ${className}`}>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 h-8 bg-violet-100 rounded border border-violet-200/60" />
          ))}
        </div>
      )

    case 'lightbox':
      return (
        <div className={`${fw || 'w-28'} h-16 border border-dashed border-violet-300 bg-violet-50/50 rounded-lg flex items-center justify-center relative ${className}`}>
          <div className="w-10 h-10 bg-violet-100 rounded border border-violet-200/60 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
        </div>
      )

    case 'tabs':
      return (
        <div className={`${fw || 'w-28'} border border-dashed border-violet-300 bg-violet-50/50 rounded-lg overflow-hidden ${className}`}>
          <div className="flex border-b border-violet-200/60">
            <div className="px-2 py-1 text-[6px] font-semibold text-violet-600 border-b-2 border-violet-500 bg-white/60">Tab 1</div>
            <div className="px-2 py-1 text-[6px] text-violet-400">Tab 2</div>
            <div className="px-2 py-1 text-[6px] text-violet-400">Tab 3</div>
          </div>
          <div className="p-2 h-8" />
        </div>
      )

    case 'accordion':
      return (
        <div className={`${fw || 'w-28'} border border-dashed border-violet-300 bg-violet-50/50 rounded-lg overflow-hidden ${className}`}>
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-violet-200/60 bg-white/40">
            <span className="text-[6px] font-medium text-violet-600">Section 1</span>
            <span className="text-[8px] text-violet-400">▾</span>
          </div>
          <div className="px-2 py-1 h-6" />
          <div className="flex items-center justify-between px-2 py-1.5 border-t border-violet-200/60">
            <span className="text-[6px] text-violet-400">Section 2</span>
            <span className="text-[8px] text-violet-400">▸</span>
          </div>
        </div>
      )

    case 'collapsible':
      return (
        <div className={`${fw || 'w-24'} border border-slate-200 bg-white rounded-md overflow-hidden ${className}`}>
          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50">
            <span className="text-[7px] font-medium text-slate-600">Collapsible</span>
            <span className="text-[8px] text-slate-400">▾</span>
          </div>
        </div>
      )

    case 'box':
      return (
        <div className={`${fw || 'w-28'} h-14 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-[7px] text-slate-300 font-medium">Box</span>
        </div>
      )

    case 'container':
      return (
        <div className={`${fw || 'w-32'} h-16 border border-slate-200 bg-blue-50/30 rounded-lg flex items-center justify-center ${className}`}>
          <span className="text-[7px] text-slate-400 font-medium">Container</span>
        </div>
      )

    case 'header':
      return (
        <div className={`${fw || 'w-full'} h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between px-2 ${className}`}>
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

    case 'pinned':
      return (
        <div className={`w-18 h-10 border-2 border-dashed border-amber-300 bg-amber-50 rounded-lg flex items-center justify-center gap-1 ${className}`}>
          <span className="text-sm">📌</span>
          <span className="text-[6px] text-amber-600 font-medium">Pinned</span>
        </div>
      )

    case 'progress':
      return (
        <div className={`${fw || 'w-24'} flex flex-col gap-1 ${className}`}>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-3/5 h-full bg-blue-500 rounded-full" />
          </div>
          <span className="text-[6px] text-slate-400">Progress Bar</span>
        </div>
      )

    case 'breadcrumb':
      return (
        <div className={`flex items-center gap-0.5 ${className}`}>
          <span className="text-[7px] text-blue-500">Home</span>
          <span className="text-[7px] text-slate-300">/</span>
          <span className="text-[7px] text-blue-500">Page</span>
          <span className="text-[7px] text-slate-300">/</span>
          <span className="text-[7px] text-slate-500">Current</span>
        </div>
      )

    case 'toggle':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="w-7 h-4 bg-blue-500 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
          <span className="text-[6px] text-slate-400">{name}</span>
        </div>
      )

    case 'dropdown':
      return (
        <div className={`${fw || 'w-24'} h-6 bg-white border border-slate-200 rounded-md flex items-center justify-between px-2 ${className}`}>
          <span className="text-[7px] text-slate-400">Select...</span>
          <span className="text-[8px] text-slate-300">▾</span>
        </div>
      )

    case 'checkbox':
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <div className="w-3 h-3 border-2 border-blue-500 rounded-sm bg-blue-500 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-[7px] text-slate-500">{name}</span>
        </div>
      )

    case 'formInput':
      return (
        <div className={`${fw || 'w-24'} h-6 bg-white border border-slate-200 rounded-md flex items-center px-2 ${className}`}>
          <span className="text-[7px] text-slate-300">{name}</span>
        </div>
      )

    default:
      return (
        <div className={`${fw || 'w-20'} h-12 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center ${className}`}>
          <span className="text-[7px] text-blue-400 font-medium text-center px-1 leading-tight">{name}</span>
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
    violet: 'text-violet-500',
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
      <div className="absolute left-0 top-0 bottom-0 bg-blue-500/8 border-r border-dashed border-blue-300 flex items-end justify-end pb-0.5 pr-0.5"
        style={{ width: Math.min(lr, 20) }}>
        <span className="text-[5px] text-blue-500">{lr}</span>
      </div>
      <div className="absolute right-0 top-0 bottom-0 bg-blue-500/8 border-l border-dashed border-blue-300 flex items-end justify-start pb-0.5 pl-0.5"
        style={{ width: Math.min(lr, 20) }}>
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
        <div className="w-4/5 bg-emerald-500/8 border-b border-dashed border-emerald-300 flex items-center justify-center"
          style={{ height: Math.min(top / 2, 16) }}>
          <span className="text-[5px] text-emerald-500">{top}px</span>
        </div>
      )}
      {children}
      {bottom && (
        <div className="w-4/5 bg-emerald-500/8 border-t border-dashed border-emerald-300 flex items-center justify-center"
          style={{ height: Math.min(bottom / 2, 16) }}>
          <span className="text-[5px] text-emerald-500">{bottom}px</span>
        </div>
      )}
    </div>
  )
}
