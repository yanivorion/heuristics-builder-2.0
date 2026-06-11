import React, { useState } from 'react'

const STYLES = {
  bg: '#e9ecf2',
  card: '#ffffff',
  accent: '#ff3b30',
  accentLight: 'rgba(255,59,48,0.12)',
  line: '#ff3b30',
  wireBg: '#cbd5f5',
  wireBorder: '#94a3b8',
  text: '#000',
  textDim: '#555',
}

function DimLabel({ value, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: STYLES.accent, color: '#fff',
      borderRadius: 4, padding: '2px 7px',
      fontSize: 11, fontWeight: 700,
      fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif',
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {value}
    </span>
  )
}

function HatchArea({ width, height, side }) {
  const isH = side === 'left' || side === 'right'
  return (
    <div style={{
      position: 'absolute',
      [side]: 0, top: 0, bottom: 0,
      width: isH ? width : '100%',
      height: isH ? '100%' : height,
      background: `repeating-linear-gradient(${isH ? '-45deg' : '45deg'}, transparent, transparent 4px, ${STYLES.accentLight} 4px, ${STYLES.accentLight} 6px)`,
      pointerEvents: 'none', zIndex: 0,
    }} />
  )
}

function TickLine({ vertical, length, style }) {
  const common = {
    position: 'absolute',
    background: STYLES.line,
    ...style,
  }
  if (vertical) {
    return (
      <>
        <div style={{ ...common, width: 1, height: length, top: 0 }} />
        <div style={{ ...common, width: 6, height: 1, top: 0, left: -2 }} />
        <div style={{ ...common, width: 6, height: 1, top: length, left: -2 }} />
      </>
    )
  }
  return (
    <>
      <div style={{ ...common, height: 1, width: length, left: 0 }} />
      <div style={{ ...common, height: 6, width: 1, left: 0, top: -2 }} />
      <div style={{ ...common, height: 6, width: 1, left: length, top: -2 }} />
    </>
  )
}

// ── Scene 1: Outer Padding ───────────────────────────────────────
function PaddingScene() {
  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40, position: 'relative',
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 18 }}>
        Outer Padding — Repeater Container
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        {/* Left padding hatch */}
        <HatchArea width={36} side="left" />
        <HatchArea width={36} side="right" />

        {/* Left dimension */}
        <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 0, zIndex: 2 }}>
          <DimLabel value="24px" />
          <div style={{ width: 28, height: 1, background: STYLES.line }} />
        </div>

        {/* Right dimension */}
        <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 0, zIndex: 2 }}>
          <div style={{ width: 28, height: 1, background: STYLES.line }} />
          <DimLabel value="24px" />
        </div>

        {/* Container */}
        <div style={{
          width: 340, background: STYLES.card,
          border: '1px solid #dde1e7', borderRadius: 8,
          padding: '20px 0', position: 'relative',
          margin: '0 36px',
        }}>
          {/* Top padding indicator */}
          <div style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
            <DimLabel value="24px" />
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 40, background: STYLES.wireBg,
                borderRadius: 4, border: `1px solid ${STYLES.wireBorder}`,
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, background: `repeating-linear-gradient(-45deg,transparent,transparent 2px,${STYLES.accentLight} 2px,${STYLES.accentLight} 4px)`, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: STYLES.textDim }}>Padding Left/Right: 24px</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, background: `repeating-linear-gradient(-45deg,transparent,transparent 2px,${STYLES.accentLight} 2px,${STYLES.accentLight} 4px)`, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: STYLES.textDim }}>Padding Top/Bottom: 24px</span>
        </div>
      </div>
    </div>
  )
}

// ── Scene 2: Column Width & Spacing ──────────────────────────────
function ColumnSpacingScene() {
  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40, position: 'relative',
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 18 }}>
        Column Width & Horizontal Spacing — Grid Layout
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 420, background: STYLES.card,
          border: '1px solid #dde1e7', borderRadius: 8,
          padding: 20, position: 'relative',
          display: 'flex', gap: 16,
        }}>
          {/* Column 1 */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ height: 100, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />
            <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)' }}>
              <DimLabel value="280px" />
            </div>
          </div>

          {/* Gap indicator */}
          <div style={{ position: 'relative', width: 16, flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)' }}>
              <DimLabel value="16px" />
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ flex: 1 }}>
            <div style={{ height: 100, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 34 }}>
        <div style={{ fontSize: 11, color: STYLES.textDim }}>
          Column Min Width: <strong>280px</strong>
        </div>
        <div style={{ fontSize: 11, color: STYLES.textDim }}>
          Horizontal Gap: <strong>16px</strong>
        </div>
      </div>
    </div>
  )
}

// ── Scene 3: Items Per Row ───────────────────────────────────────
function ItemsPerRowScene() {
  const [mode, setMode] = useState('desktop')

  const cols = mode === 'desktop' ? 4 : 2
  const label = mode === 'desktop' ? 'Desktop: 4 columns' : 'Mobile: 2 columns'

  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40,
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 6 }}>
        Items Per Row — Grid Collapse
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        {['desktop', 'mobile'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '4px 14px', borderRadius: 20,
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: mode === m ? '#3b82f6' : '#e2e8f0',
            color: mode === m ? '#fff' : '#475569',
            border: 'none', fontFamily: 'inherit',
          }}>
            {m === 'desktop' ? 'Desktop' : 'Mobile'}
          </button>
        ))}
        <span style={{ fontSize: 12, fontWeight: 600, color: STYLES.textDim }}>{label}</span>
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: mode === 'desktop' ? 420 : 340,
          background: STYLES.card, border: '1px solid #dde1e7',
          borderRadius: 8, padding: 16, position: 'relative',
          display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 12, transition: 'all 0.3s ease',
        }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{
              height: 48, background: STYLES.wireBg,
              borderRadius: 4, border: `1px solid ${STYLES.wireBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#64748b', fontWeight: 500,
            }}>
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: STYLES.textDim }}>
        4+ columns → <strong style={{ color: STYLES.accent }}>2</strong> on mobile · 1–3 columns → <strong style={{ color: STYLES.accent }}>1</strong>
      </div>
    </div>
  )
}

// ── Scene 4: Vertical Spacing ────────────────────────────────────
function VerticalSpacingScene() {
  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40,
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 18 }}>
        Vertical Spacing — Gap Between Items
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 260, background: STYLES.card,
          border: '1px solid #dde1e7', borderRadius: 8,
          padding: 16, position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Item 1 */}
          <div style={{ height: 44, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />

          {/* Gap + label */}
          <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', height: 1, background: STYLES.line, opacity: 0.3, position: 'absolute' }} />
            <DimLabel value="16px" />
          </div>

          {/* Item 2 */}
          <div style={{ height: 44, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />

          {/* Gap */}
          <div style={{ height: 16 }} />

          {/* Item 3 */}
          <div style={{ height: 44, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: STYLES.textDim }}>
        Vertical gap: <strong>16px</strong> (reduced from desktop &gt;24px)
      </div>
    </div>
  )
}

// ── Scene 5: Cell Padding ────────────────────────────────────────
function CellPaddingScene() {
  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40,
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 18 }}>
        Cell Internal Padding
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 280, background: STYLES.card,
          border: '1px solid #dde1e7', borderRadius: 8,
          position: 'relative',
        }}>
          {/* Hatch padding zones */}
          <HatchArea width={16} side="left" />
          <HatchArea width={16} side="right" />

          {/* Left pad label */}
          <div style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            <DimLabel value="16px" />
          </div>

          {/* Content */}
          <div style={{ margin: '0 16px', padding: '16px 0' }}>
            <div style={{
              height: 28, width: '60%', background: STYLES.wireBg,
              borderRadius: 3, border: `1px solid ${STYLES.wireBorder}`,
              marginBottom: 10,
            }} />
            <div style={{
              height: 14, width: '80%', background: STYLES.wireBg,
              borderRadius: 3, border: `1px solid ${STYLES.wireBorder}`,
              marginBottom: 6,
            }} />
            <div style={{
              height: 14, width: '65%', background: STYLES.wireBg,
              borderRadius: 3, border: `1px solid ${STYLES.wireBorder}`,
              marginBottom: 12,
            }} />
            <div style={{
              height: 30, width: '50%', background: STYLES.accentLight,
              borderRadius: 4, border: `1px solid ${STYLES.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, color: STYLES.accent,
            }}>
              Button
            </div>
          </div>

          {/* Right pad label */}
          <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            <DimLabel value="16px" />
          </div>

          {/* Top pad */}
          <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
            <DimLabel value="16px" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 18 }}>
        <div style={{ fontSize: 11, color: STYLES.textDim }}>
          Cell padding: <strong>16px</strong> all sides
        </div>
        <div style={{ fontSize: 11, color: STYLES.textDim }}>
          First child margin-top: <strong>40px</strong>
        </div>
        <div style={{ fontSize: 11, color: STYLES.textDim }}>
          Last child margin-bottom: <strong>40px</strong>
        </div>
      </div>
    </div>
  )
}

// ── Scene 6: Row Height ──────────────────────────────────────────
function RowHeightScene() {
  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40,
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 18 }}>
        Row Min Height — Equal vs Auto
      </div>

      <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
        {/* Equal rows */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: STYLES.textDim, textAlign: 'center', marginBottom: 10 }}>
            Keep Rows Equal: On
          </div>
          <div style={{
            width: 150, background: STYLES.card,
            border: '1px solid #dde1e7', borderRadius: 8,
            padding: 12, position: 'relative',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ height: 60, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#64748b' }}>Item</div>
            <div style={{ height: 60, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#64748b' }}>Item</div>
            <div style={{ position: 'absolute', right: -28, top: 12 }}>
              <DimLabel value="200px" />
            </div>
          </div>
        </div>

        {/* Auto rows */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: STYLES.textDim, textAlign: 'center', marginBottom: 10 }}>
            Keep Rows Equal: Off
          </div>
          <div style={{
            width: 150, background: STYLES.card,
            border: '1px solid #dde1e7', borderRadius: 8,
            padding: 12, position: 'relative',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ height: 36, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />
            <div style={{ height: 72, background: STYLES.wireBg, borderRadius: 4, border: `1px solid ${STYLES.wireBorder}` }} />
            <div style={{ position: 'absolute', right: -28, top: 12 }}>
              <DimLabel value="Auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Scene 7: Slider Overflow ─────────────────────────────────────
function SliderScene() {
  return (
    <div style={{
      background: STYLES.bg, borderRadius: 12, padding: 40,
      border: '1px solid #dde1e7',
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: STYLES.text, marginBottom: 18 }}>
        Slider Layout — Overflow & Scroll Snap
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 320, background: STYLES.card,
          border: '1px solid #dde1e7', borderRadius: 8,
          padding: 12, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 4 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                minWidth: 180, height: 100,
                background: STYLES.wireBg, borderRadius: 6,
                border: `1px solid ${STYLES.wireBorder}`,
                scrollSnapAlign: 'start',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#64748b', fontWeight: 500,
              }}>
                Slide {i}
              </div>
            ))}
          </div>

          {/* Scrollbar hidden note */}
          <div style={{ position: 'absolute', bottom: 2, right: 8, fontSize: 9, color: STYLES.accent, fontWeight: 600, background: '#fff', padding: '0 4px' }}>
            scrollbar: hidden
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14, display: 'flex', justifyContent: 'center', gap: 30 }}>
        <span style={{ fontSize: 11, color: STYLES.textDim }}>Scroll Snap: <strong>Start</strong></span>
        <span style={{ fontSize: 11, color: STYLES.textDim }}>Scrollbar: <strong>Hidden</strong></span>
        <span style={{ fontSize: 11, color: STYLES.textDim }}>Items Per Row: <strong>1</strong></span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────
const SCENES = [
  { key: 'padding',     title: 'Padding',         component: PaddingScene },
  { key: 'columns',     title: 'Columns & Spacing', component: ColumnSpacingScene },
  { key: 'items',       title: 'Items Per Row',    component: ItemsPerRowScene },
  { key: 'vspacing',    title: 'Vertical Spacing', component: VerticalSpacingScene },
  { key: 'cell',        title: 'Cell Padding',     component: CellPaddingScene },
  { key: 'rowheight',   title: 'Row Height',       component: RowHeightScene },
  { key: 'slider',      title: 'Slider Overflow',  component: SliderScene },
]

export default function MeasurementViz() {
  return (
    <div style={{
      maxWidth: 960, margin: '0 auto', padding: '32px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#000',
    }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#000', marginBottom: 4 }}>
          Measurement Visualizations
        </div>
        <div style={{ fontSize: 13, color: '#666', maxWidth: 680, lineHeight: 1.6 }}>
          Visual representation of all Repeater spacing, sizing, and layout dimensions
          using annotated measurement markers.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {SCENES.map((scene, i) => (
          <div key={scene.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#00e6b8', color: '#000',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 style={{
                fontSize: 15, fontWeight: 700, color: '#000',
                margin: 0, background: '#e8e8e8', padding: '6px 14px',
                borderRadius: 4,
              }}>
                {scene.title}
              </h3>
            </div>
            <scene.component />
          </div>
        ))}
      </div>
    </div>
  )
}