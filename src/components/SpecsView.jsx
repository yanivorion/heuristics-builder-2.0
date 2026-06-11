import React, { useState } from 'react'
import RepeaterSpec from './RepeaterSpec'
import RepeaterDiagrams from './RepeaterDiagrams'
import MeasurementViz from './MeasurementViz'

const SPECS = [
  { key: 'repeater', label: 'Repeater Spec', component: RepeaterSpec },
  { key: 'repeater-diagrams', label: 'Repeater Diagrams', component: RepeaterDiagrams },
  { key: 'measurements', label: 'Measurements', component: MeasurementViz }
]

export default function SpecsView() {
  const [activeSpec, setActiveSpec] = useState('repeater')

  const ActiveComponent = SPECS.find(s => s.key === activeSpec)?.component

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid #e2e8f0',
        padding: '0 32px', background: '#f8fafc', flexShrink: 0
      }}>
        {SPECS.map((spec, i) => (
          <button
            key={spec.key}
            onClick={() => setActiveSpec(spec.key)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: activeSpec === spec.key ? 600 : 400,
              color: activeSpec === spec.key ? '#0f172a' : '#64748b',
              background: activeSpec === spec.key ? '#fff' : 'transparent',
              border: 'none',
              borderBottom: activeSpec === spec.key ? '2px solid #00e6b8' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              marginBottom: -1,
            }}
          >
            {spec.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}