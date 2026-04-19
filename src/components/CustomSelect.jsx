import React, { useState, useRef, useEffect, useCallback } from 'react'

export default function CustomSelect({ value, options, onChange, onClose, placeholder, className = '', compact = false, autoOpen = false }) {
  const [open, setOpen] = useState(autoOpen)
  const [closing, setClosing] = useState(false)
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const wrapRef = useRef(null)
  const listRef = useRef(null)

  const labels = options.map(o => typeof o === 'object' ? o.label : String(o))
  const values = options.map(o => typeof o === 'object' ? o.value : o)
  const selectedIdx = values.indexOf(value)

  const animateClose = useCallback(() => {
    setClosing(true)
    const t = setTimeout(() => {
      setOpen(false)
      setClosing(false)
      onClose?.()
    }, 150)
    return () => clearTimeout(t)
  }, [onClose])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) animateClose()
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open, animateClose])

  useEffect(() => {
    if (open && listRef.current) {
      const active = listRef.current.querySelector('.cs-option.active')
      if (active) active.scrollIntoView({ block: 'nearest' })
    }
  }, [open])

  function handleToggle() {
    if (open) {
      animateClose()
    } else {
      setOpen(true)
      setClosing(false)
      setHighlightIdx(selectedIdx >= 0 ? selectedIdx : 0)
    }
  }

  function handleSelect(val) {
    onChange(val)
    animateClose()
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        handleToggle()
      }
      return
    }
    if (e.key === 'Escape') { e.preventDefault(); animateClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, values.length - 1)); return }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); return }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (highlightIdx >= 0) handleSelect(values[highlightIdx])
    }
  }

  const displayLabel = selectedIdx >= 0 ? labels[selectedIdx] : (placeholder || 'Select…')

  return (
    <div className={`cs-wrap ${className} ${compact ? 'cs-compact' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className={`cs-trigger ${open ? 'cs-open' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cs-label">{displayLabel}</span>
        <span className={`cs-chevron ${open ? 'cs-chevron-up' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </button>
      {open && (
        <div className={`cs-dropdown ${closing ? 'cs-exit' : 'cs-enter'}`} role="listbox" ref={listRef}>
          {values.map((v, i) => (
            <div
              key={v}
              role="option"
              aria-selected={i === selectedIdx}
              className={`cs-option ${i === selectedIdx ? 'active' : ''} ${i === highlightIdx ? 'highlighted' : ''}`}
              style={{ '--oi': i }}
              onMouseEnter={() => setHighlightIdx(i)}
              onMouseDown={e => { e.preventDefault(); handleSelect(v) }}
            >
              {labels[i]}
              {i === selectedIdx && <span className="cs-check">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
