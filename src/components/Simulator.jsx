import React, { useState, useMemo } from 'react'
import ElementMock, { HiddenMock, Annotation, PaddingIndicator, MarginIndicator, parseElements } from './ElementMock'
import RepeaterVisualization from './RepeaterVisualization'
import RepeaterSpec from './RepeaterSpec'
import { CANONICAL_COMPONENTS, CANONICAL_CONTEXTS } from '../seedData'

function matchRule(rule, component, context) {
  const whenMatch = rule.when === 'Any' || rule.when === component ||
    (rule.when && rule.when.includes('|') && rule.when.split('|').map(s => s.trim()).includes(component))
  const inMatch = rule.in === 'Any' || rule.in === context ||
    (rule.in && rule.in.includes('|') && rule.in.split('|').map(s => s.trim()).includes(context))
  return whenMatch && inMatch
}

function ActionBadge({ action }) {
  const colors = {
    'Set Size': { bg: '#eef2ff', color: '#4f46e5' },
    'Set Visibility': { bg: '#fef2f2', color: '#dc2626' },
    'Set Rotation': { bg: '#fff7ed', color: '#ea580c' },
    'Set Alignment': { bg: '#faf5ff', color: '#9333ea' },
    'Set Margin': { bg: '#ecfdf5', color: '#059669' },
    'Set Padding': { bg: '#f0fdfa', color: '#0d9488' },
    'Set OOG': { bg: '#f0f9ff', color: '#0284c7' },
    'Set Pinned': { bg: '#fffbeb', color: '#d97706' },
    'Set Font Size': { bg: '#fdf4ff', color: '#c026d3' },
    'Set Spacing': { bg: '#fefce8', color: '#ca8a04' },
    'Set Min Height': { bg: '#f0fdf4', color: '#16a34a' }
  }
  const c = colors[action] || { bg: '#f8fafc', color: '#64748b' }
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.color}25`
    }}>
      {action}
    </span>
  )
}

export default function Simulator({ rows = [], headerRows = [] }) {
  const [selectedComponent, setSelectedComponent] = useState('Any')
  const [selectedContext, setSelectedContext] = useState('Any')
  const [showHeader, setShowHeader] = useState(false)
  const [showSpec, setShowSpec] = useState(false)

  const activeRules = showHeader ? headerRows : rows

  const matchingRules = useMemo(() => {
    return activeRules.filter(r => matchRule(r, selectedComponent, selectedContext))
  }, [activeRules, selectedComponent, selectedContext])

  const actions = useMemo(() => {
    const map = new Map()
    for (const r of matchingRules) {
      if (!map.has(r.action)) map.set(r.action, [])
      map.get(r.action).push(r)
    }
    return [...map.entries()]
  }, [matchingRules])

  const isHidden = matchingRules.some(r => r.action === 'Set Visibility' && r.parameters?.includes('Hide'))

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
          Heuristic Simulator
        </h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Select a component and context to see which rules apply
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Component:</label>
        <select
          value={selectedComponent}
          onChange={e => setSelectedComponent(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}
        >
          {CANONICAL_COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginLeft: 8 }}>Context:</label>
        <select
          value={selectedContext}
          onChange={e => setSelectedContext(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}
        >
          {CANONICAL_CONTEXTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={{ fontSize: 12, color: '#64748b', marginLeft: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={showHeader}
            onChange={e => setShowHeader(e.target.checked)}
          />
          Header rules
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Visual preview */}
        <div style={{
          background: selectedComponent === 'Repeater' ? '#fff' : '#f8fafc',
          border: '1px solid #e2e8f0', borderRadius: 12, padding: selectedComponent === 'Repeater' ? 20 : 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 200,
          gridColumn: selectedComponent === 'Repeater' ? '1 / -1' : undefined,
        }}>
          {selectedComponent === 'Repeater' ? (
            <RepeaterVisualization matchingRules={matchingRules} />
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preview
              </div>
              {isHidden ? (
                <HiddenMock name={selectedComponent} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <ElementMock name={selectedComponent} />
                  <Annotation color="blue">
                    {selectedComponent} in {selectedContext}
                  </Annotation>
                </div>
              )}
            </>
          )}
        </div>

        {/* Matching rules — hidden when Repeater (visualization shows its own) */}
        {selectedComponent !== 'Repeater' && (
        <div style={{
          background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, minHeight: 200
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {matchingRules.length} matching rule{matchingRules.length !== 1 ? 's' : ''}
          </div>

          {matchingRules.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}>
              No rules match this combination
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {actions.map(([action, rules]) => (
                <div key={action} style={{ border: '1px solid #f1f5f9', borderRadius: 8, padding: 12 }}>
                  <div style={{ marginBottom: 8 }}>
                    <ActionBadge action={action} />
                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>
                      {rules.length} rule{rules.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {rules.map(r => (
                    <div key={r.rule_id} style={{
                      fontSize: 12, color: '#475569', padding: '4px 0',
                      borderTop: '1px solid #f8fafc', lineHeight: 1.5
                    }}>
                      <span style={{ color: '#94a3b8', fontSize: 10, marginRight: 6 }}>#{r.rule_id}</span>
                      <strong style={{ color: '#334155' }}>IF</strong> {r.if || 'Any'}
                      {r.parameters && r.parameters !== '—' && (
                        <span style={{ color: '#64748b' }}> → {r.parameters}</span>
                      )}
                      {r.note && (
                        <div style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic', marginTop: 2 }}>
                          {r.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>

      {/* Repeater Spec — collapsible */}
      {selectedComponent === 'Repeater' && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setShowSpec(!showSpec)}
            style={{
              width: '100%', padding: '10px 16px',
              background: showSpec ? '#f0f0f0' : '#fafafa',
              border: '1px solid #e0e0e0', borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: '#333',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: '#00e6b8', marginRight: 8,
              }} />
              Heuristic Specification — Repeater Component
            </span>
            <span style={{ fontSize: 16, color: '#888', transition: 'transform 0.2s', transform: showSpec ? 'rotate(180deg)' : 'none' }}>
              ▾
            </span>
          </button>
          {showSpec && (
            <div style={{
              marginTop: 12, border: '1px solid #e0e0e0', borderRadius: 8,
              background: '#fff', overflow: 'auto', maxHeight: '80vh',
            }}>
              <RepeaterSpec />
            </div>
          )}
        </div>
      )}
    </div>
  )
}