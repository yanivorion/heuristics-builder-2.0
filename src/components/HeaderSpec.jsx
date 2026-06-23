import React, { useState, useEffect, useRef } from 'react'
import { HEADER_SEED_DATA } from '../headerSeedData'
import { SEED_DATA } from '../seedData'

// ── Mermaid bootstrap ─────────────────────────────────────────────────
let mermaid = null
const mermaidReady = new Promise((resolve) => {
  if (window.mermaid) { mermaid = window.mermaid; resolve(); return }
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
  script.onload = () => { mermaid = window.mermaid; mermaid.initialize({ startOnLoad: false, theme: 'base' }); resolve() }
  script.onerror = () => resolve()
  document.head.appendChild(script)
})

let renderCounter = 0

function MermaidChart({ id, chart }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (!ref.current) return
    let cancelled = false
    async function render() {
      await mermaidReady
      if (!mermaid || cancelled) return
      try {
        renderCounter++
        const uid = `hdr_${id.replace(/[^a-zA-Z0-9]/g, '_')}_${renderCounter}`
        const { svg } = await mermaid.render(uid, chart)
        if (!cancelled && ref.current) { ref.current.innerHTML = svg; setError(null) }
      } catch (e) { if (!cancelled) setError(String(e.message || e)) }
    }
    render()
    return () => { cancelled = true }
  }, [id, chart])
  if (error) return <div style={{ color: '#dc2626', fontSize: 11, padding: 12 }}>Render error: {error}</div>
  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }} />
}

const ICONS = {
  order:  'https://media.base44.com/images/public/69e443859428256538e445b7/f6e46d698_Order.svg',
  search: 'https://media.base44.com/images/public/69e443859428256538e445b7/4f82087f3_Search.svg',
  menu:   'https://media.base44.com/images/public/69e443859428256538e445b7/bcb87ffe9_Menu.svg',
  frame:  'https://media.base44.com/images/public/69e443859428256538e445b7/d426738aa_Frame95.svg',
  login:  'https://media.base44.com/images/public/69e443859428256538e445b7/6c656b5f3_Avatar.svg',
}

// ── Visual Header Layout ───────────────────────────────────────────────
function HeaderLayoutViz() {
  return (
    <div style={{ padding: '24px 0', fontFamily: '-apple-system, sans-serif' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <img src={ICONS.frame} alt="Logo" style={{ maxHeight: 48, height: 'auto' }} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, textAlign: 'center' }}>
        Mobile Header Layout — Super Grid (LTR)
      </div>

      {/* Phone frame */}
      <div style={{ maxWidth: 340, margin: '0 auto' }}>
        <div style={{
          border: '2px solid #334155', borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          {/* Status bar */}
          <div style={{ background: '#1e293b', height: 12, width: '100%' }} />

          {/* Header bar */}
          <div style={{
            background: '#fff', borderBottom: '1px solid #e2e8f0',
            height: 56, display: 'flex', alignItems: 'center',
          }}>
            {/* Left: Logo */}
            <div style={{ marginLeft: 24, flex: '0 0 auto' }}>
              <img src={ICONS.frame} alt="Logo" style={{ height: 32, width: 'auto' }} />
            </div>

            <div style={{ flex: 1 }} />

            {/* Right: Search + Order + Login + Menu */}
            <div style={{ marginRight: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src={ICONS.search} alt="Search" style={{ width: 20, height: 20 }} />
              <img src={ICONS.order}  alt="Order" style={{ width: 20, height: 20 }} />
              <img src={ICONS.login}  alt="Login" style={{ width: 20, height: 20 }} />
              <img src={ICONS.menu}   alt="Menu" style={{ width: 20, height: 20 }} />
            </div>
          </div>

          {/* Page content placeholder */}
          <div style={{ background: '#f8fafc', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: 10, background: '#e2e8f0', borderRadius: 4 }} />
          </div>
        </div>

        {/* Annotations */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { color: '#00e6b8', label: 'Logo', desc: 'Left-aligned · Margin Left: 24px', icon: ICONS.frame },
            { label: 'Search', desc: 'Right group · icon only on mobile', icon: ICONS.search },
            { label: 'Order / Cart', desc: 'Right group', icon: ICONS.order },
            { label: 'Login / Avatar', desc: 'Right group · 40×40px on mobile', icon: ICONS.login },
            { label: 'Hamburger', desc: 'Right-most · defined by owners', icon: ICONS.menu },
          ].map(a => (
            <div key={a.label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px',
            }}>
              {a.icon
                ? <img src={a.icon} alt={a.label} style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
                : <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
              }
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{a.label}</div>
                <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid anatomy */}
      <div style={{ maxWidth: 460, margin: '24px auto 0', padding: '0 8px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, textAlign: 'center' }}>
          Super Grid Cell Anatomy
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          border: '1.5px solid #334155', borderRadius: 8, overflow: 'hidden',
        }}>
          {[
            { label: 'Cell A', align: 'left', bg: '#f0fdf4', icons: [ICONS.frame] },
            { label: 'Cell B', content: 'Nav / Menu', align: 'center', bg: '#f8fafc' },
            {
              label: 'Cell C', align: 'right', bg: '#eff6ff',
              icons: [ICONS.search, ICONS.order, ICONS.login, ICONS.menu]
            },
          ].map((cell, i) => (
            <div key={cell.label} style={{
              background: cell.bg, borderRight: i < 2 ? '1px solid #e2e8f0' : 'none',
              padding: '10px 8px', textAlign: cell.align,
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{cell.label}</div>
              {cell.icons ? (
                <div style={{ display: 'flex', justifyContent: cell.align === 'right' ? 'flex-end' : 'flex-start', gap: 6, marginBottom: 4 }}>
                  {cell.icons.map((ic, idx) => <img key={idx} src={ic} alt="" style={{ width: 14, height: 14 }} />)}
                </div>
              ) : (
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{cell.content}</div>
              )}
              <div style={{ fontSize: 9, color: '#64748b' }}>Align: {cell.align}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, padding: '0 4px' }}>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>← Margin Left: 24px</div>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>Margin Right: 24px →</div>
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/"/g, '#quot;').replace(/\n/g, ' ') }

const OP_COLORS = {
  'Set Size':       { bg: '#EEF2FF', stroke: '#4F46E5', color: '#4F46E5' },
  'Set Alignment':  { bg: '#FAF5FF', stroke: '#9333EA', color: '#9333EA' },
  'Set Margin':     { bg: '#ECFDF5', stroke: '#059669', color: '#059669' },
  'Set Padding':    { bg: '#F0FDFA', stroke: '#0D9488', color: '#0D9488' },
  'Set Pinned':     { bg: '#FFFBEB', stroke: '#D97706', color: '#D97706' },
  'Set Visibility': { bg: '#FEF2F2', stroke: '#DC2626', color: '#DC2626' },
}

function nodeClass(action) { return action.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') }

function buildChart(title, rules) {
  const lines = ['flowchart TD']
  const usedOps = new Set()
  const classAssignments = []
  lines.push(`  START(["<b>${esc(title)}</b>"])`)
  rules.forEach((r, i) => {
    const nodeId = `R${i}`; const condId = `C${i}`; const outId = `O${i}`
    const when = r.when || 'Any'
    const cond = r.if || 'Any'
    const action = r.action || '—'
    const params = r.parameters || '—'
    const condLabel = cond === 'Any' ? 'Any condition' : esc(cond)
    lines.push(`  START --> ${nodeId}["${esc(when)}"]`)
    lines.push(`  ${nodeId} --> ${condId}{{"${condLabel}"}}`)
    const outLabel = params !== '—' ? `${esc(action)}\\n${esc(params)}` : esc(action)
    lines.push(`  ${condId} -->|Yes| ${outId}["${outLabel}"]`)
    usedOps.add(action)
    classAssignments.push(`class ${outId} ${nodeClass(action)}`)
  })
  for (const op of usedOps) {
    const c = OP_COLORS[op] || { bg: '#F8FAFC', stroke: '#64748B', color: '#64748B' }
    lines.push(`classDef ${nodeClass(op)} fill:${c.bg},stroke:${c.stroke},color:${c.color}`)
  }
  lines.push(classAssignments.join('\n'))
  return lines.join('\n')
}

// ── Spec table helpers ─────────────────────────────────────────────────
function SpecSection({ number, title, desc, cols, rows }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#00e6b8', color: '#000',
          fontSize: 12, fontWeight: 700, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{String(number).padStart(2, '0')}</span>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#000', margin: 0,
          background: '#e8e8e8', padding: '6px 14px', borderRadius: 4, width: '100%',
        }}>{title}</h3>
      </div>
      <div style={{ paddingLeft: 36 }}>
        {desc && <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 14, maxWidth: 680 }}>{desc}</p>}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#707070', color: '#fff' }}>
              {cols.map(col => (
                <th key={col} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, borderRight: '1px solid rgba(255,255,255,0.15)' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px 14px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: j === 0 ? '#333' : '#555', fontWeight: j === 0 ? 600 : 400, fontSize: 12 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatPill({ label, value, color = '#00e6b8' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#fff', border: '1px solid #e0e0e0',
      borderRadius: 6, padding: '5px 12px', marginRight: 8, marginBottom: 8,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{value}</span>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────
const H = HEADER_SEED_DATA

// Also pull header-relevant rules from main seedData (hamburger sizing, logo, etc.)
const MAIN_HEADER_RULES = SEED_DATA.filter(r => r.category === 'Header & Menu').sort((a, b) => a.rule_id - b.rule_id)

const DIAGRAM_GROUPS = [
  {
    key: 'grid-layout',
    title: 'Super Grid & Cell Layout',
    rules: H.filter(r => r.category === 'Header Grid'),
  },
  {
    key: 'header-size',
    title: 'Header Size & Docking',
    rules: [...H.filter(r => r.category === 'Header Size' || r.category === 'Header Docking'), ...H.filter(r => r.category === 'Header Layout')],
  },
  {
    key: 'element-position',
    title: 'Element Positioning (Logo, Menu, Login, Search)',
    rules: MAIN_HEADER_RULES.filter(r =>
      ['Logo', 'Logo Component', 'Hamburger Menu', 'Logo + Hamburger', 'Two Elements (no hamburger)', '1st Element in Row', '2nd Element in Row', 'Header Row Elements', 'Any Other Element'].includes(r.when)
    ),
  },
].filter(g => g.rules.length > 0)
 .map(g => ({ ...g, chart: buildChart(g.title, g.rules) }))

const SPEC_SECTIONS = [
  {
    title: 'Header Height',
    desc: 'The header auto-sizes when it contains elements. A blank header falls back to a fixed 70px.',
    cols: ['State', 'Mobile Height', 'Note'],
    rows: [
      ['Blank (no elements)', '70px', 'Minimum enforced height'],
      ['Contains elements', 'Auto', 'Height driven by tallest element'],
      ['Nested containers (blank)', '70px', 'Same rule applied recursively'],
    ]
  },
  {
    title: 'Super Grid — Structure',
    desc: 'The header Super Grid preserves its horizontal row structure on mobile — rows never wrap into columns.',
    cols: ['Property', 'Behaviour'],
    rows: [
      ['Row wrapping', 'Never — always horizontal'],
      ['Empty cells', 'Hidden (Set Visibility: Hide)'],
      ['Cell width', 'Equal distribution across all cells'],
      ['Cell vertical align', 'Center'],
      ['Section padding > 0', 'Padding: 24px each edge'],
      ['Cell padding', 'Always reset to 0px'],
    ]
  },
  {
    title: 'Logo — Position & Size',
    desc: 'The logo always anchors to the left in LTR layouts. Its size uses an aspect-ratio-preserving rule to fit the 70px header height.',
    cols: ['Property', 'Desktop', 'Mobile'],
    rows: [
      ['Horizontal position', 'Any', 'Left-aligned (most left side)'],
      ['Margin Left', 'Any', '24px (when section padding = 0)'],
      ['Height', 'Any', '70px (aspect ratio preserved)'],
      ['Width', 'Fixed', 'Auto (from aspect ratio)'],
    ]
  },
  {
  title: 'Hamburger Menu — Size & Position',
  desc: 'The hamburger is always placed at the far right of the header. Its size is decided by the component — we do not set or override it.',
  cols: ['Property', 'Mobile Value'],
  rows: [
    ['Width', <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#FFF7ED', color: '#EA580C', border: '1px solid #FDBA7480' }}>Defined by owners</span>],
    ['Height', <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#FFF7ED', color: '#EA580C', border: '1px solid #FDBA7480' }}>Defined by owners</span>],
    ['Horizontal position', 'Rightmost'],
    ['Vertical position', 'Centered in header row'],
  ]
  },
  {
    title: 'Search & Login — Position',
    desc: 'Search, Login, and Cart icons share the right-side cell of the Super Grid. They align to the far right with a 24px outer margin when header padding is 0. DOM order determines priority — the last element in the DOM is the rightmost visually.',
    cols: ['Element', 'Alignment', 'Margin (padding = 0)'],
    rows: [
      ['Search icon', 'Right side (most right)', 'Margin Right: 24px (shared cell)'],
      ['Login icon / avatar', 'Right side (most right)', 'Margin Right: 24px (shared cell)'],
      ['Cart icon', 'Right side (most right)', 'Margin Right: 24px (shared cell)'],
    ]
  },
  {
    title: 'Two-Element Header Row Rules',
    desc: 'When the first header row has exactly 2 or 3 elements, specific margin/alignment rules apply per element type.',
    cols: ['Scenario', 'Element', 'Margin / Align'],
    rows: [
      ['Logo + Hamburger only', 'Logo', 'Margin Left: 20px'],
      ['Logo + Hamburger only', 'Hamburger', 'Margin Right: 20px'],
      ['2 elements, no hamburger', '1st element', 'Margin Left: 20px · Align Left'],
      ['2 elements, no hamburger', '2nd element', 'Margin Right: 20px · Align Right'],
      ['< 3 elements in row', '1st element', 'Margin Left: 20px · Align Left'],
      ['< 3 elements in row', '2nd element', 'Margin Right: 20px · Align Right'],
      ['≥ 3 elements', 'Hamburger', 'Margin Left: 20px'],
      ['≥ 3 elements', 'All others', 'Move to next row · Align Center'],
    ]
  },
  {
    title: 'Docking & Sticky Behaviour',
    desc: 'Header docking (sticky/fixed scroll behaviour) is preserved on mobile if it was applied on desktop.',
    cols: ['Desktop State', 'Mobile Behaviour'],
    rows: [
      ['Docking applied', 'Preserved — stays sticky on scroll'],
      ['No docking', 'Static — scrolls with page'],
      ['Stretched layout', 'Apply standard section heuristics'],
    ]
  },
]

// ── Main component ────────────────────────────────────────────────────
export default function HeaderSpec() {
  const [view, setView] = useState('visual')

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Header — Mobile Transformation Specification
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 680, lineHeight: 1.6 }}>
          How the header Super Grid, Logo, Hamburger, Search, Login, and Cart elements
          transform for mobile — layout, sizing, alignment, margins, and docking behaviour.
        </div>
        <div>
          <StatPill label="Header rules" value={String(H.length)} />
          <StatPill label="Element rules" value={String(MAIN_HEADER_RULES.length)} color="#4a90e2" />
          <StatPill label="Elements covered" value="6" color="#f5a623" />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 0, marginTop: 20, borderBottom: '1px solid #e2e8f0' }}>
          {[
            { key: 'visual', label: 'Visual Layout' },
            { key: 'spec', label: 'Spec Tables' },
            { key: 'diagrams', label: 'Decision Diagrams' },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} style={{
              padding: '8px 18px', fontSize: 13,
              fontWeight: view === v.key ? 600 : 400,
              color: view === v.key ? '#0f172a' : '#64748b',
              background: 'transparent', border: 'none',
              borderBottom: view === v.key ? '2px solid #00e6b8' : '2px solid transparent',
              cursor: 'pointer', marginBottom: -1,
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* Visual Layout */}
      {view === 'visual' && <HeaderLayoutViz />}

      {/* Spec Tables */}
      {view === 'spec' && SPEC_SECTIONS.map((s, i) => (
        <SpecSection key={i} number={i + 1} {...s} />
      ))}

      {/* Decision Diagrams */}
      {view === 'diagrams' && DIAGRAM_GROUPS.map((d, di) => (
        <div key={d.key} style={{
          marginBottom: 32, background: '#fff',
          border: '1px solid #e2e8f0', borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 20px', borderBottom: '1px solid #f1f5f9', background: '#fafbfc',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 6,
              background: '#00e6b8', color: '#000',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{String(di + 1).padStart(2, '0')}</span>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{d.title}</h3>
              <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em' }}>
                {d.rules.length} rule{d.rules.length > 1 ? 's' : ''} · IDs {d.rules.map(r => r.rule_id).join(', ')}
              </span>
            </div>
          </div>
          <div style={{ padding: '20px 16px', background: '#f9f9fb' }}>
            <MermaidChart id={d.key} chart={d.chart} />
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Element', 'Condition', 'Action', 'Parameters'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.rules.map((r, i) => {
                  const c = OP_COLORS[r.action] || { bg: '#f8fafc', color: '#64748b' }
                  return (
                    <tr key={r.rule_id} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '7px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{r.rule_id}</td>
                      <td style={{ padding: '7px 16px', fontSize: 11, color: '#334155' }}>{r.when}</td>
                      <td style={{ padding: '7px 16px', fontSize: 11, color: '#334155' }}>{r.if || 'Any'}</td>
                      <td style={{ padding: '7px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.color}40` }}>
                          {r.action}
                        </span>
                      </td>
                      <td style={{ padding: '7px 16px', fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>{r.parameters || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}