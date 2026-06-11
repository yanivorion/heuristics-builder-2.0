import React, { useState } from 'react'

const PRODUCTS = [
  { id: 1, name: 'KONE', color: '#e8a090', bgColor: '#f5f0ee' },
  { id: 2, name: 'KONE', color: '#e8a090', bgColor: '#f5f0ee' },
  { id: 3, name: 'KONE', color: '#e8a090', bgColor: '#f5f0ee' },
]

function ProductCard({ product, isMobile }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #e8e8ea',
      flex: isMobile ? '1 1 100%' : '1 1 0',
      minWidth: 0,
      maxWidth: isMobile ? '100%' : undefined,
    }}>
      {/* Product image */}
      <div style={{
        background: product.bgColor,
        aspectRatio: '1 / 0.9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: isMobile ? '55%' : '60%',
          aspectRatio: '1',
          background: `linear-gradient(135deg, ${product.color}dd, ${product.color})`,
          borderRadius: '50% 50% 45% 45%',
          position: 'relative',
          boxShadow: `0 4px 20px ${product.color}40`,
        }}>
          {/* Speaker detail lines */}
          <div style={{
            position: 'absolute',
            bottom: '18%',
            left: '15%',
            right: '15%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                height: 2,
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 1,
                width: `${90 - i * 10}%`,
                margin: '0 auto',
              }} />
            ))}
          </div>
          {/* Top glow */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            width: '50%',
            height: '25%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>
      </div>
      {/* Card footer */}
      <div style={{
        padding: isMobile ? '10px 12px' : '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: isMobile ? 13 : 11,
          fontWeight: 600,
          color: '#1a1a1a',
        }}>{product.name}</span>
        <span style={{
          fontSize: isMobile ? 11 : 9,
          fontWeight: 500,
          color: '#4a90e2',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}>
          Start Now
          <svg width={isMobile ? 10 : 8} height={isMobile ? 10 : 8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="7" x2="17" y2="17" />
            <polyline points="17 8 17 17 8 17" />
          </svg>
        </span>
      </div>
    </div>
  )
}

export default function RepeaterVisualization({ matchingRules }) {
  const [viewMode, setViewMode] = useState('desktop')

  const spacingRule = matchingRules.find(r => r.rule_id === 112)
  const paddingRule = matchingRules.find(r => r.rule_id === 114)
  const itemsPerRowRule = matchingRules.find(r => r.rule_id === 105 || r.rule_id === 104)
  const cellPaddingRule = matchingRules.find(r => r.rule_id === 118)

  const isMobile = viewMode === 'mobile'
  const gap = isMobile ? (spacingRule ? 16 : 24) : 24
  const outerPadding = isMobile ? (paddingRule ? 12 : 24) : 24
  const itemsPerRow = isMobile ? 1 : 3
  const innerCellPadding = isMobile ? (cellPaddingRule ? 16 : 24) : 16

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {/* View toggle */}
      <div style={{ display: 'flex', gap: 0, alignSelf: 'center' }}>
        {['desktop', 'mobile'].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: '5px 16px',
              fontSize: 11,
              fontWeight: 600,
              background: viewMode === mode ? '#4a90e2' : '#f1f5f9',
              color: viewMode === mode ? '#fff' : '#64748b',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderRadius: mode === 'desktop' ? '6px 0 0 6px' : '0 6px 6px 0',
              borderRight: mode === 'desktop' ? '1px solid #e2e8f0' : 'none',
            }}
          >
            {mode === 'desktop' ? 'Desktop' : 'Mobile'}
            {mode === 'mobile' && matchingRules.length > 0 && (
              <span style={{
                marginLeft: 5,
                fontSize: 9,
                background: 'rgba(255,255,255,0.25)',
                padding: '1px 5px',
                borderRadius: 8,
              }}>
                {matchingRules.length} rules
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Repeater container */}
      <div style={{
        border: `1.5px solid ${isMobile ? '#e2e8f0' : '#4a90e2'}`,
        borderRadius: 12,
        padding: outerPadding,
        position: 'relative',
        background: '#fafbfc',
        maxWidth: isMobile ? 375 : '100%',
        margin: '0 auto',
        transition: 'all 0.3s ease',
      }}>
        {/* Repeater badge */}
        <div style={{
          position: 'absolute',
          top: -11,
          left: 16,
          background: isMobile ? '#64748b' : '#4a90e2',
          color: '#fff',
          fontSize: 10,
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 10,
          letterSpacing: '0.02em',
          transition: 'background 0.3s',
        }}>
          Repeater
        </div>

        {/* Top action icon */}
        <div style={{
          position: 'absolute',
          top: -14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#fff',
          border: `1.5px solid ${isMobile ? '#e2e8f0' : '#4a90e2'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.3s',
        }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={isMobile ? '#94a3b8' : '#4a90e2'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'flex',
          gap: gap,
          flexWrap: 'wrap',
          padding: innerCellPadding,
          transition: 'all 0.3s ease',
        }}>
          {Array.from({ length: isMobile ? 1 : itemsPerRow }).map((_, i) => (
            <ProductCard key={i} product={PRODUCTS[i]} isMobile={isMobile} />
          ))}
        </div>

        {/* Mobile-only: show hidden cards count */}
        {isMobile && itemsPerRow === 1 && PRODUCTS.length > 1 && (
          <div style={{
            textAlign: 'center',
            fontSize: 10,
            color: '#94a3b8',
            padding: '4px 0 0',
          }}>
            +{PRODUCTS.length - 1} more items below
          </div>
        )}
      </div>

      {/* Applied rules summary */}
      {isMobile && matchingRules.length > 0 && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
            Applied Heuristics
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {matchingRules.slice(0, 8).map(r => (
              <div key={r.rule_id} style={{
                display: 'flex',
                gap: 8,
                fontSize: 10,
                lineHeight: 1.4,
              }}>
                <span style={{ color: '#94a3b8', fontWeight: 600, minWidth: 22 }}>#{r.rule_id}</span>
                <span style={{ color: '#334155', fontWeight: 600 }}>{r.action}</span>
                <span style={{ color: '#64748b' }}>{r.parameters !== '—' ? r.parameters : r.summary}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}