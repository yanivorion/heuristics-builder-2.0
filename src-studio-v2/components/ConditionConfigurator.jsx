/* ============================================================
   ConditionConfigurator.jsx · v2 (form-based)

   Step 3 condition body — a direct, form-based configurator that
   replaces the earlier strategy-card pattern. Each Step 3 type
   declares a single `form` descriptor with a list of fields and
   an `emit(values)` function that yields the canonicals to push
   onto the rule's IF list.

   Field types supported:
     • numeric         — single value input with optional suffix
     • range           — min / max numeric inputs
     • spectrum        — Single / Range mode toggle, applied across
                         one or more named dimensions (Size = W+H,
                         Padding/Margin = single dim)
     • choice          — radio-style list of options (one row per
                         option; supports `cols` for grid layout)
     • element-pick    — grouped element list (uses ELEMENT_GROUPS)
     • numeric-or-any  — "Any" radio + a numeric value option
     • composite-row   — multiple sub-fields side-by-side (for
                         layouts like Pinned: Position + Offset)

   A field can declare `visibleWhen(values)` to hide itself when a
   sibling field's value doesn't match (used by Spacing's
   element-pick to appear only when "Element above is" is chosen).

   Emissions are flushed via `onAddCondition(canonical, label,
   category)` — once per emission — so the host wizard's existing
   `handleAddCustomCondition` API keeps working unchanged.
   ============================================================ */

import React from 'react'

/* ============================================================
   Helpers
   ============================================================ */

const isBlank = (v) => v == null || v === ''

const initValueFor = (field) => {
  if (field.defaultValue !== undefined) {
    if (field.type === 'spectrum' && field.defaultValue && typeof field.defaultValue === 'object') {
      return JSON.parse(JSON.stringify(field.defaultValue))
    }
    return typeof field.defaultValue === 'object' && field.defaultValue !== null
      ? JSON.parse(JSON.stringify(field.defaultValue))
      : field.defaultValue
  }
  if (field.type === 'spectrum') {
    const dims = field.dimensions || ['Value']
    return {
      mode: field.defaultMode || 'single',
      single: Object.fromEntries(dims.map((d) => [d, 0])),
      range:  Object.fromEntries(dims.map((d) => [d, { min: 0, max: 100 }])),
    }
  }
  if (field.type === 'range') return { min: 0, max: 100 }
  if (field.type === 'numeric-or-any') return { mode: 'any', value: 0 }
  if (field.type === 'numeric') return 0
  return null
}

const fieldIsValid = (field, value, allValues) => {
  if (field.visibleWhen && !field.visibleWhen(allValues)) return true
  if (field.required === false) return true

  switch (field.type) {
    case 'numeric':
      return !isBlank(value) && !Number.isNaN(Number(value))
    case 'range':
      if (!value) return false
      return !isBlank(value.min) && !isBlank(value.max) && Number(value.min) <= Number(value.max)
    case 'spectrum': {
      if (!value) return false
      const dims = field.dimensions || ['Value']
      if (value.mode === 'single') {
        return dims.every((d) => !isBlank(value.single?.[d]))
      }
      return dims.every((d) => {
        const r = value.range?.[d]
        return r && !isBlank(r.min) && !isBlank(r.max) && Number(r.min) <= Number(r.max)
      })
    }
    case 'choice':
      return !isBlank(value)
    case 'element-pick':
      return !isBlank(value)
    case 'numeric-or-any':
      if (!value) return false
      if (value.mode === 'any') return true
      return !isBlank(value.value) && !Number.isNaN(Number(value.value))
    case 'composite-row':
      return (field.fields || []).every((f) =>
        fieldIsValid(f, allValues[f.key], allValues),
      )
    default:
      return true
  }
}

const clamp = (v, min, max) => {
  if (Number.isNaN(v)) return min ?? 0
  if (typeof min === 'number' && v < min) return min
  if (typeof max === 'number' && v > max) return max
  return v
}

/* ============================================================
   Numeric input (atomic)
   ============================================================ */

function NumInput({ value, onChange, min, max, step = 1, suffix, ariaLabel, width = 64 }) {
  const handle = (e) => {
    const raw = e.target.value
    if (raw === '' || raw === '-') {
      onChange(raw)
      return
    }
    const v = parseFloat(raw)
    if (Number.isNaN(v)) {
      onChange(0)
      return
    }
    onChange(clamp(Math.round(v * 100) / 100, min, max))
  }
  return (
    <span className="ssc-num">
      <input
        type="number"
        className="ssc-num-input"
        style={{ width }}
        value={value}
        onChange={handle}
        min={min} max={max} step={step}
        aria-label={ariaLabel}
      />
      {suffix ? <span className="ssc-num-suffix">{suffix}</span> : null}
    </span>
  )
}

/* ============================================================
   Field renderers
   ============================================================ */

function NumericField({ field, value, onChange }) {
  return (
    <div className="ssc-field">
      <label className="ssc-field-row">
        <span className="ssc-field-label">{field.label}</span>
        <NumInput
          value={value ?? field.defaultValue ?? 0}
          onChange={onChange}
          min={field.min} max={field.max} step={field.step}
          suffix={field.suffix}
          ariaLabel={field.label}
        />
      </label>
      {field.help ? <span className="ssc-field-help">{field.help}</span> : null}
    </div>
  )
}

function RangeField({ field, value, onChange }) {
  const v = value || { min: 0, max: 100 }
  return (
    <div className="ssc-field">
      <span className="ssc-field-label">{field.label}</span>
      <span className="ssc-axis-row">
        <NumInput
          value={v.min}
          onChange={(min) => onChange({ ...v, min })}
          min={field.min} max={field.max} step={field.step}
          suffix={field.suffix} ariaLabel={`${field.label} min`}
        />
        <span className="ssc-axis-sep">–</span>
        <NumInput
          value={v.max}
          onChange={(max) => onChange({ ...v, max })}
          min={field.min} max={field.max} step={field.step}
          suffix={field.suffix} ariaLabel={`${field.label} max`}
        />
      </span>
      {field.help ? <span className="ssc-field-help">{field.help}</span> : null}
    </div>
  )
}

function SpectrumField({ field, value, onChange }) {
  const dims = field.dimensions || ['Value']
  const v = value || initValueFor(field)
  const setMode = (mode) => onChange({ ...v, mode })
  const setSingle = (dim, val) => onChange({ ...v, single: { ...v.single, [dim]: val } })
  const setRange = (dim, key, val) => onChange({
    ...v,
    range: { ...v.range, [dim]: { ...(v.range?.[dim] || { min: 0, max: 100 }), [key]: val } },
  })
  return (
    <div className="ssc-field ssc-field-spectrum">
      {field.label ? <span className="ssc-field-label">{field.label}</span> : null}
      <div className="ssc-mode-tabs" role="tablist" aria-label="Value or range">
        {['single', 'range'].map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={v.mode === m}
            className={`ssc-mode-tab ${v.mode === m ? 'is-active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'single' ? 'Single value' : 'Range'}
          </button>
        ))}
      </div>
      <div className={`ssc-spectrum-grid cols-${dims.length}`}>
        {dims.map((dim) => (
          <div key={dim} className="ssc-spectrum-cell">
            <span className="ssc-axis-name">{dim}</span>
            {v.mode === 'single' ? (
              <NumInput
                value={v.single?.[dim] ?? 0}
                onChange={(val) => setSingle(dim, val)}
                min={field.min} max={field.max} step={field.step}
                suffix={field.suffix || 'px'}
                ariaLabel={`${dim} value`}
              />
            ) : (
              <span className="ssc-axis-row">
                <NumInput
                  value={v.range?.[dim]?.min ?? 0}
                  onChange={(val) => setRange(dim, 'min', val)}
                  min={field.min} max={field.max} step={field.step}
                  suffix={field.suffix || 'px'}
                  ariaLabel={`${dim} min`}
                />
                <span className="ssc-axis-sep">–</span>
                <NumInput
                  value={v.range?.[dim]?.max ?? 0}
                  onChange={(val) => setRange(dim, 'max', val)}
                  min={field.min} max={field.max} step={field.step}
                  suffix={field.suffix || 'px'}
                  ariaLabel={`${dim} max`}
                />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ChoiceField({ field, value, onChange }) {
  const cols = field.cols || 1
  return (
    <div className="ssc-field">
      {field.label ? <span className="ssc-field-label">{field.label}</span> : null}
      <div
        className={`ssc-choice ${cols > 1 ? 'is-grid' : ''}`}
        role="radiogroup"
        aria-label={field.label}
        style={cols > 1 ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
      >
        {field.options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              className={`ssc-choice-opt ${active ? 'is-active' : ''}`}
              onClick={() => onChange(opt.value)}
            >
              <span className="ssc-choice-radio" aria-hidden="true">
                <span className="ssc-choice-radio-dot" />
              </span>
              <span className="ssc-choice-text">
                <span className="ssc-choice-label">{opt.label}</span>
                {opt.help ? <span className="ssc-choice-help">{opt.help}</span> : null}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ElementPickField({ field, value, onChange }) {
  const groups = field.groups || []
  return (
    <div className="ssc-field">
      {field.label ? <span className="ssc-field-label">{field.label}</span> : null}
      <div className="ssc-elgroup-list" role="radiogroup" aria-label={field.label || 'Pick element'}>
        {groups.map((g) => (
          <div key={g.label} className="ssc-elgroup">
            <div className="ssc-elgroup-head">{g.label}</div>
            <div className="ssc-elgroup-options">
              {g.components.map((c) => {
                const label = typeof c === 'string' ? c : c.label
                const val   = typeof c === 'string' ? c : c.canonical
                const active = value === val
                return (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`ssc-elopt ${active ? 'is-active' : ''}`}
                    onClick={() => onChange(val)}
                  >
                    {active && <span className="ssc-elopt-check" aria-hidden="true">✓</span>}
                    <span className="ssc-elopt-label">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NumericOrAnyField({ field, value, onChange }) {
  const v = value || { mode: 'any', value: 0 }
  return (
    <div className="ssc-field">
      {field.label ? <span className="ssc-field-label">{field.label}</span> : null}
      <div className="ssc-noa">
        <button
          type="button"
          role="radio"
          aria-checked={v.mode === 'any'}
          className={`ssc-choice-opt ssc-noa-any ${v.mode === 'any' ? 'is-active' : ''}`}
          onClick={() => onChange({ ...v, mode: 'any' })}
        >
          <span className="ssc-choice-radio" aria-hidden="true">
            <span className="ssc-choice-radio-dot" />
          </span>
          <span className="ssc-choice-text">
            <span className="ssc-choice-label">Any</span>
          </span>
        </button>
        <div
          className={`ssc-noa-value ${v.mode === 'value' ? 'is-active' : ''}`}
          onClick={() => v.mode !== 'value' && onChange({ ...v, mode: 'value' })}
        >
          <button
            type="button"
            role="radio"
            aria-checked={v.mode === 'value'}
            className={`ssc-choice-radio-btn ${v.mode === 'value' ? 'is-active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onChange({ ...v, mode: 'value' }) }}
            aria-label="Value"
          >
            <span className="ssc-choice-radio" aria-hidden="true">
              <span className="ssc-choice-radio-dot" />
            </span>
          </button>
          <span className="ssc-choice-label">Value:</span>
          <NumInput
            value={v.value ?? 0}
            onChange={(val) => onChange({ mode: 'value', value: val })}
            min={field.min} max={field.max} step={field.step}
            suffix={field.suffix || 'px'}
            ariaLabel={`${field.label} value`}
          />
        </div>
      </div>
    </div>
  )
}

function CompositeRowField({ field, allValues, setValue }) {
  const cols = (field.fields || []).length
  return (
    <div
      className="ssc-composite"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {(field.fields || []).map((sub) => (
        <div key={sub.key} className="ssc-composite-cell">
          <FieldRenderer
            field={sub}
            value={allValues[sub.key]}
            onChange={(val) => setValue(sub.key, val)}
            allValues={allValues}
            setValue={setValue}
          />
        </div>
      ))}
    </div>
  )
}

function FieldRenderer({ field, value, onChange, allValues, setValue }) {
  if (field.visibleWhen && !field.visibleWhen(allValues)) return null

  switch (field.type) {
    case 'numeric':
      return <NumericField field={field} value={value} onChange={onChange} />
    case 'range':
      return <RangeField field={field} value={value} onChange={onChange} />
    case 'spectrum':
      return <SpectrumField field={field} value={value} onChange={onChange} />
    case 'choice':
      return <ChoiceField field={field} value={value} onChange={onChange} />
    case 'element-pick':
      return <ElementPickField field={field} value={value} onChange={onChange} />
    case 'numeric-or-any':
      return <NumericOrAnyField field={field} value={value} onChange={onChange} />
    case 'composite-row':
      return <CompositeRowField field={field} allValues={allValues} setValue={setValue} />
    default:
      return null
  }
}

/* ============================================================
   Main component
   ============================================================ */

function ConditionConfigurator({
  form,
  ifCanonicals = [],
  onAddCondition,
  category = 'Custom',
  intro = { title: 'Configure condition', subtitle: '' },
  /* When the host wants to drive commit through its own primary CTA
     (e.g. the wizard's Next button), it can pass `hideAddCondition`
     to suppress the configurator's own footer button and listen for
     the live emission set via `onDraftChange`. The draft callback
     fires every time the form's `emit(values)` output changes; the
     host is responsible for committing them when appropriate. */
  hideAddCondition = false,
  onDraftChange,
}) {
  const initFromForm = React.useCallback(() => {
    const init = {}
    const walk = (fields) => {
      for (const f of fields || []) {
        if (f.type === 'composite-row') {
          walk(f.fields || [])
        } else {
          init[f.key] = initValueFor(f)
        }
      }
    }
    walk(form?.fields || [])
    return init
  }, [form])

  const [values, setValues] = React.useState(initFromForm)

  /* Reset when the form descriptor identity changes (user picked
     a different condition type — `form` is a fresh reference). */
  const formRef = React.useRef(form)
  React.useEffect(() => {
    if (formRef.current !== form) {
      formRef.current = form
      setValues(initFromForm())
    }
  }, [form, initFromForm])

  const setValue = (key, val) => setValues((prev) => ({ ...prev, [key]: val }))

  /* ── Validity + emissions ── */
  const allFieldsFlat = React.useMemo(() => {
    const out = []
    const walk = (fields) => {
      for (const f of fields || []) {
        if (f.type === 'composite-row') walk(f.fields || [])
        else out.push(f)
      }
    }
    walk(form?.fields || [])
    return out
  }, [form])

  const isValid = allFieldsFlat.every((f) => fieldIsValid(f, values[f.key], values))

  const emissions = React.useMemo(() => {
    if (!isValid || typeof form?.emit !== 'function') return []
    try {
      return form.emit(values) || []
    } catch {
      return []
    }
  }, [form, values, isValid])

  /* Notify the host of the live emission set so it can drive commit
     itself (used by the wizard's Next button to auto-commit a single
     condition draft without a separate "Add condition" click). */
  React.useEffect(() => {
    if (typeof onDraftChange === 'function') onDraftChange(emissions)
  }, [emissions, onDraftChange])

  const allAdded = emissions.length > 0 &&
    emissions.every((e) => ifCanonicals.includes(e.canonical))
  const hasSelect = emissions.length > 0
  const ctaDisabled = !hasSelect || allAdded
  const ctaLabel = !isValid ? 'Fill required fields'
    : allAdded   ? 'Already added'
    : !hasSelect ? 'Pick a value'
    : 'Add condition'

  const hintText = (() => {
    if (!hasSelect) return 'Set a value to continue.'
    const labels = emissions.map((e) => e.label).join(' AND ')
    return `Condition: ${labels}`
  })()

  const commit = () => {
    if (ctaDisabled) return
    emissions.forEach((e) => {
      if (!ifCanonicals.includes(e.canonical)) {
        onAddCondition(e.canonical, e.label, category)
      }
    })
  }

  return (
    <div className="ssc-root">
      <style>{STYLES}</style>

      <div className="ssc-body">
        {intro && (intro.title || intro.subtitle) ? (
          <div className="ssc-section-head">
            {intro.title    ? <span className="ssc-section-title">{intro.title}</span>    : null}
            {intro.subtitle ? <span className="ssc-section-sub">{intro.subtitle}</span>   : null}
          </div>
        ) : null}

        <div className="ssc-form">
          {(form?.fields || []).map((f) => (
            <FieldRenderer
              key={f.key}
              field={f}
              value={values[f.key]}
              onChange={(val) => setValue(f.key, val)}
              allValues={values}
              setValue={setValue}
            />
          ))}
        </div>
      </div>

      {/* The footer hint is always shown so the user gets live feedback
          on what their values translate to. The "Add condition" CTA is
          suppressed when the host (e.g. the wizard) drives commit
          through its own primary action — most rules need only a single
          condition, so the explicit add step is friction. */}
      <div className={`ssc-foot ${hideAddCondition ? 'is-hint-only' : ''}`}>
        <p className="ssc-hint" aria-live="polite">{hintText}</p>
        {!hideAddCondition && (
          <button
            type="button"
            className="ssc-cta"
            onClick={commit}
            disabled={ctaDisabled}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   Scoped CSS — uses :root design tokens with portable fallbacks.
   All selectors prefixed `.ssc-` to avoid clashes.
   ============================================================ */

const STYLES = `
.ssc-root {
  --ssc-bg:        var(--lb-bg, #FFFFFF);
  --ssc-shade-1:   var(--lb-shade-1, #F4F4F5);
  --ssc-shade-2:   var(--lb-shade-2, #E4E4E7);
  --ssc-shade-3:   var(--lb-shade-3, #D4D4D8);
  --ssc-text-1:    var(--lb-text-1, #18181B);
  --ssc-text-2:    var(--lb-text-2, #3F3F46);
  --ssc-text-3:    var(--lb-text-3, #71717A);
  --ssc-accent:    var(--lb-accent, #5B47E0);
  --ssc-accent-soft: var(--wiz-pop-tint, rgba(91,71,224,0.08));
  --ssc-accent-bd: rgba(91,71,224,0.32);
  --ssc-radius:    8px;
  --ssc-radius-sm: 6px;
  --ssc-ease:      var(--ease-out, cubic-bezier(0.22,1,0.36,1));
  --ssc-fs-xs:     var(--fs-xs, 11px);
  --ssc-fs-sm:     var(--fs-sm, 12px);
  --ssc-fs-md:     var(--fs-md, 13px);
  --ssc-fs-lg:     var(--fs-lg, 15px);
  --ssc-fw-reg:    var(--fw-regular, 400);
  --ssc-fw-med:    var(--fw-medium, 500);
  --ssc-tracking:  var(--tracking-tight, 0em);

  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 360px;
  max-width: 560px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, system-ui, sans-serif;
  color: var(--ssc-text-1);
  -webkit-font-smoothing: antialiased;
}

.ssc-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 2px 12px;
}

.ssc-section-head {
  display: flex; flex-direction: column; gap: 2px;
}
.ssc-section-title {
  font-size: var(--ssc-fs-md);
  font-weight: var(--ssc-fw-med);
  color: var(--ssc-text-1);
}
.ssc-section-sub {
  font-size: var(--ssc-fs-sm);
  color: var(--ssc-text-3);
  line-height: 1.4;
}

.ssc-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Field shell */
.ssc-field {
  display: flex; flex-direction: column;
  gap: 8px;
}
.ssc-field-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px;
  padding: 0;
}
.ssc-field-label {
  font-size: var(--ssc-fs-sm);
  font-weight: var(--ssc-fw-med);
  color: var(--ssc-text-2);
  letter-spacing: var(--ssc-tracking);
}
.ssc-field-help {
  font-size: var(--ssc-fs-xs);
  color: var(--ssc-text-3);
  line-height: 1.4;
}

/* Range / axis row */
.ssc-axis-row {
  display: inline-flex; align-items: center; gap: 6px;
  flex-wrap: wrap;
}
.ssc-axis-sep {
  color: var(--ssc-text-3);
  font-size: var(--ssc-fs-sm);
}
.ssc-axis-name {
  font-size: var(--ssc-fs-xs);
  font-weight: var(--ssc-fw-med);
  color: var(--ssc-text-2);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Spectrum (Single / Range mode toggle) */
.ssc-field-spectrum {
  padding: 12px 14px;
  background: var(--ssc-shade-1);
  border: 1px solid var(--ssc-shade-2);
  border-radius: var(--ssc-radius);
}
.ssc-mode-tabs {
  display: inline-flex;
  background: var(--ssc-bg);
  border: 1px solid var(--ssc-shade-2);
  border-radius: 999px;
  padding: 2px;
  gap: 0;
}
.ssc-mode-tab {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 5px 12px;
  font-family: inherit;
  font-size: var(--ssc-fs-sm);
  font-weight: var(--ssc-fw-med);
  color: var(--ssc-text-3);
  border-radius: 999px;
  cursor: pointer;
  transition: all 160ms var(--ssc-ease);
}
.ssc-mode-tab:hover { color: var(--ssc-text-1); }
.ssc-mode-tab.is-active {
  background: var(--ssc-accent);
  color: #fff;
}
.ssc-spectrum-grid {
  display: grid;
  gap: 12px;
}
.ssc-spectrum-grid.cols-1 { grid-template-columns: minmax(0, 1fr); }
.ssc-spectrum-grid.cols-2 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.ssc-spectrum-cell {
  display: flex; flex-direction: column; gap: 6px;
  padding: 10px 12px;
  background: var(--ssc-bg);
  border: 1px solid var(--ssc-shade-2);
  border-radius: var(--ssc-radius-sm);
}
/* Stretch the numeric input to fill the cell width so the WIDTH /
   HEIGHT card doesn't show a wide empty gutter to the right of the
   tiny "100 px" box. Both single-value and range modes participate. */
.ssc-spectrum-cell > .ssc-num {
  display: flex;
  width: 100%;
}
.ssc-spectrum-cell > .ssc-axis-row {
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: nowrap;
}
.ssc-spectrum-cell > .ssc-axis-row > .ssc-num {
  flex: 1 1 0;
  min-width: 0;
}
.ssc-spectrum-cell .ssc-num > .ssc-num-input {
  flex: 1 1 0;
  width: auto !important;
  min-width: 0;
}

/* Choice (radio list) */
.ssc-choice {
  display: flex; flex-direction: column;
  gap: 6px;
}
.ssc-choice.is-grid {
  display: grid;
  gap: 6px;
}
.ssc-choice-opt {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 9px 12px;
  background: var(--ssc-bg);
  border: 1px solid var(--ssc-shade-2);
  border-radius: var(--ssc-radius-sm);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 160ms var(--ssc-ease);
  width: 100%;
}
.ssc-choice-opt:hover {
  border-color: var(--ssc-shade-3);
  background: var(--ssc-shade-1);
}
.ssc-choice-opt.is-active {
  border-color: var(--ssc-accent-bd);
  background: var(--ssc-accent-soft);
}
.ssc-choice-opt:focus-visible {
  outline: 2px solid var(--ssc-accent);
  outline-offset: 2px;
}
.ssc-choice-radio {
  flex: 0 0 auto;
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px;
  border-radius: 999px;
  border: 1.5px solid var(--ssc-shade-3);
  background: var(--ssc-bg);
  transition: border-color 160ms var(--ssc-ease);
}
.ssc-choice-opt.is-active .ssc-choice-radio,
.ssc-noa-value.is-active .ssc-choice-radio {
  border-color: var(--ssc-accent);
}
.ssc-choice-radio-dot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--ssc-accent);
  opacity: 0;
  transition: opacity 160ms var(--ssc-ease);
}
.ssc-choice-opt.is-active .ssc-choice-radio-dot,
.ssc-noa-value.is-active .ssc-choice-radio-dot {
  opacity: 1;
}
.ssc-choice-text {
  display: flex; flex-direction: column; gap: 1px;
  min-width: 0;
}
.ssc-choice-label {
  font-size: var(--ssc-fs-sm);
  font-weight: var(--ssc-fw-med);
  color: var(--ssc-text-1);
  line-height: 1.3;
}
.ssc-choice-help {
  font-size: var(--ssc-fs-xs);
  color: var(--ssc-text-3);
  line-height: 1.3;
}

/* Element pick */
.ssc-elgroup-list {
  display: flex; flex-direction: column;
  gap: 10px;
  padding: 10px 12px;
  background: var(--ssc-shade-1);
  border-radius: var(--ssc-radius);
  border: 1px solid var(--ssc-shade-2);
  max-height: 280px;
  overflow-y: auto;
}
.ssc-elgroup { display: flex; flex-direction: column; gap: 4px; }
.ssc-elgroup-head {
  font-size: var(--ssc-fs-xs);
  font-weight: var(--ssc-fw-med);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ssc-text-3);
  padding: 0 2px;
}
.ssc-elgroup-options {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.ssc-elopt {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 10px;
  background: var(--ssc-bg);
  border: 1px solid var(--ssc-shade-2);
  border-radius: 999px;
  font-family: inherit;
  font-size: var(--ssc-fs-sm);
  color: var(--ssc-text-1);
  cursor: pointer;
  transition: all 160ms var(--ssc-ease);
}
.ssc-elopt:hover {
  background: var(--ssc-shade-1);
  border-color: var(--ssc-shade-3);
}
.ssc-elopt.is-active {
  background: var(--ssc-accent-soft);
  border-color: var(--ssc-accent-bd);
}
.ssc-elopt:focus-visible {
  outline: 2px solid var(--ssc-accent);
  outline-offset: 2px;
}
.ssc-elopt-check {
  font-size: var(--ssc-fs-xs);
  color: var(--ssc-accent);
}

/* Numeric-or-Any (Pinned offset etc.) */
.ssc-noa {
  display: flex; flex-direction: column;
  gap: 6px;
}
.ssc-noa-any { width: 100%; }
.ssc-noa-value {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 12px;
  background: var(--ssc-bg);
  border: 1px solid var(--ssc-shade-2);
  border-radius: var(--ssc-radius-sm);
  cursor: pointer;
  transition: all 160ms var(--ssc-ease);
}
.ssc-noa-value:hover {
  border-color: var(--ssc-shade-3);
  background: var(--ssc-shade-1);
}
.ssc-noa-value.is-active {
  border-color: var(--ssc-accent-bd);
  background: var(--ssc-accent-soft);
}
.ssc-choice-radio-btn {
  appearance: none; border: 0; background: transparent;
  padding: 0; cursor: pointer;
  display: inline-flex; align-items: center;
}
.ssc-choice-radio-btn:focus-visible {
  outline: 2px solid var(--ssc-accent);
  outline-offset: 2px;
  border-radius: 999px;
}

/* Composite row layout */
.ssc-composite {
  display: grid;
  gap: 14px;
  align-items: start;
}
.ssc-composite-cell {
  min-width: 0;
}

/* Numeric input atom */
.ssc-num {
  display: inline-flex; align-items: stretch;
  border: 1px solid var(--ssc-shade-2);
  border-radius: var(--ssc-radius-sm);
  background: var(--ssc-bg);
  overflow: hidden;
  transition: border-color 160ms var(--ssc-ease);
}
.ssc-num:focus-within { border-color: var(--ssc-accent); }
.ssc-num-input {
  padding: 6px 8px;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: var(--ssc-fs-sm);
  color: var(--ssc-text-1);
  text-align: right;
  -moz-appearance: textfield;
}
.ssc-num-input::-webkit-outer-spin-button,
.ssc-num-input::-webkit-inner-spin-button {
  -webkit-appearance: none; margin: 0;
}
.ssc-num-input:focus { outline: 0; }
.ssc-num-suffix {
  display: inline-flex; align-items: center;
  padding: 0 8px 0 4px;
  font-size: var(--ssc-fs-xs);
  color: var(--ssc-text-3);
  background: var(--ssc-shade-1);
  border-left: 1px solid var(--ssc-shade-2);
}

/* Footer (hint + CTA) */
.ssc-foot {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0 0;
  border-top: 1px solid var(--ssc-shade-2);
  margin-top: 2px;
}
/* When the host hides the "Add condition" button, the footer is
   purely an inline hint: lighten the visual weight by dropping the
   border + padding so the form blends naturally with the wizard. */
.ssc-foot.is-hint-only {
  padding: 4px 0 0;
  border-top: 0;
  margin-top: 0;
}
.ssc-hint {
  flex: 1 1 auto;
  margin: 0;
  font-size: var(--ssc-fs-xs);
  color: var(--ssc-text-3);
  line-height: 1.4;
  min-width: 0;
}
.ssc-cta {
  flex: 0 0 auto;
  padding: 9px 16px;
  background: var(--ssc-accent);
  color: #fff;
  border: 0;
  border-radius: 999px;
  font-family: inherit;
  font-size: var(--ssc-fs-sm);
  font-weight: var(--ssc-fw-med);
  cursor: pointer;
  transition: background-color 180ms var(--ssc-ease),
              opacity 180ms var(--ssc-ease);
}
.ssc-cta:hover:not(:disabled) { filter: brightness(0.94); }
.ssc-cta:focus-visible {
  outline: 2px solid var(--ssc-accent);
  outline-offset: 2px;
}
.ssc-cta:disabled {
  background: var(--ssc-shade-2);
  color: var(--ssc-text-3);
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .ssc-mode-tab, .ssc-choice-opt, .ssc-noa-value, .ssc-elopt, .ssc-num, .ssc-cta {
    transition: none !important;
  }
}
`

export default ConditionConfigurator
export { ConditionConfigurator }
