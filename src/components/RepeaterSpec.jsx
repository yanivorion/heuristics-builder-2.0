import React from 'react'
import { SEED_DATA } from '../seedData'

const REPEATER_RULES = SEED_DATA.filter(r =>
  r.rule_id >= 100 && r.rule_id <= 123
)

const REORDERED_CATEGORIES = [
  'Repeater — Layout',
  'Repeater — Items Per Row',
  'Repeater — Column & Row Sizing',
  'Repeater — Single Row',
  'Repeater — Spacing & Padding',
  'Repeater — Overflow & Scroll',
  'Repeater — Alignment',
  'Repeater Cell'
]

function SpecSection({ number, title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#00e6b8', color: '#000',
          fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
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
      <div style={{ paddingLeft: 32 }}>
        {children}
      </div>
    </div>
  )
}

function SpecTable({ columns, rows }) {
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse',
      fontSize: 13, borderRadius: 6, overflow: 'hidden',
      border: '1px solid #e0e0e0',
    }}>
      <thead>
        <tr style={{ background: '#707070', color: '#fff' }}>
          {columns.map(col => (
            <th key={col} style={{
              padding: '8px 14px', textAlign: 'left',
              fontWeight: 600, fontSize: 12,
              borderRight: '1px solid rgba(255,255,255,0.15)',
            }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{
            background: i % 2 === 0 ? '#fff' : '#fafafa',
          }}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: '8px 14px',
                borderRight: '1px solid #eee',
                borderBottom: '1px solid #eee',
                color: j === 0 ? '#333' : '#555',
                fontWeight: j === 0 ? 600 : 400,
                fontSize: 12,
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function StatPill({ label, value, color = '#00e6b8' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#fff', border: '1px solid #e0e0e0',
      borderRadius: 6, padding: '5px 12px', marginRight: 8, marginBottom: 8,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0,
      }} />
      <span style={{ fontSize: 11, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{value}</span>
    </div>
  )
}

function mergeIds(ids) {
  if (ids.length <= 3) return ids.join(', ')
  let ranges = []
  let start = ids[0], end = ids[0]
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === end + 1) { end = ids[i] }
    else { ranges.push(start === end ? `${start}` : `${start}–${end}`); start = ids[i]; end = ids[i] }
  }
  ranges.push(start === end ? `${start}` : `${start}–${end}`)
  return ranges.join(', ')
}

export default function RepeaterSpec() {
  const categories = REORDERED_CATEGORIES.filter(cat =>
    REPEATER_RULES.some(r => r.category === cat)
  )

  const catRules = (cat) => REPEATER_RULES.filter(r => r.category === cat).sort((a, b) => a.rule_id - b.rule_id)
  const totalRules = REPEATER_RULES.length

  return (
    <div style={{
      maxWidth: 960, margin: '0 auto', padding: '32px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#000',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Repeater Component — Heuristic Specification
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          Rules governing how the Repeater component transforms from desktop to mobile.
          All rules sourced directly from the heuristic database.
        </div>
        <div>
          <StatPill label="Total Rules" value={String(totalRules)} />
          <StatPill label="Categories" value={String(categories.length)} color="#4a90e2" />
          <StatPill label="Actions" value={String([...new Set(REPEATER_RULES.map(r => r.action))].length)} color="#f5a623" />
        </div>
      </div>

      {categories.map((cat, ci) => {
        const rules = catRules(cat)
        const ids = mergeIds(rules.map(r => r.rule_id))
        return (
          <SpecSection key={cat} number={ci + 1} title={`${cat} (#${ids})`}>
            <SpecTable
              columns={['ID', 'When', 'In', 'If', 'Action', 'Parameters', 'Note']}
              rows={rules.map(r => [
                String(r.rule_id),
                r.when,
                r.in,
                r.if,
                r.action,
                r.parameters,
                r.note || '—'
              ])}
            />
          </SpecSection>
        )
      })}
    </div>
  )
}