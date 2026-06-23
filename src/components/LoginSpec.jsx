import React, { useEffect, useRef, useState } from 'react'
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
        const uniqueId = `login_${id.replace(/[^a-zA-Z0-9]/g, '_')}_${renderCounter}`
        const { svg } = await mermaid.render(uniqueId, chart)
        if (!cancelled && ref.current) { ref.current.innerHTML = svg; setError(null) }
      } catch (e) { if (!cancelled) setError(String(e.message || e)) }
    }
    render()
    return () => { cancelled = true }
  }, [id, chart])

  if (error) return <div style={{ color: '#dc2626', fontSize: 11, padding: 12 }}>Render error: {error}</div>
  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }} />
}

// ── Helpers ──────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/"/g, '#quot;').replace(/\n/g, ' ') }

const OP_COLORS = {
  'Set Size':       { bg: '#EEF2FF', stroke: '#4F46E5', color: '#4F46E5' },
  'Set Visibility': { bg: '#FEF2F2', stroke: '#DC2626', color: '#DC2626' },
  'Set OOG':        { bg: '#FFF7ED', stroke: '#EA580C', color: '#EA580C' },
  'Set Font Size':  { bg: '#FDF4FF', stroke: '#C026D3', color: '#C026D3' },
  'Set Alignment':  { bg: '#FAF5FF', stroke: '#9333EA', color: '#9333EA' },
  'Set Margin':     { bg: '#ECFDF5', stroke: '#059669', color: '#059669' },
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
    const ctx = r.in || 'Any'
    const cond = r.if || 'Any'
    const action = r.action || '—'
    const params = r.parameters || '—'

    const condLabel = cond === 'Any' ? 'Any condition' : esc(cond)
    const elementLabel = ctx === 'Any' ? esc(when) : `${esc(when)} in ${esc(ctx)}`

    lines.push(`  START --> ${nodeId}["${elementLabel}"]`)
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

// ── Data ──────────────────────────────────────────────────────────────
import { HEADER_SEED_DATA } from '../headerSeedData'

const LOGIN_RULES = SEED_DATA.filter(r => r.category === 'Login').sort((a, b) => a.rule_id - b.rule_id)

// Header rules that reference Login (alignment + margin positioning)
const HEADER_LOGIN_RULES = HEADER_SEED_DATA.filter(r =>
  r.if && r.if.toLowerCase().includes('login')
).sort((a, b) => a.rule_id - b.rule_id)

const DIAGRAM_GROUPS = [
  {
    key: 'login-avatar',
    title: 'Avatar (Default Preset)',
    desc: 'Default Login output — avatar only',
    rules: LOGIN_RULES.filter(r => r.when === 'Login Bar' && r.action === 'Set Size'),
  },
  {
    key: 'login-header-position',
    title: 'Position in Header Container',
    desc: 'How Login is aligned and spaced within the header grid',
    rules: HEADER_LOGIN_RULES,
  },
  {
    key: 'login-visibility',
    title: 'Visibility & Collapse',
    desc: 'When Login elements hide or collapse on mobile',
    rules: LOGIN_RULES.filter(r => r.action === 'Set Visibility'),
  },
  {
    key: 'login-button',
    title: 'Login Button',
    desc: 'Size and display rules for the Login Button element',
    rules: LOGIN_RULES.filter(r => r.when === 'Login Button'),
  },
].filter(g => g.rules.length > 0)
 .map(g => ({ ...g, chart: buildChart(g.title, g.rules) }))

// ── Spec tables ───────────────────────────────────────────────────────
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

function SpecSection({ number, title, desc, cols, rows }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#00e6b8', color: '#000',
          fontSize: 12, fontWeight: 700, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {String(number).padStart(2, '0')}
        </span>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#000',
          margin: 0, background: '#e8e8e8', padding: '6px 14px',
          borderRadius: 4, width: '100%',
        }}>
          {title}
        </h3>
      </div>
      <div style={{ paddingLeft: 36 }}>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 14, maxWidth: 680 }}>{desc}</p>
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

const SPEC_SECTIONS = [
  {
    title: 'Default Preset — Avatar Only',
    desc: 'The Login component default preset on mobile shows only the circular avatar icon. All other elements (name, member links, sign-in text) are hidden unless explicitly configured. This is the baseline mobile output.',
    cols: ['Element', 'Default Mobile State', 'Note'],
    rows: [
      ['Avatar circle', 'Visible — 40×40px', 'Always shown in default preset'],
      ['Member name text', 'Hidden', 'Not shown in default preset'],
      ['Member links (My Account, etc.)', 'Hidden', 'Not shown in default preset'],
      ['Sign-in prompt text', 'Hidden', 'Not shown in default preset'],
      ['Login Button', 'Visible (if configured)', 'Shown only when a Login Button is used instead of the bar'],
    ]
  },
  {
    title: 'Avatar Size',
    desc: 'The avatar is fixed at 40×40px on mobile regardless of the desktop size, keeping it recognizable without occupying too much header space.',
    cols: ['Property', 'Desktop', 'Mobile'],
    rows: [
      ['Width', 'Desktop value', '40px'],
      ['Height', 'Desktop value', '40px'],
      ['Shape', 'Any (circle/square)', 'Preserved from desktop'],
    ]
  },
  {
    title: 'Position in Header — Alignment',
    desc: 'When a Login icon/button sits inside a Super Grid Cell in the header, it aligns to the far right (LTR). This is handled by the header container heuristic, not the Login component itself.',
    cols: ['Rule', 'When', 'Condition', 'Result'],
    rows: [
      ['Header #4', 'Super Grid Cell', 'Cell contains Login → LTR', 'Align: Most right side'],
      ['Header #6', 'Super Grid Cell', 'Cell contains Login → LTR → Header padding = 0px', 'Margin Right: 24px'],
    ]
  },
  {
    title: 'Position in Header — Visual Layout',
    desc: 'The Login icon is always anchored to the right edge of the header on mobile (LTR layouts), with a 24px outer margin when section padding is 0.',
    cols: ['Scenario', 'Login Position', 'Margin'],
    rows: [
      ['Header has padding > 0', 'Right-aligned in cell', 'No extra margin (padding handles it)'],
      ['Header padding = 0px', 'Right-aligned in cell', 'Margin Right: 24px'],
      ['RTL layout', 'Left-aligned in cell', 'Mirror of LTR rules'],
    ]
  },
  {
    title: 'Login Button (non-bar variant)',
    desc: 'When a Login Button is used instead of the Login Bar, it keeps its desktop width (capped at 100%). In a compact header where width < 40px, the text label is hidden and only the icon is shown.',
    cols: ['Context', 'Mobile Width', 'Label'],
    rows: [
      ['General section / box', 'Desktop value (max 100%)', 'Visible'],
      ['Header — width < 40px', 'Keep size', 'Hidden — icon only'],
    ]
  },
]

// ── Main component ────────────────────────────────────────────────────
export default function LoginSpec() {
  const [view, setView] = useState('spec')

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Login Component — Mobile Transformation Specification
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 680, lineHeight: 1.6 }}>
          The Login component's default mobile preset shows <strong>avatar only</strong> — all other elements (name, links, sign-in text) are hidden.
          Position in the header is governed by the header container heuristics (rules #4 and #6), which align Login to the right edge with a 24px margin.
        </div>
        <div>
          <StatPill label="Login rules" value={String(LOGIN_RULES.length)} />
          <StatPill label="Header position rules" value={String(HEADER_LOGIN_RULES.length)} color="#4a90e2" />
          <StatPill label="Default preset" value="Avatar only" color="#f5a623" />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 0, marginTop: 20, borderBottom: '1px solid #e2e8f0' }}>
          {['spec', 'diagrams'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '8px 18px', fontSize: 13,
              fontWeight: view === v ? 600 : 400,
              color: view === v ? '#0f172a' : '#64748b',
              background: 'transparent', border: 'none',
              borderBottom: view === v ? '2px solid #00e6b8' : '2px solid transparent',
              cursor: 'pointer', marginBottom: -1, textTransform: 'capitalize',
            }}>
              {v === 'spec' ? 'Spec Tables' : 'Decision Diagrams'}
            </button>
          ))}
        </div>
      </div>

      {/* Spec Tables */}
      {view === 'spec' && SPEC_SECTIONS.map((s, i) => (
        <SpecSection key={i} number={i + 1} {...s} />
      ))}

      {/* Diagrams */}
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
            }}>
              {String(di + 1).padStart(2, '0')}
            </span>
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

          <div style={{ borderTop: '1px solid #f1f5f9', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Condition', 'Action', 'Parameters'].map(h => (
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