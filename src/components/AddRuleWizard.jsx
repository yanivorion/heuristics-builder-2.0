import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ELEMENT_GROUPS,
  CONTEXT_OPTIONS,
  IF_OPTIONS,
  WIZARD_ACTIONS,
  PRIORITY_OPTIONS,
  ELEMENT_GROUP_DROPDOWN,
  CONDITION_TYPE_DROPDOWN,
  STEP_HEADINGS,
  buildParametersString,
  buildPlainSentence,
  buildSentenceSegments,
  categoryForElementGroup
} from '../addRuleWizardConfig'

const PREVIEW = {
  when: { bg: '#EEEDFE', color: '#3C3489', label: 'When:' },
  in: { bg: '#E1F5EE', color: '#085041', label: 'In:' },
  if: { bg: '#E6F1FB', color: '#0C447C', label: 'If:' },
  then: { bg: '#FAECE7', color: '#4A1B0C', label: 'Then:' }
}

function flattenElements(extra = []) {
  const chips = []
  for (const g of ELEMENT_GROUPS) {
    for (const c of g.components) {
      if (typeof c === 'string') {
        chips.push({ group: g.label, label: c, canonical: c })
      } else {
        chips.push({ group: g.label, label: c.label, canonical: c.canonical })
      }
    }
  }
  for (const e of extra) {
    if (!chips.some(x => x.canonical.toLowerCase() === e.canonical.toLowerCase())) {
      chips.push({ group: e.group, label: e.label, canonical: e.canonical })
    }
  }
  return chips
}

function flattenIfOptions(extra = []) {
  const opts = []
  for (const block of IF_OPTIONS) {
    for (const o of block.options) {
      opts.push({ ...o, group: block.group })
    }
  }
  for (const e of extra) {
    if (!opts.some(x => x.canonical === e.canonical)) opts.push(e)
  }
  return opts
}

export default function AddRuleWizard({ open, onClose, onSave, existingRows, prefillContext }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [whenCanonical, setWhenCanonical] = useState('')
  const [whenGroupLabel, setWhenGroupLabel] = useState('')
  const [extraElements, setExtraElements] = useState([])

  const [inCanonical, setInCanonical] = useState('Any')
  const [extraContexts, setExtraContexts] = useState([])

  const [ifCanonicals, setIfCanonicals] = useState([])
  const [extraIfs, setExtraIfs] = useState([])

  const [actionKey, setActionKey] = useState('Set Size')
  const [paramFields, setParamFields] = useState({})

  const [sizeInstanceQueue, setSizeInstanceQueue] = useState([])

  const [priority, setPriority] = useState(1)
  const [note, setNote] = useState('')

  const [openPanel, setOpenPanel] = useState(null)

  const [addElementName, setAddElementName] = useState('')
  const [addElementGroup, setAddElementGroup] = useState('Layout')
  const [addContextText, setAddContextText] = useState('')
  const [addIfText, setAddIfText] = useState('')
  const [addIfType, setAddIfType] = useState('Other')
  const [addSizeIf, setAddSizeIf] = useState('')
  const [addSizeHeight, setAddSizeHeight] = useState('')

  const elementChips = useMemo(() => flattenElements(extraElements), [extraElements])
  const contextOptions = useMemo(() => {
    const base = [...CONTEXT_OPTIONS]
    for (const x of extraContexts) {
      if (!base.some(b => b.canonical === x.canonical)) {
        base.push({ label: x.label, canonical: x.canonical })
      }
    }
    return base
  }, [extraContexts])

  const ifOptionsFlat = useMemo(() => flattenIfOptions(extraIfs), [extraIfs])

  const ifCanonical = useMemo(
    () => ifCanonicals.join(' AND '),
    [ifCanonicals]
  )

  function toggleIf(canonical) {
    setIfCanonicals(prev =>
      prev.includes(canonical)
        ? prev.filter(c => c !== canonical)
        : [...prev, canonical]
    )
  }

  const actionDef = WIZARD_ACTIONS.find(a => a.action === actionKey) || WIZARD_ACTIONS[0]

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key !== 'Escape') return
      if (step === 5) onClose()
      else if (step > 1) setStep(s => s - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  useEffect(() => {
    setOpenPanel(null)
  }, [step])

  useEffect(() => {
    if (!open) return
    setStep(1)
    setWhenCanonical('')
    setWhenGroupLabel('')
    setExtraElements([])
    setInCanonical(prefillContext && prefillContext !== '' ? prefillContext : 'Any')
    setExtraContexts([])
    setIfCanonicals([])
    setExtraIfs([])
    setActionKey('Set Size')
    setParamFields({})
    setSizeInstanceQueue([])
    setPriority(1)
    setNote('')
    setOpenPanel(null)
    setSaving(false)
  }, [open, prefillContext])

  useEffect(() => {
    if (!open) return
    setParamFields({})
  }, [actionKey, open])

  const previewParts = useMemo(() => {
    const parts = []
    if (whenCanonical) {
      parts.push({ key: 'when', text: `${PREVIEW.when.label} ${whenCanonical}` })
    }
    if (inCanonical) {
      parts.push({ key: 'in', text: `${PREVIEW.in.label} ${contextOptions.find(c => c.canonical === inCanonical)?.label || inCanonical}` })
    }
    if (ifCanonicals.length > 0) {
      const ifLab = ifCanonicals.map(c => ifOptionsFlat.find(o => o.canonical === c)?.label || c).join(' + ')
      parts.push({ key: 'if', text: `${PREVIEW.if.label} ${ifLab}` })
    }
    if (actionKey) {
      const p = buildParametersString(actionKey, paramFields)
      parts.push({
        key: 'then',
        text: `${PREVIEW.then.label} ${actionKey}${p ? ` · ${p}` : ''}`
      })
    }
    return parts
  }, [whenCanonical, inCanonical, ifCanonicals, actionKey, paramFields, contextOptions, ifOptionsFlat])

  const ifDisplayLabel = useMemo(
    () => ifCanonicals.map(c => ifOptionsFlat.find(o => o.canonical === c)?.label || c).join(' AND '),
    [ifOptionsFlat, ifCanonicals]
  )

  const sentenceSegments = useMemo(() => {
    if (!whenCanonical || !inCanonical || ifCanonicals.length === 0 || !actionKey) return []
    const p = buildParametersString(actionKey, paramFields)
    return buildSentenceSegments(whenCanonical, inCanonical, ifCanonical, actionKey, p, ifDisplayLabel)
  }, [whenCanonical, inCanonical, ifCanonicals, ifCanonical, actionKey, paramFields, ifDisplayLabel])

  const step2Notice = useMemo(() => {
    if (step !== 2 || !whenCanonical || !inCanonical) return null
    const n = existingRows.filter(r => r.when === whenCanonical && r.in === inCanonical).length
    if (n === 0) return null
    const el = whenCanonical === 'Any' ? 'Any element' : whenCanonical
    const ctx = contextOptions.find(c => c.canonical === inCanonical)?.label || inCanonical
    return `${el} already has ${n} rule(s) scoped to ${ctx}. If you're adding a new rule here, check for conflicts on the review step.`
  }, [whenCanonical, inCanonical, existingRows, contextOptions, step])

  const conflicts = useMemo(() => {
    if (step < 5 || !whenCanonical || !inCanonical || !actionKey) return []
    return existingRows.filter(
      r => r.when === whenCanonical && r.in === inCanonical && r.action === actionKey
    )
  }, [step, whenCanonical, inCanonical, actionKey, existingRows])

  const canNext = useCallback(() => {
    if (step === 1) return !!whenCanonical
    if (step === 2) return !!inCanonical
    if (step === 3) return ifCanonicals.length > 0
    if (step === 4) {
      const p = buildParametersString(actionKey, paramFields)
      return !!actionKey && p.length > 0
    }
    return true
  }, [step, whenCanonical, inCanonical, ifCanonicals, actionKey, paramFields])

  const openAddPanel = key => {
    setOpenPanel(prev => (prev === key ? null : key))
  }

  function handleAddElement() {
    const name = addElementName.trim()
    if (!name) return
    if (elementChips.some(c => c.canonical.toLowerCase() === name.toLowerCase())) return
    setExtraElements(prev => [...prev, { label: name, canonical: name, group: addElementGroup }])
    setWhenCanonical(name)
    setWhenGroupLabel(addElementGroup)
    setAddElementName('')
    setOpenPanel(null)
  }

  function handleAddContext() {
    const t = addContextText.trim()
    if (!t) return
    const canonical = t.includes('›') ? t.replace(/\s*›\s*/g, ' › ') : t
    setExtraContexts(prev => [...prev, { label: t, canonical }])
    setInCanonical(canonical)
    setAddContextText('')
    setOpenPanel(null)
  }

  function handleAddIf() {
    const t = addIfText.trim()
    if (!t) return
    const canonical = t
    setExtraIfs(prev => [...prev, { label: t, canonical, group: addIfType }])
    setIfCanonicals(prev => [...prev, canonical])
    setAddIfText('')
    setOpenPanel(null)
  }

  function handleAddSizeInstance() {
    if (actionKey !== 'Set Size') return
    const cond = addSizeIf.trim()
    const h = addSizeHeight.trim()
    if (!cond || !h) return
    setSizeInstanceQueue(prev => [...prev, { ifCanon: cond, parameters: `Height: ${h}` }])
    setAddSizeIf('')
    setAddSizeHeight('')
    setOpenPanel(null)
  }

  async function handleSave() {
    const parameters = buildParametersString(actionKey, paramFields)
    const summaryText = buildPlainSentence(
      whenCanonical,
      inCanonical,
      ifCanonical,
      actionKey,
      parameters,
      ifDisplayLabel
    )
    const category = categoryForElementGroup(
      elementChips.find(c => c.canonical === whenCanonical)?.group || whenGroupLabel || 'Custom'
    )

    const baseRow = {
      category,
      when: whenCanonical,
      in: inCanonical,
      if: ifCanonical,
      action: actionKey,
      parameters,
      summary: summaryText,
      priority,
      status: 'Mapped',
      note: note.trim()
    }

    const rowsToSave = [baseRow]
    for (const q of sizeInstanceQueue) {
      const ifLabQ = ifOptionsFlat.find(o => o.canonical === q.ifCanon)?.label || q.ifCanon
      const secSummary = buildPlainSentence(whenCanonical, inCanonical, q.ifCanon, actionKey, q.parameters, ifLabQ)
      rowsToSave.push({
        ...baseRow,
        if: q.ifCanon,
        parameters: q.parameters,
        summary: secSummary
      })
    }

    setSaving(true)
    try {
      await onSave(rowsToSave)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const panelOnly = key => openPanel === key
  const lockContext = Boolean(prefillContext && String(prefillContext).trim() !== '')

  return (
    <div
      className="wizard-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      onClick={e => {
        if (e.target === e.currentTarget && step === 5) onClose()
      }}
    >
      <div className="wizard-modal" onClick={e => e.stopPropagation()}>
        <div className="wizard-head">
          <h2 id="wizard-title">Add rule</h2>
          <button type="button" className="wizard-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="wizard-steps">
          {[
            { n: 1, label: 'Element' },
            { n: 2, label: 'Context' },
            { n: 3, label: 'Condition' },
            { n: 4, label: 'Result' },
            { n: 5, label: 'Review' }
          ].map(({ n, label }) => (
            <span key={n} className={`wizard-step-badge ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`} style={{ '--i': n }}>
              <span className="wizard-step-num">{n}</span>
              <span className="wizard-step-label">{label}</span>
            </span>
          ))}
        </div>

        <div className="wizard-body">
          {step === 1 && (
            <section className="wizard-section">
              <h3>{STEP_HEADINGS[1].title}</h3>
              <p className="wizard-subline">{STEP_HEADINGS[1].maps}</p>
              <p className="wizard-hint">Pick one component (WHEN).</p>
              {ELEMENT_GROUPS.map(g => {
                const chips = elementChips.filter(c => c.group === g.label)
                if (chips.length === 0) return null
                return (
                  <div key={g.id} className="wizard-element-group">
                    <div className="wizard-group-title">{g.label}</div>
                    <div className="wizard-chip-grid">
                      {chips.map(c => (
                        <button
                          key={`${c.group}-${c.canonical}`}
                          type="button"
                          className={`wizard-chip ${whenCanonical === c.canonical ? 'selected' : ''}`}
                          onClick={() => {
                            setWhenCanonical(c.canonical)
                            setWhenGroupLabel(c.group)
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              <button type="button" className="wizard-add-chip" onClick={() => openAddPanel('el')}>
                + Add new element to library
              </button>
              {panelOnly('el') && (
                <div className="wizard-addon purple">
                  <div className="wizard-addon-title">Add a new element type</div>
                  <label>
                    Name
                    <input value={addElementName} onChange={e => setAddElementName(e.target.value)} placeholder="Component name" />
                  </label>
                  <label>
                    Group
                    <select value={addElementGroup} onChange={e => setAddElementGroup(e.target.value)}>
                      {ELEMENT_GROUP_DROPDOWN.map(g => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="wizard-addon-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleAddElement}>
                      Add
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section className="wizard-section">
              <h3>{STEP_HEADINGS[2].title}</h3>
              <p className="wizard-subline">{STEP_HEADINGS[2].maps}</p>
              <p className="wizard-hint">Parent context (IN).</p>
              {lockContext && (
                <div className="wizard-banner filter-locked">
                  Context is set from your active table filter and cannot be changed here. Clear or change the filter on
                  the main view to pick a different context.
                </div>
              )}
              <div className="wizard-chip-grid">
                {contextOptions.map(c => (
                  <button
                    key={c.canonical}
                    type="button"
                    disabled={lockContext && inCanonical !== c.canonical}
                    className={`wizard-chip ${inCanonical === c.canonical ? 'selected' : ''}`}
                    onClick={() => {
                      if (lockContext) return
                      setInCanonical(c.canonical)
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {!lockContext && (
                <button type="button" className="wizard-add-chip" onClick={() => openAddPanel('ctx')}>
                  + Add new context
                </button>
              )}
              {panelOnly('ctx') && (
                <div className="wizard-addon purple">
                  <div className="wizard-addon-title">Add a new context</div>
                  <label>
                    Context
                    <input
                      value={addContextText}
                      onChange={e => setAddContextText(e.target.value)}
                      placeholder='e.g. Section › CSS Grid'
                    />
                  </label>
                  <div className="wizard-addon-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleAddContext}>
                      Add
                    </button>
                  </div>
                </div>
              )}
              {step2Notice && <div className="wizard-banner green">{step2Notice}</div>}
            </section>
          )}

          {step === 3 && (
            <section className="wizard-section">
              <h3>{STEP_HEADINGS[3].title}</h3>
              <p className="wizard-subline">{STEP_HEADINGS[3].maps}</p>
              <p className="wizard-hint">Condition (IF) — select one or more.</p>
              {ifCanonicals.length > 1 && (
                <div className="wizard-banner green">
                  {ifCanonicals.length} conditions selected — they will be combined with AND.
                </div>
              )}
              {IF_OPTIONS.map(block => (
                <div key={block.group || 'base'} className="wizard-if-block">
                  {block.group && <div className="wizard-if-group-label">{block.group}</div>}
                  <div className="wizard-chip-grid">
                    {block.options.map(o => (
                      <button
                        key={o.canonical}
                        type="button"
                        className={`wizard-chip ${ifCanonicals.includes(o.canonical) ? 'selected' : ''}`}
                        onClick={() => toggleIf(o.canonical)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {extraIfs.length > 0 && (
                <div className="wizard-if-block">
                  <div className="wizard-if-group-label">Custom</div>
                  <div className="wizard-chip-grid">
                    {extraIfs.map(o => (
                      <button
                        key={o.canonical}
                        type="button"
                        className={`wizard-chip ${ifCanonicals.includes(o.canonical) ? 'selected' : ''}`}
                        onClick={() => toggleIf(o.canonical)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" className="wizard-add-chip" onClick={() => openAddPanel('if')}>
                + Add a new condition
              </button>
              {panelOnly('if') && (
                <div className="wizard-addon purple">
                  <div className="wizard-addon-title">Add a new condition</div>
                  <label>
                    Condition
                    <input value={addIfText} onChange={e => setAddIfText(e.target.value)} placeholder="Plain language" />
                  </label>
                  <label>
                    Type
                    <select value={addIfType} onChange={e => setAddIfType(e.target.value)}>
                      {CONDITION_TYPE_DROPDOWN.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="wizard-addon-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleAddIf}>
                      Add
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 4 && (
            <section className="wizard-section">
              <h3>{STEP_HEADINGS[4].title}</h3>
              <p className="wizard-subline">{STEP_HEADINGS[4].maps}</p>
              <p className="wizard-hint">Action and parameters (THEN).</p>
              <label className="wizard-field">
                Action
                <select value={actionKey} onChange={e => setActionKey(e.target.value)}>
                  {WIZARD_ACTIONS.map(a => (
                    <option key={a.action} value={a.action}>
                      {a.action}
                    </option>
                  ))}
                </select>
              </label>
              <div className="wizard-param-grid">
                {actionDef.fields.map(f => (
                  <label key={f.key} className="wizard-field">
                    {f.label}
                    {f.type === 'select' ? (
                      <select
                        value={paramFields[f.key] || ''}
                        onChange={e => setParamFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                      >
                        <option value="">Select…</option>
                        {f.options.map(o => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={paramFields[f.key] || ''}
                        placeholder={f.placeholder || ''}
                        onChange={e => setParamFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    )}
                  </label>
                ))}
              </div>
              {actionKey === 'Set Size' && (
                <>
                  <button type="button" className="wizard-add-chip amber" onClick={() => openAddPanel('size')}>
                    + Add a size instance
                  </button>
                  {panelOnly('size') && (
                    <div className="wizard-addon amber">
                      <div className="wizard-addon-title">Add a size instance</div>
                      <p className="wizard-hint small">Same WHEN / IN / Action; different IF and height.</p>
                      <label>
                        When (condition)
                        <input value={addSizeIf} onChange={e => setAddSizeIf(e.target.value)} placeholder="IF condition text" />
                      </label>
                      <label>
                        Height
                        <input value={addSizeHeight} onChange={e => setAddSizeHeight(e.target.value)} placeholder="e.g. 14px" />
                      </label>
                      <div className="wizard-addon-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleAddSizeInstance}>
                          Add instance
                        </button>
                      </div>
                    </div>
                  )}
                  {sizeInstanceQueue.length > 0 && (
                    <ul className="wizard-queue">
                      {sizeInstanceQueue.map((q, i) => (
                        <li key={i}>
                          IF: {q.ifCanon} — {q.parameters}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          )}

          {step === 5 && (
            <section className="wizard-section wizard-review">
              <h3 className="wizard-review-heading">{STEP_HEADINGS[5].title}</h3>
              <p className="wizard-subline">{STEP_HEADINGS[5].maps}</p>
              {conflicts.length > 0 && (
                <div className="wizard-banner conflict">
                  Conflict detected — rule #{conflicts[0].rule_id} already covers {whenCanonical} › {inCanonical} ›{' '}
                  {actionKey}. Set priority correctly below so the right rule wins.
                </div>
              )}
              <div className="wizard-sentence" role="status">
                {sentenceSegments.map((seg, i) => (
                  <span key={i} className={`wizard-sent-${seg.role}`}>
                    {seg.text}
                  </span>
                ))}
              </div>
              <div className="wizard-detail-grid">
                <div className="wizard-detail-row">
                  <span className="wizard-detail-key">WHEN</span>
                  <span className="wizard-pill when">{whenCanonical}</span>
                </div>
                <div className="wizard-detail-row">
                  <span className="wizard-detail-key">IN</span>
                  <span className="wizard-pill in">
                    {contextOptions.find(c => c.canonical === inCanonical)?.label || inCanonical}
                  </span>
                </div>
                <div className="wizard-detail-row">
                  <span className="wizard-detail-key">IF</span>
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                    {ifCanonicals.map((c, i) => (
                      <React.Fragment key={c}>
                        {i > 0 && <span style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 600 }}>AND</span>}
                        <span className="wizard-pill if">{ifOptionsFlat.find(o => o.canonical === c)?.label || c}</span>
                      </React.Fragment>
                    ))}
                  </span>
                </div>
                <div className="wizard-detail-row">
                  <span className="wizard-detail-key">ACTION</span>
                  <span className="wizard-pill then">{actionKey}</span>
                </div>
                {actionDef.fields.map(f => (
                  <div key={f.key} className="wizard-detail-row">
                    <span className="wizard-detail-key">{f.label.toUpperCase()}</span>
                    <span className="wizard-detail-plain">{paramFields[f.key] ? String(paramFields[f.key]).trim() : '—'}</span>
                  </div>
                ))}
              </div>
              <label className="wizard-field">
                Priority
                <select value={priority} onChange={e => setPriority(Number(e.target.value))}>
                  {PRIORITY_OPTIONS.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="wizard-field">
                Note
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Optional — add any notes"
                />
              </label>
            </section>
          )}
        </div>

        <div className="wizard-preview-bar">
          {previewParts.map((p, i) => (
            <React.Fragment key={p.key}>
              {i > 0 && (
                <span className="wizard-preview-sep" aria-hidden>
                  ·
                </span>
              )}
              <span
                className={`wizard-preview-part ${p.key}`}
                style={{
                  background: PREVIEW[p.key]?.bg,
                  color: PREVIEW[p.key]?.color
                }}
              >
                {p.text}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="wizard-footer">
          {step > 1 && step < 5 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          {step === 5 && (
            <>
              <button type="button" className="btn btn-ghost" disabled={saving} onClick={() => setStep(1)}>
                ← Edit
              </button>
              <button type="button" className="btn btn-secondary" disabled={saving} onClick={onClose}>
                Cancel
              </button>
            </>
          )}
          <div className="wizard-footer-spacer" />
          {step < 5 ? (
            <button type="button" className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          ) : (
            <button type="button" className="btn btn-wizard-save" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving…' : 'Save rule'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
