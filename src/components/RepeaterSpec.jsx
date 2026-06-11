import React from 'react'
import { SEED_DATA } from '../seedData'

const REPEATER_RULES = SEED_DATA.filter(r =>
  r.when === 'Repeater' || r.when === 'Repeater Cell' ||
  r.in === 'Repeater' || r.in === 'Repeater Cell' ||
  (r.category && r.category.startsWith('Repeater'))
)

function SpecSection({ number, title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: '#00e6b8', color: '#000',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
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
          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: '8px 14px', borderRight: '1px solid #eee',
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
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#000' }}>{value}</span>
    </div>
  )
}

function SectionIntro({ children }) {
  return <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 14, maxWidth: 720 }}>{children}</p>
}

export default function RepeaterSpec() {
  const rulesByCat = cat => REPEATER_RULES.filter(r => r.category === cat).sort((a, b) => a.rule_id - b.rule_id)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Repeater — Mobile Transformation Specification
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 680, lineHeight: 1.6 }}>
          When moving from desktop to mobile, the Repeater component adjusts its layout, sizing, spacing,
          and overflow behavior. This spec documents every transformation rule that the heuristics engine applies.
        </div>
        <div>
          <StatPill label="Rules" value={String(REPEATER_RULES.length)} />
          <StatPill label="Categories" value="9" color="#4a90e2" />
          <StatPill label="Action types" value="6" color="#f5a623" />
        </div>
      </div>

      {/* 01 — Layout & Base Sizing */}
      <SpecSection number={1} title="Layout & Base Sizing">
        <SectionIntro>
          Regardless of layout mode, the Repeater always expands to 100% width with auto height
          on mobile. The four layout modes — Cards, List, Grid, and Slider — each have additional
          transformation rules.
        </SectionIntro>
        <SpecTable
          columns={['Scope', 'Mobile width', 'Mobile height', 'Items per row', 'Additional behavior']}
          rows={[
            ['Repeater (any layout)', '100%', 'Auto', '—', 'Base rule — applies before layout-specific rules'],
            ['Cards', '100%', 'Auto', '1', '—'],
            ['List', '100%', 'Auto', '1 (forced)', '—'],
            ['Grid', '100%', 'Auto', '4+ cols → 2, 1–3 cols → 1', 'Column min width set to viewport'],
            ['Slider', '100%', 'Auto', '1', 'Scroll snap: Start · Scrollbar: Hidden'],
          ]}
        />
      </SpecSection>

      {/* 02 — Items Per Row */}
      <SpecSection number={2} title="Items Per Row">
        <SectionIntro>
          When a Repeater uses explicit column counts, those counts are reduced for mobile
          readability. Auto-fit mode uses the viewport width as the column minimum instead.
        </SectionIntro>
        <SpecTable
          columns={['Desktop columns', 'Mobile columns', 'Rule']}
          rows={[
            ['4 or more', '2', 'Collapse to two-column grid for readability'],
            ['2 or 3', '1', 'Collapse to single column'],
            ['Auto-fit (by min width)', '1', 'Column min width = 100% viewport'],
            ['1', '1', 'Already single column — no change'],
          ]}
        />
      </SpecSection>

      {/* 03 — Column & Row Sizing */}
      <SpecSection number={3} title="Column & Row Sizing">
        <SectionIntro>
          Column minimum width is set to 280px on mobile regardless of the desktop value,
          preventing cards from becoming unreadably narrow. Row height behavior depends on
          whether the designer chose equal-height rows.
        </SectionIntro>
        <SpecTable
          columns={['Property', 'Condition', 'Mobile value']}
          rows={[
            ['Column min width', 'Any desktop value', '280px'],
            ['Row min height', 'Keep Rows Equal: On', 'Keep desktop value (floor: 200px)'],
            ['Row min height', 'Keep Rows Equal: Off', 'Auto (content-driven)'],
          ]}
        />
      </SpecSection>

      {/* 04 — Single Row */}
      <SpecSection number={4} title="Single Row Behavior">
        <SectionIntro>
          When a Repeater contains only one row of items, the designer can choose to stretch
          columns to fill the available width or preserve the column structure with empty space.
        </SectionIntro>
        <SpecTable
          columns={['Setting', 'Mobile behavior']}
          rows={[
            ['Stretch Columns to Fill Row', 'Items stretch to fill full width'],
            ['Keep Empty Columns', 'Column count preserved — empty columns remain'],
          ]}
        />
      </SpecSection>

      {/* 05 — Spacing & Padding */}
      <SpecSection number={5} title="Spacing & Padding">
        <SectionIntro>
          Inter-item gaps and outer padding are reduced on mobile to conserve screen space.
          Gaps above 24px on desktop compact to 16px; padding above 12px compacts to 12px.
        </SectionIntro>
        <SpecTable
          columns={['Spacing type', 'Desktop threshold', 'Mobile value']}
          rows={[
            ['Horizontal gap between items', '> 24px', '16px'],
            ['Vertical gap between items', '> 24px', '16px'],
            ['Repeater outer padding', '> 12px', '12px'],
          ]}
        />
      </SpecSection>

      {/* 06 — Overflow & Scroll */}
      <SpecSection number={6} title="Overflow & Scroll">
        <SectionIntro>
          Slider layouts use horizontal swipe navigation on mobile with the scrollbar hidden
          and snap-to-start behavior. Non-slider layouts keep overflow clipped.
        </SectionIntro>
        <SpecTable
          columns={['Layout', 'Overflow setting', 'Mobile behavior']}
          rows={[
            ['Slider', 'Show', 'Scroll snap: Start · Scrollbar: Hidden'],
            ['Any except Slider', 'Hide', 'Overflow: Hidden'],
          ]}
        />
      </SpecSection>

      {/* 07 — Alignment */}
      <SpecSection number={7} title="Alignment">
        <SectionIntro>
          The Repeater's horizontal alignment is preserved as-is from desktop to mobile.
          Left-aligned repeaters stay left-aligned; center-aligned stay centered.
        </SectionIntro>
        <SpecTable
          columns={['Desktop alignment', 'Mobile alignment']}
          rows={[
            ['Left', 'Left'],
            ['Center', 'Center'],
          ]}
        />
      </SpecSection>

      {/* 08 — Cell Internals */}
      <SpecSection number={8} title="Repeater Cell">
        <SectionIntro>
          Each cell inside the Repeater fills its column at 100% width with auto height.
          Inner padding is set to 16px on all sides. After the Repeater resizes, standard
          heuristics are applied recursively to every child element inside each cell.
        </SectionIntro>
        <SpecTable
          columns={['Scope', 'Property', 'Mobile value']}
          rows={[
            ['Cell itself', 'Size', 'Width: 100% · Height: Auto'],
            ['Cell itself', 'Padding', '16px (all sides)'],
            ['First child in cell', 'Margin top', '40px'],
            ['Last child in cell', 'Margin bottom', '40px'],
            ['All children in cell', 'Recursive rules', 'Apply existing heuristics after resize'],
          ]}
        />
      </SpecSection>
    </div>
  )
}