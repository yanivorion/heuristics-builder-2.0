import React, { useEffect, useRef, useState } from 'react'
import { SEED_DATA } from '../seedData'

// ── Mermaid bootstrap (shared with DiagramsView) ──────────────────────
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
        const uniqueId = `rep_${id.replace(/[^a-zA-Z0-9]/g, '_')}_${renderCounter}`
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

// ── Helpers ───────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/"/g, '#quot;').replace(/\n/g, ' ') }

const OP_COLORS = {
  'Set Size':       { bg: '#EEF2FF', stroke: '#4F46E5', color: '#4F46E5' },
  'Set Min Height': { bg: '#F0FDF4', stroke: '#16A34A', color: '#16A34A' },
  'Set Margin':     { bg: '#ECFDF5', stroke: '#059669', color: '#059669' },
  'Set Padding':    { bg: '#F0FDFA', stroke: '#0D9488', color: '#0D9488' },
  'Set Alignment':  { bg: '#FAF5FF', stroke: '#9333EA', color: '#9333EA' },
  'Set Spacing':    { bg: '#FEFCE8', stroke: '#CA8A04', color: '#CA8A04' },
  'Set Visibility': { bg: '#FEF2F2', stroke: '#DC2626', color: '#DC2626' },
}

function nodeClass(action) { return action.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '') }

function buildChart(title, rules) {
  const lines = ['flowchart TD']
  const usedOps = new Set()
  const classAssignments = []

  const safeTitle = esc(title)
  lines.push(`  START(["<b>${safeTitle}</b>"])`)

  rules.forEach((r, i) => {
    const nodeId = `R${i}`; const condId = `C${i}`; const outId = `O${i}`
    const when = r.when || 'Any'
    const ctx = r.in || 'Any'
    const cond = r.if || 'Any'
    const action = r.action || '—'
    const params = r.parameters || '—'

    const condLabel = cond === 'Any' ? 'Any condition' : esc(cond)
    const elementLabel = when === 'Any' && ctx === 'Any'
      ? 'Any element'
      : when === 'Any'
        ? `Any in ${esc(ctx)}`
        : ctx === 'Any'
          ? esc(when)
          : `${esc(when)} in ${esc(ctx)}`

    lines.push(`  START --> ${nodeId}["${elementLabel}"]`)
    lines.push(`  ${nodeId} --> ${condId}{{"${condLabel}"}}`)
    const outLabel = params !== '—' ? `${esc(action)}\\n${esc(params)}` : esc(action)
    lines.push(`  ${condId} -->|Yes| ${outId}["${outLabel}"]`)

    usedOps.add(action)
    classAssignments.push(`class ${outId} ${nodeClass(action)}`)
  })

  // Style defs
  for (const op of usedOps) {
    const c = OP_COLORS[op] || { bg: '#F8FAFC', stroke: '#64748B', color: '#64748B' }
    lines.push(`classDef ${nodeClass(op)} fill:${c.bg},stroke:${c.stroke},color:${c.color}`)
  }

  lines.push(classAssignments.join('\n'))
  return lines.join('\n')
}

// ── Group rules ───────────────────────────────────────────────────────
const REPEATER_RULES = SEED_DATA.filter(r =>
  r.when === 'Repeater' || r.when === 'Repeater Cell' ||
  r.in === 'Repeater' || r.in === 'Repeater Cell' ||
  (r.category && r.category.startsWith('Repeater'))
)

const DIAGRAM_GROUPS = [
  { key: 'layout',          title: 'Layout Type',            cat: 'Repeater — Layout' },
  { key: 'items-per-row',   title: 'Items Per Row',           cat: 'Repeater — Items Per Row' },
  { key: 'col-row-sizing',  title: 'Column & Row Sizing',     cat: 'Repeater — Column & Row Sizing' },
  { key: 'single-row',      title: 'Single Row Behavior',     cat: 'Repeater — Single Row' },
  { key: 'spacing-padding', title: 'Spacing & Padding',       cat: 'Repeater — Spacing & Padding' },
  { key: 'overflow-scroll', title: 'Overflow & Scroll',       cat: 'Repeater — Overflow & Scroll' },
  { key: 'alignment',       title: 'Alignment',               cat: 'Repeater — Alignment' },
  { key: 'cell',            title: 'Repeater Cell',           cat: 'Repeater Cell' },
]

function buildGroupDiagrams() {
  return DIAGRAM_GROUPS.map(g => {
    const rules = REPEATER_RULES
      .filter(r => r.category === g.cat)
      .sort((a, b) => a.rule_id - b.rule_id)

    return {
      ...g,
      rules,
      chart: buildChart(g.title, rules),
    }
  }).filter(g => g.rules.length > 0)
}

// ── Component ─────────────────────────────────────────────────────────
export default function RepeaterDiagrams() {
  const diagrams = React.useMemo(() => buildGroupDiagrams(), [])

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Repeater — Decision Diagrams
        </div>
        <div style={{ fontSize: 13, color: '#666', maxWidth: 680, lineHeight: 1.6 }}>
          Each diagram isolates a single aspect of Repeater mobile transformation:
          layout, sizing, spacing, overflow, alignment, and cell internals.
        </div>
      </div>

      {diagrams.map((d, di) => (
        <div
          key={d.key}
          style={{
            marginBottom: 32,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
            background: '#fafbfc',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 6,
              background: '#00e6b8', color: '#000',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {String(di + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>
                {d.title}
              </h3>
              <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em' }}>
                {d.rules.length} rule{d.rules.length > 1 ? 's' : ''} · IDs {d.rules.map(r => r.rule_id).join(', ')}
              </span>
            </div>
          </div>

          {/* Diagram */}
          <div style={{ padding: '20px 16px', background: '#f9f9fb' }}>
            <MermaidChart id={d.key} chart={d.chart} />
          </div>

          {/* Rules summary table */}
          <div style={{ borderTop: '1px solid #f1f5f9', padding: 0 }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              fontSize: 12,
            }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Condition</th>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Parameters</th>
                </tr>
              </thead>
              <tbody>
                {d.rules.map((r, i) => {
                  const c = OP_COLORS[r.action] || { bg: '#f8fafc', color: '#64748b' }
                  return (
                    <tr key={r.rule_id} style={{ borderBottom: '1px solid #f8fafc', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '7px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{r.rule_id}</td>
                      <td style={{ padding: '7px 16px', fontSize: 11, color: '#334155' }}>{r.if || 'Any'}</td>
                      <td style={{ padding: '7px 16px' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                          fontSize: 10, fontWeight: 600,
                          background: c.bg, color: c.color, border: `1px solid ${c.color}40`
                        }}>
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