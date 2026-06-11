import React from 'react'

const RULES = [
  {
    number: '01',
    title: 'Sidebar → Inline Flow',
    desc: 'Pinned sidebars that sit beside content on desktop are unpinned and moved inline into the content flow on mobile, appearing as a regular content block.',
    table: {
      cols: ['Desktop', 'Mobile', 'Rule'],
      rows: [
        ['Pinned: Left Sidebar', 'Inline block (top of section)', 'Sidebar becomes first content element'],
        ['Pinned: Right Sidebar', 'Inline block (bottom of section)', 'Sidebar becomes last content element'],
      ]
    }
  },
  {
    number: '02',
    title: 'Toolbar Height Reduction',
    desc: 'Pinned toolbars taller than 60px on desktop shrink to 48px on mobile to preserve viewport space for content.',
    table: {
      cols: ['Desktop Height', 'Mobile Height'],
      rows: [
        ['≥ 60px', '48px'],
        ['< 60px', 'Keep desktop value'],
      ]
    }
  },
  {
    number: '03',
    title: 'Multiple Pinned → Horizontal Scroll Strip',
    desc: 'When two or more items are pinned horizontally within a section, they become a scrollable strip instead of wrapping or overlapping.',
    table: {
      cols: ['Pinned Count', 'Mobile Behavior'],
      rows: [
        ['1 element', 'No change — stays as-is'],
        ['≥ 2 elements (horizontal)', 'Horizontal scroll strip · Scrollbar: Hidden'],
      ]
    }
  },
  {
    number: '04',
    title: 'Collapse on Scroll',
    desc: 'A full pinned toolbar with 3+ child elements collapses to an icon-only compact bar after the user scrolls past the threshold.',
    table: {
      cols: ['Scroll State', 'Appearance'],
      rows: [
        ['Top of section', 'Full toolbar: icons + labels visible'],
        ['Scrolled past 80px', 'Compact bar: icons only, labels hidden'],
      ]
    }
  },
  {
    number: '05',
    title: 'Bottom-Pinned CTA',
    desc: 'Action bars pinned to the bottom of a section (e.g., "Add to Cart", "Submit") remain fixed at the viewport bottom for thumb reach.',
    table: {
      cols: ['Property', 'Mobile Value'],
      rows: [
        ['Position', 'Fixed: Bottom (viewport edge)'],
        ['Z-Index', '100 (above section content)'],
        ['Width', '100%'],
        ['Padding', '12px (all sides)'],
      ]
    }
  },
  {
    number: '06',
    title: 'Z-Index Layering',
    desc: 'Pinned elements use a controlled z-index stack: section content (0) < pinned elements (50) < modals/overlays (100+).',
    table: {
      cols: ['Layer', 'Z-Index'],
      rows: [
        ['Section content', '0'],
        ['Pinned elements (within section)', '50'],
        ['Pinned bottom CTAs', '100'],
        ['Modals / Lightboxes / Overlays', '200+'],
      ]
    }
  },
  {
    number: '07',
    title: 'Full-Width Expansion',
    desc: 'Non-sidebar pinned elements expand to 100% width on mobile so they span the full viewport.',
    table: {
      cols: ['Element Type', 'Mobile Width'],
      rows: [
        ['Pinned toolbar (top)', '100%'],
        ['Pinned action bar (bottom)', '100%'],
        ['Pinned sidebar (left/right)', 'Unpinned → Auto width'],
      ]
    }
  },
  {
    number: '08',
    title: 'Delayed Visibility',
    desc: 'Top-pinned elements that are not critical on first paint fade in after 200px of scroll, preventing persistent UI from dominating the initial view.',
    table: {
      cols: ['Condition', 'Behavior'],
      rows: [
        ['Scroll < 200px', 'Hidden (opacity: 0)'],
        ['Scroll ≥ 200px', 'Fade in (opacity: 1, 300ms transition)'],
      ]
    }
  },
]

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

function SpecSection({ number, title, desc, table }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%',
          background: '#4a90e2', color: '#fff',
          fontSize: 12, fontWeight: 700, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {number}
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
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontSize: 13, borderRadius: 6, overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}>
          <thead>
            <tr style={{ background: '#707070', color: '#fff' }}>
              {table.cols.map(col => (
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
            {table.rows.map((row, i) => (
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
      </div>
    </div>
  )
}

export default function PinnedToSectionSpec() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#000' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Pinned to Section — Mobile Transformation Specification
        </div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 680, lineHeight: 1.6 }}>
          Elements pinned within a section's boundaries (sticky sidebars, toolbars, action bars) need
          adapted positioning, sizing, and layering on mobile. This spec covers all transformation rules
          for pinned-to-section elements.
        </div>
        <div>
          <StatPill label="Rules" value="8" />
          <StatPill label="Action types" value="4" color="#4a90e2" />
          <StatPill label="Priority levels" value="1–2" color="#f5a623" />
        </div>
      </div>

      {RULES.map(r => (
        <SpecSection key={r.number} {...r} />
      ))}
    </div>
  )
}