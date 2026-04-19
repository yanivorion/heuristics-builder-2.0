import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { SEED_DATA } from '../seedData'
import { HEADER_SEED_DATA } from '../headerSeedData'
import { buildDiagrams, UNIFIED_TAXONOMY, OP_STYLE_MAP, STRIP_COLORS } from '../diagramBuilder'

let mermaid = null
const mermaidReady = new Promise((resolve) => {
  if (window.mermaid) {
    mermaid = window.mermaid
    mermaid.initialize(MERMAID_INIT)
    resolve()
    return
  }
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
  script.onload = () => {
    mermaid = window.mermaid
    mermaid.initialize(MERMAID_INIT)
    resolve()
  }
  script.onerror = () => {
    console.warn('Failed to load mermaid from CDN')
    resolve()
  }
  document.head.appendChild(script)
})

const MERMAID_INIT = {
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    background: '#ffffff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
    fontSize: '12px',
    primaryColor: '#eef2ff',
    primaryBorderColor: '#3b82f6',
    primaryTextColor: '#0f172a',
    lineColor: '#94a3b8',
    secondaryColor: '#f1f5f9',
    tertiaryColor: '#f8fafc',
    clusterBkg: '#f8fafc',
    clusterBorder: '#e2e8f0',
    edgeLabelBackground: '#ffffff',
    nodeTextColor: '#0f172a'
  },
  flowchart: {
    curve: 'basis',
    padding: 16,
    nodeSpacing: 24,
    rankSpacing: 40,
    htmlLabels: true,
    useMaxWidth: true
  }
}

let renderCounter = 0

function MermaidChart({ id, chart }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!ref.current) return
    let cancelled = false

    async function render() {
      await mermaidReady
      if (!mermaid) {
        setError('Mermaid library not available')
        return
      }
      try {
        renderCounter++
        const uniqueId = `mmd_${id.replace(/[^a-zA-Z0-9]/g, '_')}_${renderCounter}`
        const { svg } = await mermaid.render(uniqueId, chart)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          setError(null)
        }
      } catch (e) {
        console.warn(`Mermaid render error for ${id}:`, e)
        if (!cancelled) setError(String(e.message || e))
      }
    }
    render()
    return () => { cancelled = true }
  }, [id, chart])

  if (error) {
    return (
      <div className="diagram-error">
        <p>Diagram render error</p>
        <pre style={{ fontSize: 9, marginTop: 4, opacity: 0.6, whiteSpace: 'pre-wrap' }}>{error}</pre>
      </div>
    )
  }

  return <div ref={ref} className="diagram-mermaid" />
}

function opStyle(name) {
  return OP_STYLE_MAP[name] || OP_STYLE_MAP._default
}

function stripColor(op) {
  return STRIP_COLORS[op] || STRIP_COLORS._default
}

function OutputStrip({ outputs }) {
  if (!outputs || outputs.length === 0) return null

  return (
    <div className="output-strip">
      <div className="output-strip-label">Operation &rarr; Output</div>
      <div className="output-strip-grid">
        {outputs.map((out, i) => {
          const sc = stripColor(out.operation)
          const title = out.labelParts[0] || out.subType || out.operation
          const details = out.labelParts.slice(1)
          const isDash = out.subType === '—' || out.subType === '--'

          return (
            <div key={i} className="output-pair">
              <div
                className="output-pair-op"
                style={{
                  background: sc.bg,
                  color: sc.pill,
                  borderColor: sc.pill + '30'
                }}
              >
                {out.operation}
              </div>
              <div className="output-pair-card">
                {isDash ? (
                  <div className="output-pair-title">{out.operation}</div>
                ) : (
                  <>
                    <div className="output-pair-title">{title}</div>
                    {details.map((d, j) => (
                      <div key={j} className="output-pair-detail">{d}</div>
                    ))}
                  </>
                )}
                {out.count > 1 && (
                  <div className="output-pair-count">{out.count} rules</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TaxonomyPage() {
  const mainOps = [...new Set(SEED_DATA.map(r => r.action))]
  const headerOps = [...new Set(HEADER_SEED_DATA.map(r => r.action))]
  const allUsedOps = [...new Set([...mainOps, ...headerOps])]
  const unusedOps = UNIFIED_TAXONOMY.filter(op => !allUsedOps.includes(op))

  return (
    <div className="diagram-main">
      <div className="diagram-main-header">
        <h2 className="diagram-main-title">UNIFIED OPERATION TAXONOMY</h2>
        <p className="diagram-main-sub">
          {UNIFIED_TAXONOMY.length} canonical operations &mdash; the standard vocabulary for all heuristic outputs
        </p>
      </div>

      <div className="diagram-grid">
        <section className="diagram-card taxonomy-card">
          <div className="diagram-card-header">
            <span className="diagram-card-num" style={{ background: '#64748b' }}>T</span>
            <div>
              <h3 className="diagram-card-title">All Operations</h3>
              <span className="diagram-card-rules">
                {allUsedOps.length} in use &middot; {unusedOps.length} unused
              </span>
            </div>
          </div>
          <p className="diagram-card-desc">
            Every heuristic rule maps to exactly one of these operations.
            Color coding matches the diagram nodes.
          </p>
          <div className="taxonomy-grid">
            {UNIFIED_TAXONOMY.map(op => {
              const s = opStyle(op)
              const used = allUsedOps.includes(op)
              return (
                <span
                  key={op}
                  className="taxonomy-pill"
                  style={{
                    background: used ? s.bg : 'transparent',
                    color: used ? s.color : 'var(--text-3)',
                    border: `1px solid ${used ? s.color + '33' : 'var(--border)'}`,
                    opacity: used ? 1 : 0.5
                  }}
                >
                  {op}
                </span>
              )
            })}
          </div>
        </section>

        <section className="diagram-card">
          <div className="diagram-card-header">
            <span className="diagram-card-num">M</span>
            <div>
              <h3 className="diagram-card-title">Main Heuristics Coverage</h3>
              <span className="diagram-card-rules">{SEED_DATA.length} rules &middot; {mainOps.length} operations</span>
            </div>
          </div>
          <div className="taxonomy-coverage-table">
            <div className="taxonomy-coverage-header">
              <span>Operation</span>
              <span>Rules</span>
            </div>
            {mainOps.sort().map(op => {
              const count = SEED_DATA.filter(r => r.action === op).length
              const s = opStyle(op)
              return (
                <div key={op} className="taxonomy-coverage-row">
                  <span className="taxonomy-pill" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
                    {op}
                  </span>
                  <span className="taxonomy-coverage-count">{count}</span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="diagram-card">
          <div className="diagram-card-header">
            <span className="diagram-card-num" style={{ background: 'var(--accent)' }}>H</span>
            <div>
              <h3 className="diagram-card-title">Header Heuristics Coverage</h3>
              <span className="diagram-card-rules">{HEADER_SEED_DATA.length} rules &middot; {headerOps.length} operations</span>
            </div>
          </div>
          <div className="taxonomy-coverage-table">
            <div className="taxonomy-coverage-header">
              <span>Operation</span>
              <span>Rules</span>
            </div>
            {headerOps.sort().map(op => {
              const count = HEADER_SEED_DATA.filter(r => r.action === op).length
              const s = opStyle(op)
              return (
                <div key={op} className="taxonomy-coverage-row">
                  <span className="taxonomy-pill" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
                    {op}
                  </span>
                  <span className="taxonomy-coverage-count">{count}</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

function DiagramListPage({ diagrams, title, subtitle }) {
  const [activeId, setActiveId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const sectionRefs = useRef({})
  const mainRef = useRef(null)

  const filtered = diagrams.filter(d => {
    if (!searchTerm) return true
    const q = searchTerm.toLowerCase()
    return d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
  })

  const scrollTo = useCallback((id) => {
    setActiveId(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <>
      <aside className="diagram-sidebar">
        <div className="diagram-sidebar-header">
          <input
            type="text"
            className="viz-search"
            placeholder="Filter diagrams..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="diagram-sidebar-list">
          {filtered.map((d, i) => (
            <button
              key={d.id}
              className={`diagram-nav-btn ${activeId === d.id ? 'active' : ''}`}
              onClick={() => scrollTo(d.id)}
            >
              <span className="diagram-nav-num">{i + 1}</span>
              <span className="diagram-nav-title">{d.title}</span>
              <span className="diagram-nav-count">{d.rules}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="diagram-main" ref={mainRef}>
        <div className="diagram-main-header">
          <h2 className="diagram-main-title">{title}</h2>
          <p className="diagram-main-sub">{subtitle}</p>
        </div>

        <div className="diagram-grid">
          {filtered.map((d, i) => (
            <section
              key={d.id}
              ref={el => sectionRefs.current[d.id] = el}
              className="diagram-card"
              id={`diagram-${d.id}`}
            >
              <div className="diagram-card-header">
                <span className="diagram-card-num">{i + 1}</span>
                <div>
                  <h3 className="diagram-card-title">{d.title}</h3>
                  <span className="diagram-card-rules">
                    {d.rules} &middot; IDs: {d.ruleIds.join(', ')}
                  </span>
                </div>
              </div>
              <p className="diagram-card-desc">{d.desc}</p>
              <OutputStrip outputs={d.outputs} />
              <div className="diagram-card-body">
                <MermaidChart id={d.id} chart={d.chart} />
              </div>
              {d.note && (
                <div className="diagram-card-note">{d.note}</div>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

const SECTIONS = [
  { key: 'taxonomy', label: 'Taxonomy' },
  { key: 'main', label: 'Main Heuristics' },
  { key: 'header', label: 'Header Heuristics' }
]

export default function DiagramsView() {
  const [activeSection, setActiveSection] = useState('main')

  const mainDiagrams = useMemo(() => buildDiagrams(SEED_DATA), [])
  const headerDiagrams = useMemo(() => buildDiagrams(HEADER_SEED_DATA), [])

  return (
    <div className="diagram-view-shell">
      <div className="diagram-section-tabs">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`diagram-section-tab ${activeSection === s.key ? 'active' : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.label}
            {s.key === 'main' && <span className="diagram-section-count">{mainDiagrams.length}</span>}
            {s.key === 'header' && <span className="diagram-section-count">{headerDiagrams.length}</span>}
            {s.key === 'taxonomy' && <span className="diagram-section-count">{UNIFIED_TAXONOMY.length}</span>}
          </button>
        ))}
      </div>

      <div className="diagram-section-body">
        {activeSection === 'taxonomy' && <TaxonomyPage />}

        {activeSection === 'main' && (
          <div className="diagram-layout">
            <DiagramListPage
              diagrams={mainDiagrams}
              title="MAIN HEURISTIC DIAGRAMS"
              subtitle={`${mainDiagrams.length} auto-generated flowcharts from ${SEED_DATA.length} rules`}
            />
          </div>
        )}

        {activeSection === 'header' && (
          <div className="diagram-layout">
            <DiagramListPage
              diagrams={headerDiagrams}
              title="HEADER HEURISTIC DIAGRAMS"
              subtitle={`${headerDiagrams.length} auto-generated flowcharts from ${HEADER_SEED_DATA.length} rules`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
