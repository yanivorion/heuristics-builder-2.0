import React, { useState, useRef, useEffect } from 'react'
import { STATUSES, CANONICAL_ACTIONS, CANONICAL_COMPONENTS, CANONICAL_CONTEXTS, PRIORITIES } from '../seedData'

const DROPDOWN_COLUMNS = {
  status: STATUSES,
  action: CANONICAL_ACTIONS,
  when: CANONICAL_COMPONENTS,
  in: CANONICAL_CONTEXTS,
  priority: PRIORITIES
}

/**
 * Columns whose values are pipe-separated when multi-valued (e.g. a row
 * scoped to "Hamburger Menu | Shape" means the rule applies to either).
 * Rendering each segment as its own chip makes the multi-value nature
 * obvious and lets filters match on any segment.
 */
const MULTI_VALUE_COLUMNS = new Set(['when', 'in', 'action', 'category'])

function splitMultiValue(value) {
  return String(value).split(/\s*\|\s*/).map(s => s.trim()).filter(Boolean)
}

const SIZE_METHODS = [
  { pattern: /^Method:\s*(.*?)(?:\s*[|,]|$)/i, extract: m => m[1].trim() },
  { pattern: /^Scaling:\s*Reset/i, extract: () => 'Reset Scaling' },
  { pattern: /^Scaling:\s*Keep/i, extract: () => 'Keep Scaling' },
  { pattern: /^Resize:\s*Aspect Ratio/i, extract: () => 'Scale in Aspect Ratio' }
]

function extractSizeMethod(params) {
  if (!params || typeof params !== 'string') return null
  for (const { pattern, extract } of SIZE_METHODS) {
    const m = params.match(pattern)
    if (m) {
      const method = extract(m)
      const rest = params.replace(m[0], '').replace(/^[\s,|]+/, '').trim()
      return { method, rest }
    }
  }
  return null
}

function EditableCell({ value, columnKey, rowAction, isEditing, onStartEdit, onSave, onCancel }) {
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)
  const options = DROPDOWN_COLUMNS[columnKey]

  useEffect(() => {
    if (isEditing) {
      setDraft(value)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isEditing, value])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSave(draft)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  function handleBlur() {
    if (draft !== value) {
      onSave(draft)
    } else {
      onCancel()
    }
  }

  if (columnKey === 'status' && !isEditing) {
    const statusMap = {
      'Mapped':          { cls: 'mapped',      icon: '●' },
      'Needs Values':    { cls: 'needs-values', icon: '○' },
      'Dev in Progress': { cls: 'dev-progress', icon: '◐' },
      'Done':            { cls: 'done',         icon: '✓' },
      'On Hold':         { cls: 'on-hold',      icon: '⏸' },
      'Rejected':        { cls: 'rejected',     icon: '✕' },
    }
    const st = statusMap[value] || { cls: 'needs-values', icon: '○' }
    return (
      <div
        className="cell"
        onDoubleClick={onStartEdit}
        onClick={onStartEdit}
      >
        <span className={`cell-status ${st.cls}`}>
          {st.icon} {value} <span className="status-chevron">▾</span>
        </span>
      </div>
    )
  }

  if (columnKey === 'priority' && !isEditing) {
    const label = value === 1 ? 'Global' : value === 2 ? 'Context' : value === 3 ? 'Exception' : value
    return (
      <div className="cell" onDoubleClick={onStartEdit} onClick={onStartEdit}>
        <span className={`cell-priority pri-${value}`}>{value} {label}</span>
      </div>
    )
  }

  if (options && isEditing) {
    const isNumeric = columnKey === 'priority'
    return (
      <div className="cell editing">
        <select
          ref={inputRef}
          className="cell-input"
          value={draft}
          onChange={e => {
            const val = isNumeric ? Number(e.target.value) : e.target.value
            setDraft(val)
            onSave(val)
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          {options.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="cell editing">
        <textarea
          ref={inputRef}
          className="cell-input"
          rows={Math.max(1, Math.ceil((draft || '').length / 40))}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
    )
  }

  const displayClass = columnKey === 'category' ? 'cell-category' : ''

  if (columnKey === 'parameters' && rowAction === 'Set Size' && value) {
    const parsed = extractSizeMethod(String(value))
    if (parsed) {
      const restLines = parsed.rest
        ? parsed.rest.split(/[,|]/).map(s => s.trim()).filter(Boolean)
        : []
      return (
        <div
          className="cell"
          style={{ display: 'block' }}
          onDoubleClick={onStartEdit}
          onClick={onStartEdit}
          title="Click to edit"
        >
          <div style={{ color: 'var(--text-1)', fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}>
            {parsed.method}
          </div>
          {restLines.map((line, i) => (
            <div key={i} style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: '11px', lineHeight: '1.5' }}>
              {line}
            </div>
          ))}
        </div>
      )
    }
  }

  if (MULTI_VALUE_COLUMNS.has(columnKey) && value && String(value).includes('|')) {
    const parts = splitMultiValue(value)
    if (parts.length > 1) {
      return (
        <div
          className={`cell ${displayClass}`}
          onDoubleClick={onStartEdit}
          onClick={onStartEdit}
          title="Click to edit"
        >
          <div className={`cell-chips cell-chips-${columnKey}`}>
            {parts.map((p, i) => (
              <span key={`${i}-${p}`} className={`cell-chip cell-chip-${columnKey}`}>{p}</span>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div
      className={`cell ${displayClass}`}
      onDoubleClick={onStartEdit}
      onClick={onStartEdit}
      title="Click to edit"
    >
      {value || <span style={{ color: 'var(--text-3)', fontStyle: 'normal', opacity: 0.5 }}>—</span>}
    </div>
  )
}

export default EditableCell
