import React from 'react'

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

function VisualMock({ label, children, width, height }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden',
      background: '#f2f2f2', marginBottom: 10,
      width: width || '100%',
    }}>
      <div style={{
        padding: '6px 12px', background: '#2d2d2d', color: '#fff',
        fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span style={{
          width: 10, height: 10, borderRadius: '50%', background: '#ff5f57',
          display: 'inline-block', marginLeft: 4,
        }} />
      </div>
      <div style={{
        background: '#fff', minHeight: height || 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}>
        {children}
      </div>
    </div>
  )
}

function CardMock({ imageColor = '#e8a090', title = 'Product', subtitle, width }) {
  return (
    <div style={{
      background: '#F8F6F6', borderRadius: 8, overflow: 'hidden',
      border: '1px solid #eee', width: width || 140, flexShrink: 0,
    }}>
      <div style={{
        background: '#e8e0dc', height: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50% 50% 45% 45%',
          background: `linear-gradient(135deg, ${imageColor}dd, ${imageColor})`,
        }} />
      </div>
      <div style={{ padding: '6px 10px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#000' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: '#888' }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function GalleryCardMock({ imageColor, width }) {
  return (
    <div style={{
      background: imageColor || '#d5c4b8', borderRadius: 8,
      width: width || 80, height: 80, flexShrink: 0,
    }} />
  )
}

export default function RepeaterSpec() {
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
          Rules governing how the Repeater component transforms from desktop to mobile,
          with container styling, typography, layout adaptations, and breakpoint behavior.
        </div>
        <div>
          <StatPill label="Total Rules" value="24" />
          <StatPill label="Categories" value="8" color="#4a90e2" />
          <StatPill label="Canvas Baseline" value="520px" color="#f5a623" />
          <StatPill label="Mobile Target" value="375px" color="#e040fb" />
        </div>
      </div>

      {/* 01 - Typography */}
      <SpecSection number={1} title="Typography">
        <p style={{ fontSize: 12, color: '#555', marginBottom: 14 }}>
          Font sizing within Repeater items follows the Wix Madefor type scale.
          Desktop sizes are mapped to mobile-friendly equivalents via the Font Algo.
        </p>
        <SpecTable
          columns={['Type', 'Desktop Size', 'Line Height', 'Mobile Size', 'Font Family']}
          rows={[
            ['Heading 4', '30px', '39px', '22px', 'Wix Madefor Display'],
            ['Heading 5', '22px', '33px', '18px', 'Wix Madefor Display'],
            ['Heading 6', '18px', '27px', '16px', 'Wix Madefor Display'],
            ['Paragraph 2', '16px', '24px', '14px', 'Wix Madefor Text'],
            ['Paragraph 3', '14px', '21px', '13px', 'Wix Madefor Text'],
            ['Button / Meta', '14px', '21px', '13px', 'Wix Madefor Text'],
          ]}
        />
      </SpecSection>

      {/* 02 - Container Styling */}
      <SpecSection number={2} title="Container Styling">
        <p style={{ fontSize: 12, color: '#555', marginBottom: 14 }}>
          Each Repeater item is wrapped in a container with consistent visual properties
          across all template types. On mobile, padding and radius adjust proportionally.
        </p>
        <SpecTable
          columns={['Property', 'Desktop Value', 'Mobile Value', 'Applies To']}
          rows={[
            ['Border Radius', '8px', '8px', 'All item containers'],
            ['Fill Color', '#F8F6F6', '#F8F6F6', 'All item containers'],
            ['Padding (T/B/L/R)', '8px', '12px', 'All item containers'],
            ['Background Frame', '#FFFFFF', '#FFFFFF', 'Multi-item & Gallery'],
            ['Frame Padding', '8px', '16px', 'Multi-item & Gallery frame'],
          ]}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <VisualMock label="Desktop Container" width={220} height={110}>
            <div style={{ background: '#F8F6F6', borderRadius: 8, padding: 8, width: 120 }}>
              <div style={{ height: 40, background: '#e8e0dc', borderRadius: 4, marginBottom: 4 }} />
              <div style={{ height: 6, background: '#ddd', borderRadius: 2, width: '80%', marginBottom: 2 }} />
              <div style={{ height: 6, background: '#eee', borderRadius: 2, width: '60%' }} />
            </div>
          </VisualMock>
          <VisualMock label="Mobile Container" width={220} height={110}>
            <div style={{ background: '#F8F6F6', borderRadius: 8, padding: 12, width: 160 }}>
              <div style={{ height: 50, background: '#e8e0dc', borderRadius: 4, marginBottom: 4 }} />
              <div style={{ height: 6, background: '#ddd', borderRadius: 2, width: '90%', marginBottom: 2 }} />
              <div style={{ height: 6, background: '#eee', borderRadius: 2, width: '70%' }} />
            </div>
          </VisualMock>
        </div>
      </SpecSection>

      {/* 03 - Spacing */}
      <SpecSection number={3} title="Spacing & Gaps">
        <SpecTable
          columns={['Spacing Type', 'Desktop Value', 'Mobile Value', 'Rule']}
          rows={[
            ['Inter-item Horizontal', '24px', '16px', 'Reduce gaps for narrow screens'],
            ['Inter-item Vertical', '24px', '16px', 'Stack items vertically with tighter gaps'],
            ['Container Outer Padding', '24px', '12px', 'Less chrome on mobile viewport'],
            ['Repeater Cell Padding', '16px', '16px', 'Consistent inner cell padding'],
            ['First Child Margin Top', '40px', '40px', 'Maintain breathing room at top'],
            ['Last Child Margin Bottom', '40px', '40px', 'Maintain breathing room at bottom'],
          ]}
        />
      </SpecSection>

      {/* 04 - Layout Types */}
      <SpecSection number={4} title="Layout Types">
        <p style={{ fontSize: 12, color: '#555', marginBottom: 14 }}>
          The Repeater supports four layout modes. Each transforms differently on mobile.
        </p>
        <SpecTable
          columns={['Layout', 'Desktop Behavior', 'Mobile Behavior', 'Items/Row Mobile']}
          rows={[
            ['Cards', 'Flex grid, auto columns', 'Single column, full width', '1'],
            ['List', 'Vertical list, single column', 'Single column (forced)', '1'],
            ['Grid', 'CSS Grid, configurable columns', 'Reduce columns by 1 (min 1)', '1–2'],
            ['Slider', 'Horizontal scroll strip', 'Snap scroll, hide scrollbar', '1 (swipeable)'],
          ]}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <VisualMock label="Desktop — Cards (3 col)" width="100%" height={120}>
            <div style={{ display: 'flex', gap: 16 }}>
              <CardMock title="KONE" width={120} />
              <CardMock title="KONE" width={120} imageColor="#90b8e8" />
              <CardMock title="KONE" width={120} imageColor="#b8e090" />
            </div>
          </VisualMock>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <VisualMock label="Desktop — Slider" width={300} height={100}>
            <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
              <CardMock title="Item 1" width={100} />
              <CardMock title="Item 2" width={100} imageColor="#90b8e8" />
              <CardMock title="Item 3" width={100} imageColor="#b8e090" />
            </div>
          </VisualMock>
          <VisualMock label="Mobile — Slider (snap)" width={300} height={100}>
            <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
              <CardMock title="Item 1" width={180} />
              <div style={{ width: 100, flexShrink: 0, background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: '#aaa' }}>→ swipe</span>
              </div>
            </div>
          </VisualMock>
        </div>
      </SpecSection>

      {/* 05 - Items Per Row */}
      <SpecSection number={5} title="Items Per Row — Breakpoint Rules">
        <p style={{ fontSize: 12, color: '#555', marginBottom: 14 }}>
          Column count adapts to parent width. The Repeater reduces items per row
          as the viewport narrows, with minimum thresholds.
        </p>
        <SpecTable
          columns={['Desktop Items/Row', '1024px Width', '768px Width', '375px (Mobile)']}
          rows={[
            ['6', '4', '2', '1'],
            ['5', '3', '2', '1'],
            ['4', '2', '2', '1'],
            ['3', '2', '1', '1'],
            ['2', '1', '1', '1'],
            ['1', '1', '1', '1'],
            ['Auto-fit', 'Min 280px col', 'Min 280px col', '100% (1 col)'],
          ]}
        />
      </SpecSection>

      {/* 06 - Template Type Guidelines */}
      <SpecSection number={6} title="Template Type Guidelines">
        <SpecTable
          columns={['Template Type', 'Condition', 'Rule']}
          rows={[
            ['Single Item', 'Widget contains exactly 1 item', 'No additional padding. Keep item as-is within repeater bounds.'],
            ['Multi Items', 'Widget contains 2+ items', 'Frame items in white (#FFFFFF) background with 8px padding. Items get 12px gap.'],
            ['Galleries', 'Widget is a Gallery type', 'Maintain grid aspect ratio. White background frame with 8px padding. Image fills container.'],
          ]}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <VisualMock label="Single Item" width={200} height={120}>
            <div style={{ background: '#F8F6F6', borderRadius: 8, padding: 8, width: 160 }}>
              <div style={{ height: 60, background: '#e8e0dc', borderRadius: 4, marginBottom: 4 }} />
              <div style={{ fontSize: 11, fontWeight: 600 }}>Slow Flow</div>
              <div style={{ fontSize: 10, color: '#888' }}>1 hr · Yoga</div>
            </div>
          </VisualMock>
          <VisualMock label="Multi Items" width={260} height={120}>
            <div style={{ background: '#fff', borderRadius: 8, padding: 8, display: 'flex', gap: 8 }}>
              <div style={{ background: '#F8F6F6', borderRadius: 6, padding: 6, width: 70 }}>
                <div style={{ height: 40, background: '#e8e0dc', borderRadius: 3, marginBottom: 2 }} />
                <div style={{ fontSize: 9, fontWeight: 600 }}>TRX</div>
              </div>
              <div style={{ background: '#F8F6F6', borderRadius: 6, padding: 6, width: 70 }}>
                <div style={{ height: 40, background: '#c8d8e8', borderRadius: 3, marginBottom: 2 }} />
                <div style={{ fontSize: 9, fontWeight: 600 }}>Yoga</div>
              </div>
            </div>
          </VisualMock>
          <VisualMock label="Gallery" width={260} height={120}>
            <div style={{ background: '#fff', borderRadius: 8, padding: 8, display: 'flex', gap: 6 }}>
              <GalleryCardMock imageColor="#d5b8a0" width={45} />
              <GalleryCardMock imageColor="#a0c8d5" width={45} />
              <GalleryCardMock imageColor="#c0d5a0" width={45} />
              <GalleryCardMock imageColor="#d5a0c0" width={45} />
            </div>
          </VisualMock>
        </div>
      </SpecSection>

      {/* 07 - Overflow & Scroll */}
      <SpecSection number={7} title="Overflow & Scroll Behavior">
        <SpecTable
          columns={['Condition', 'Desktop Action', 'Mobile Action']}
          rows={[
            ['Layout = Slider + Overflow = Show', 'Horizontal scroll visible', 'Snap scroll, hide scrollbar, swipe UX'],
            ['Layout ≠ Slider + Overflow = Hide', 'Overflow clipped', 'Overflow hidden (avoid scroll bleed)'],
          ]}
        />
      </SpecSection>

      {/* 08 - Alignment */}
      <SpecSection number={8} title="Alignment">
        <SpecTable
          columns={['Desktop Alignment', 'Mobile Alignment', 'Notes']}
          rows={[
            ['Left', 'Left', 'Default for LTR layouts; items hug left edge'],
            ['Center', 'Center', 'Items centered within the Repeater container'],
            ['Right', 'Left', 'RTL exception: Right → Left on mobile for RTL languages'],
          ]}
        />
      </SpecSection>

      {/* Design Size Reference */}
      <div style={{
        marginTop: 32, padding: '20px 24px',
        background: '#f8f8f8', borderRadius: 8,
        border: '1px solid #e0e0e0',
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#000', marginBottom: 12 }}>
          Design Size
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 200, height: 100, background: '#fff', borderRadius: 6,
              border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 12, color: '#888' }}>Canvas Size<br/>Desktop Breakpoint</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000' }}>1280</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 120, height: 100, background: '#fff', borderRadius: 6,
              border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 12, color: '#888' }}>Panel Content<br/>Area Baseline</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000' }}>520</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 100, background: '#fff', borderRadius: 6,
              border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 12, color: '#888' }}>Mobile<br/>Viewport</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000' }}>375</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 60, height: 100, background: '#f0f0f0', borderRadius: 6,
              border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 6,
            }}>
              <span style={{ fontSize: 10, color: '#aaa' }}>Min<br/>Width</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#000' }}>320</span>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#888', marginTop: 10 }}>
          Test your design on the sizes above — 1280px / 520px / 375px (incl. container).
        </p>
      </div>
    </div>
  )
}