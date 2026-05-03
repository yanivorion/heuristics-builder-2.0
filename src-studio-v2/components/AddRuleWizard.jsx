import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ELEMENT_GROUPS,
  CONTEXT_OPTIONS,
  IF_OPTIONS,
  WIZARD_ACTIONS,
  PRIORITY_OPTIONS,
  ELEMENT_GROUP_DROPDOWN,
  CONDITION_TYPES,
  buildParametersString,
  buildPlainSentence,
  buildSentenceSegments,
  categoryForElementGroup,
  typeForCanonical,
  parseSizeCanonical,
  formatSizeLabel,
  parseSpacingCanonical,
  formatSpacingCanonical,
  formatSpacingLabel,
  actionsForCanonicals,
  parsePositionCanonical,
  formatPositionLabel,
  configForConditionType
} from '../addRuleWizardConfig'
import { WizardIcon, ContextIcon, ConditionIcon, ActionIcon } from './WizardIcons'
import WizardDiagram from './WizardDiagram'
import ConditionConfigurator from './ConditionConfigurator'

const STEPS = [
  { n: 1, label: 'Subject' },
  { n: 2, label: 'Context' },
  { n: 3, label: 'Condition' },
  { n: 4, label: 'Result' },
  { n: 5, label: 'Review' }
]

const STEP_QUESTIONS = {
  1: { q: 'What element is the heuristic about?', sub: 'Pick the object the rule should target' },
  2: { q: 'Choose Context', sub: 'Pick the parent container the rule should apply inside' },
  3: { q: 'What does it look like on desktop?', sub: 'Tell us what to look for on desktop. Add more checks with AND if you need.' },
  4: { q: 'What should we do on mobile?', sub: 'When the desktop matches, here\u2019s how mobile should look.' },
  5: { q: 'Review', sub: 'Verify everything looks correct before saving' }
}


const ACTION_DESCRIPTIONS = {
  'Set Size': 'Width, height, and scaling method',
  'Set Min Height': 'Minimum height constraint',
  'Set Margin': 'Outer spacing (top, right, bottom, left)',
  'Set Padding': 'Inner spacing (top, right, bottom, left)',
  'Set Alignment': 'Horizontal alignment position',
  'Set Rotation': 'Element rotation angle',
  'Set Visibility': 'Show or hide the element',
  'Set Spacing': 'Spacing between child elements',
  'Set Pinned': 'Pin to viewport with offset',
  'Set Font Size': 'Text size value',
  'Set OOG': 'Out-of-grid arrangement'
}

// Slugify a category tag ("Reset Scaling" → "reset-scaling") so the matching
// CSS class can theme the chip per-category. Used for `.wiz-tile-tag-*` and
// `.wd-result-tag-*`.
function tagSlug(tag) {
  return String(tag)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// localStorage key — stores the user's last entered values per action so
// custom inputs survive across action switches and across wizard sessions.
// Shape: { [actionKey]: { [fieldKey]: value } }
const PARAM_CACHE_KEY = 'heur:addRuleWizard:paramCache'

function loadParamCache() {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(PARAM_CACHE_KEY) : null
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveParamCache(cache) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PARAM_CACHE_KEY, JSON.stringify(cache))
    }
  } catch {
    // ignore quota / disabled storage errors
  }
}

/**
 * Build the initial paramFields object for an action: layered as
 *   field defaults  ←  cached user values  for this action.
 * Skips read-only `info` fields (they have no editable value).
 */
function initialParamFieldsFor(actionKey, cache) {
  const def = WIZARD_ACTIONS.find(a => a.action === actionKey)
  if (!def) return {}
  const cached = (cache && cache[actionKey]) || {}
  const out = {}
  for (const f of def.fields) {
    if (f.type === 'info') continue
    const cachedVal = cached[f.key]
    if (cachedVal != null && cachedVal !== '') out[f.key] = cachedVal
    else if (f.defaultValue != null) out[f.key] = f.defaultValue
  }
  return out
}


function flattenElements(extra = []) {
  const chips = []
  for (const g of ELEMENT_GROUPS) {
    for (const c of g.components) {
      if (typeof c === 'string') chips.push({ group: g.label, label: c, canonical: c })
      else chips.push({ group: g.label, label: c.label, canonical: c.canonical })
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
    for (const o of block.options) opts.push({ ...o, group: block.group })
  }
  for (const e of extra) {
    if (!opts.some(x => x.canonical === e.canonical)) opts.push(e)
  }
  return opts
}

// Feature flag: temporarily hide the Step 3 "Used before · pick to reuse"
// chip rows in all three configurator bodies (tile, position, size). Flip
// back to `true` to restore the offers UI without other code changes.
const SHOW_USED_BEFORE_OFFERS = false

export default function AddRuleWizard({ open, onClose, onSave, existingRows, prefillContext }) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [whenCanonicals, setWhenCanonicals] = useState([])
  const [whenGroupLabel, setWhenGroupLabel] = useState('')
  const [extraElements, setExtraElements] = useState([])
  const whenCanonical = whenCanonicals[0] || ''

  const [inCanonical, setInCanonical] = useState('Any')
  const [extraContexts, setExtraContexts] = useState([])

  const [ifCanonicals, setIfCanonicals] = useState([])
  const [extraIfs, setExtraIfs] = useState([])
  // Parallel array: ifOperators[i] is the operator BEFORE ifCanonicals[i].
  // ifOperators[0] is always '' (no operator before the first condition).
  // Subsequent entries are 'AND' | 'OR' (ELSE is no longer a between-
  // conditions operator; it lives as an optional fallback branch in Step 4).
  const [ifOperators, setIfOperators] = useState([])
  // When user clicks +AND/+OR inside a configurator we record the
  // operator that should attach to the NEXT canonical they add, then
  // navigate them back to the type-picker to choose condition #2's type.
  const [pendingOperator, setPendingOperator] = useState(null)
  // Live emission set from the active ConditionConfigurator. The
  // wizard treats this as a "draft" condition that doesn't need an
  // explicit "Add condition" click — Next (and +AND / +OR) commit it
  // automatically. Most rules use only a single condition, so the
  // dedicated commit step was friction.
  const [pendingDraft, setPendingDraft] = useState([])

  const [actionKey, setActionKey] = useState('Set Size')
  // Param-value cache, hydrated from localStorage on mount. The first
  // paramFields snapshot is seeded from this cache (per current actionKey)
  // so the user's last custom values survive across wizard sessions.
  const [paramCache, setParamCache] = useState(() => loadParamCache())
  const [paramFields, setParamFields] = useState(() => initialParamFieldsFor('Set Size', loadParamCache()))

  // Optional ELSE / fallback branch — configured at the end of Step 4.
  // When `elseEnabled` is true, the saved rule includes `else_action` +
  // `else_parameters`. ELSE param values share the same localStorage cache
  // as the primary action (keyed by their own actionKey), so switching
  // between primary/ELSE actions keeps custom values around.
  const [elseEnabled, setElseEnabled] = useState(false)
  const [elseActionKey, setElseActionKey] = useState('Set Visibility')
  const [elseParamFields, setElseParamFields] = useState(() => initialParamFieldsFor('Set Visibility', loadParamCache()))

  const [sizeInstanceQueue, setSizeInstanceQueue] = useState([])

  const [priority, setPriority] = useState(1)
  const [note, setNote] = useState('')

  const [openPanel, setOpenPanel] = useState(null)

  const [elementTab, setElementTab] = useState('elements') // 'elements' | 'library'

  const [addElementName, setAddElementName] = useState('')
  const [addElementGroup, setAddElementGroup] = useState('Layout')
  const [addContextText, setAddContextText] = useState('')
  const [addSizeIf, setAddSizeIf] = useState('')
  const [addSizeHeight, setAddSizeHeight] = useState('')

  // Step 3 — type-first condition flow.
  // condView is either 'picker' (the type-grid) or one of CONDITION_TYPES[].id.
  const [condView, setCondView] = useState('picker')
  // Step 3 / Position State — which row's dropdown is open.
  // Values: null | 'above' | 'below' | 'is' | 'is-not'.
  // Step 3 / type picker — whether the single condition-type dropdown is open.
  const [showCondTypeDropdown, setShowCondTypeDropdown] = useState(false)
  // All Step 3 condition configurators are now self-contained
  // `ConditionConfigurator` instances that own their own template
  // selection, alt-input, custom-range, and (for Position) element-pick
  // state. The wizard just feeds them their type-specific descriptor
  // and listens for emissions back through `handleAddCustomCondition`.

  // Step 4 — gate action choices by the selected condition types.
  // When the user has picked condition(s), Step 4 only shows the actions
  // allowed by those types unless `showAllActions` is on (escape hatch).
  const [showAllActions, setShowAllActions] = useState(false)

  const elementChips = useMemo(() => flattenElements(extraElements), [extraElements])
  const contextOptions = useMemo(() => {
    const base = [...CONTEXT_OPTIONS]
    for (const x of extraContexts) {
      if (!base.some(b => b.canonical === x.canonical)) base.push({ label: x.label, canonical: x.canonical })
    }
    return base
  }, [extraContexts])

  const ifOptionsFlat = useMemo(() => flattenIfOptions(extraIfs), [extraIfs])
  const ifCanonical = useMemo(() => ifCanonicals.join(' AND '), [ifCanonicals])

  /**
   * Tally previously-used conditions from existingRows, bucketed by type.
   * Each row's `r.if` may be a multi-clause string ("A AND B"); split first.
   * Result shape: { [typeId]: [{ canonical, count }, …] } sorted by count desc.
   */
  const offersByType = useMemo(() => {
    const counts = new Map()
    for (const r of existingRows || []) {
      if (!r?.if) continue
      const parts = String(r.if).split(/\s+AND\s+/i).map(s => s.trim()).filter(Boolean)
      for (const p of parts) {
        if (p === 'Any') continue
        counts.set(p, (counts.get(p) || 0) + 1)
      }
    }
    const out = {}
    for (const [canonical, count] of counts) {
      const t = typeForCanonical(canonical) || 'other'
      if (!out[t]) out[t] = []
      out[t].push({ canonical, count })
    }
    for (const t of Object.keys(out)) out[t].sort((a, b) => b.count - a.count)
    return out
  }, [existingRows])

  function toggleIf(canonical) {
    if (canonical === 'Any') {
      // Always-applies is mutually exclusive with everything else.
      setIfCanonicals(prev => (prev.length === 1 && prev[0] === 'Any') ? [] : ['Any'])
      setIfOperators([])
      setPendingOperator(null)
      return
    }
    setIfCanonicals(prev => {
      const filtered = prev.filter(c => c !== 'Any')
      const wasAny = filtered.length !== prev.length
      const idx = filtered.indexOf(canonical)
      if (idx >= 0) {
        // Remove canonical AND its preceding operator (or reset operators[0] if removing first).
        setIfOperators(ops => {
          if (wasAny) return []
          const next = ops.slice()
          if (idx < next.length) next.splice(idx, 1)
          if (next.length > 0) next[0] = ''
          return next
        })
        return filtered.filter(c => c !== canonical)
      }
      // Adding — append pendingOperator (default 'AND') unless this is the first canonical.
      setIfOperators(ops => {
        if (wasAny || filtered.length === 0) return ['']
        return [...ops, pendingOperator || 'AND']
      })
      return [...filtered, canonical]
    })
    setPendingOperator(null)
  }
  function toggleWhen(canonical, group) {
    setWhenCanonicals(prev => prev.includes(canonical) ? prev.filter(c => c !== canonical) : [...prev, canonical])
    if (group) setWhenGroupLabel(group)
  }

  const actionDef = WIZARD_ACTIONS.find(a => a.action === actionKey) || WIZARD_ACTIONS[0]
  const elseActionDef = WIZARD_ACTIONS.find(a => a.action === elseActionKey) || WIZARD_ACTIONS[0]

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key !== 'Escape') return
      if (step === 5) onClose()
      else if (step > 1) setStep(s => s - 1)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => { setOpenPanel(null) }, [step])

  // The configurator's draft is only meaningful while the user is on
  // a specific condition type. When they switch back to the picker
  // (or pick a different type) the previous draft is no longer
  // relevant — clear it so a stale draft can't keep `canNext` true.
  // The new configurator will re-emit its own initial emissions on
  // mount so the draft repopulates immediately.
  useEffect(() => { setPendingDraft([]) }, [condView])
  // Leaving Step 3 entirely also discards any uncommitted draft.
  useEffect(() => { if (step !== 3) setPendingDraft([]) }, [step])

  useEffect(() => {
    if (!open) return
    setStep(1); setWhenCanonicals([]); setWhenGroupLabel(''); setExtraElements([])
    setInCanonical(prefillContext && prefillContext !== '' ? prefillContext : 'Any')
    setExtraContexts([]); setIfCanonicals([]); setExtraIfs([])
    setIfOperators([]); setPendingOperator(null); setPendingDraft([])
    setActionKey('Set Size')
    setParamFields(initialParamFieldsFor('Set Size', loadParamCache()))
    setElseEnabled(false)
    setElseActionKey('Set Visibility')
    setElseParamFields(initialParamFieldsFor('Set Visibility', loadParamCache()))
    setSizeInstanceQueue([])
    setPriority(1); setNote(''); setOpenPanel(null); setSaving(false)
    setElementTab('elements')
    setCondView('picker')
    // ConditionConfigurator instances are remounted whenever the user
    // re-enters a different condition body, so per-type drafts (Size /
    // Padding / Margin / Position element-pick) reset themselves.
    setShowAllActions(false)
    setShowCondTypeDropdown(false)
  }, [open, prefillContext])

  // Close the condition-type dropdown on outside click / Escape.
  useEffect(() => {
    if (!showCondTypeDropdown) return
    const onDown = (e) => {
      const inside = e.target.closest && e.target.closest('[data-cond-type-dropdown]')
      if (!inside) setShowCondTypeDropdown(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setShowCondTypeDropdown(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [showCondTypeDropdown])

  // (Position State element dropdowns are now owned by
  // `ConditionConfigurator` and don't need a global outside-click effect.)

  // When the user picks a different action, hydrate paramFields from
  // (cached values for that action) ← (action's defaultValue per field)
  // so previously-entered custom values come back, and brand-new actions
  // start with sensible defaults instead of empty inputs.
  useEffect(() => {
    if (!open) return
    setParamFields(initialParamFieldsFor(actionKey, paramCache))
  }, [actionKey, open, paramCache])

  // Persist edited param values to localStorage so "custom values last"
  // across action switches and across full wizard sessions. We only mirror
  // editable fields (info fields are presets and never read from cache).
  const updateParamField = useCallback((fieldKey, value) => {
    setParamFields(prev => ({ ...prev, [fieldKey]: value }))
    setParamCache(prev => {
      const nextForAction = { ...(prev[actionKey] || {}), [fieldKey]: value }
      const next = { ...prev, [actionKey]: nextForAction }
      saveParamCache(next)
      return next
    })
  }, [actionKey])

  // Same hydration + cache pattern for the optional ELSE branch.
  useEffect(() => {
    if (!open) return
    setElseParamFields(initialParamFieldsFor(elseActionKey, paramCache))
  }, [elseActionKey, open, paramCache])

  const updateElseParamField = useCallback((fieldKey, value) => {
    setElseParamFields(prev => ({ ...prev, [fieldKey]: value }))
    setParamCache(prev => {
      const nextForAction = { ...(prev[elseActionKey] || {}), [fieldKey]: value }
      const next = { ...prev, [elseActionKey]: nextForAction }
      saveParamCache(next)
      return next
    })
  }, [elseActionKey])

  // When entering Step 4, ensure the chosen action is one allowed by the
  // selected condition types (unless the user has opted into "Show all").
  useEffect(() => {
    if (!open || step !== 4) return
    const allowed = actionsForCanonicals(ifCanonicals)
    if (showAllActions || !allowed || allowed.length === 0) return
    if (!allowed.includes(actionKey)) setActionKey(allowed[0])
  }, [open, step, ifCanonicals, showAllActions, actionKey])

  const labelForIf = useCallback(canonical => {
    const found = ifOptionsFlat.find(o => o.canonical === canonical)
    if (found) return found.label
    const sized = parseSizeCanonical(canonical)
    if (sized) return formatSizeLabel(sized.dim, sized.min, sized.max)
    const spaced = parseSpacingCanonical(canonical)
    if (spaced) return formatSpacingLabel(spaced.kind, spaced.min, spaced.max)
    const pos = parsePositionCanonical(canonical)
    if (pos) return formatPositionLabel(canonical)
    return canonical
  }, [ifOptionsFlat])

  // Short label for a Position State pick — just the right-hand value
  // (e.g. "Same Type", "Section", "Logo"). Used inside the dropdown trigger
  // and the per-row pick chips.
  const labelForPositionValue = useCallback(canonical => {
    const p = parsePositionCanonical(canonical)
    if (!p) return canonical
    if (p.value === 'Logo Component') return 'Logo'
    return p.value
  }, [])

  const ifDisplayLabel = useMemo(
    () => ifCanonicals.map(labelForIf).join(' AND '),
    [labelForIf, ifCanonicals]
  )
  const sentenceSegments = useMemo(() => {
    if (!whenCanonical || !inCanonical || ifCanonicals.length === 0 || !actionKey) return []
    const p = buildParametersString(actionKey, paramFields)
    return buildSentenceSegments(whenCanonical, inCanonical, ifCanonical, actionKey, p, ifDisplayLabel)
  }, [whenCanonical, inCanonical, ifCanonicals, ifCanonical, actionKey, paramFields, ifDisplayLabel])

  const step2Notice = useMemo(() => {
    if (step !== 2 || whenCanonicals.length === 0 || !inCanonical) return null
    const n = existingRows.filter(r => whenCanonicals.includes(r.when) && r.in === inCanonical).length
    if (n === 0) return null
    const ctx = contextOptions.find(c => c.canonical === inCanonical)?.label || inCanonical
    if (whenCanonicals.length === 1) {
      const el = whenCanonical === 'Any' ? 'Any element' : whenCanonical
      return `${el} already has ${n} rule(s) scoped to ${ctx}.`
    }
    return `Selected subjects already have ${n} rule(s) scoped to ${ctx}.`
  }, [whenCanonicals, whenCanonical, inCanonical, existingRows, contextOptions, step])

  const conflicts = useMemo(() => {
    if (step < 5 || whenCanonicals.length === 0 || !inCanonical || !actionKey) return []
    return existingRows.filter(r => whenCanonicals.includes(r.when) && r.in === inCanonical && r.action === actionKey)
  }, [step, whenCanonicals, inCanonical, actionKey, existingRows])

  const canNext = useCallback(() => {
    if (step === 1) return whenCanonicals.length > 0
    if (step === 2) return !!inCanonical
    // Step 3 accepts either an already-committed condition or a live
    // valid draft from the active ConditionConfigurator — the draft
    // is auto-committed when Next is clicked.
    if (step === 3) return ifCanonicals.length > 0 || pendingDraft.length > 0
    if (step === 4) {
      const p = buildParametersString(actionKey, paramFields)
      return !!actionKey && p.length > 0
    }
    return true
  }, [step, whenCanonicals, inCanonical, ifCanonicals, pendingDraft, actionKey, paramFields])

  const openAddPanel = key => setOpenPanel(prev => (prev === key ? null : key))

  function handleAddElement() {
    const name = addElementName.trim()
    if (!name) return
    if (elementChips.some(c => c.canonical.toLowerCase() === name.toLowerCase())) return
    setExtraElements(prev => [...prev, { label: name, canonical: name, group: addElementGroup }])
    setWhenCanonicals(prev => prev.includes(name) ? prev : [...prev, name])
    setWhenGroupLabel(addElementGroup); setAddElementName(''); setOpenPanel(null)
  }
  function handleAddContext() {
    const t = addContextText.trim()
    if (!t) return
    const canonical = t.includes('›') ? t.replace(/\s*›\s*/g, ' › ') : t
    setExtraContexts(prev => [...prev, { label: t, canonical }])
    setInCanonical(canonical); setAddContextText(''); setOpenPanel(null)
  }
  /**
   * Add a freshly-authored condition (e.g. a custom Size range) to both the
   * pickable list (`extraIfs`) and the active selection (`ifCanonicals`),
   * de-duping on canonical so reused offers stay single entries.
   */
  function handleAddCustomCondition(canonical, label, group) {
    if (!canonical) return
    setExtraIfs(prev => prev.some(x => x.canonical === canonical)
      ? prev
      : [...prev, { canonical, label: label || canonical, group: group || 'Custom' }])
    setIfCanonicals(prev => {
      const filtered = prev.filter(c => c !== 'Any')
      const wasAny = filtered.length !== prev.length
      if (filtered.includes(canonical)) return filtered
      setIfOperators(ops => {
        if (wasAny || filtered.length === 0) return ['']
        return [...ops, pendingOperator || 'AND']
      })
      return [...filtered, canonical]
    })
    setPendingOperator(null)
  }
  /**
   * Commit the live draft emitted by the active ConditionConfigurator
   * into `ifCanonicals`. Called by the wizard's Next button and by
   * +AND / +OR so the user never has to click an explicit "Add
   * condition" button for the common single-condition case.
   *
   * Returns true when at least one canonical was committed (or was
   * already present), false when there was nothing to commit.
   */
  function commitPendingDraft() {
    if (!pendingDraft || pendingDraft.length === 0) return false
    const cfg = condView !== 'picker' ? configForConditionType(condView) : null
    const cat = cfg?.category || 'Custom'
    pendingDraft.forEach(e => {
      if (!e || !e.canonical) return
      handleAddCustomCondition(e.canonical, e.label || e.canonical, cat)
    })
    setPendingDraft([])
    return true
  }
  function handleAddSizeInstance() {
    if (actionKey !== 'Set Size') return
    const cond = addSizeIf.trim(), h = addSizeHeight.trim()
    if (!cond || !h) return
    setSizeInstanceQueue(prev => [...prev, { ifCanon: cond, parameters: `Height: ${h}` }])
    setAddSizeIf(''); setAddSizeHeight(''); setOpenPanel(null)
  }

  async function handleSave() {
    const parameters = buildParametersString(actionKey, paramFields)
    // Optional ELSE / fallback action — emitted as additional fields on the
    // row (`else_action`, `else_parameters`) so consumers that don't care
    // about ELSE keep working unchanged.
    const elseParameters = elseEnabled ? buildParametersString(elseActionKey, elseParamFields) : ''
    const subjects = whenCanonicals.length > 0 ? whenCanonicals : [whenCanonical]
    const rowsToSave = []
    for (const subj of subjects) {
      const category = categoryForElementGroup(elementChips.find(c => c.canonical === subj)?.group || whenGroupLabel || 'Custom')
      const summaryText = buildPlainSentence(subj, inCanonical, ifCanonical, actionKey, parameters, ifDisplayLabel)
      const baseRow = {
        category,
        when: subj,
        in: inCanonical,
        if: ifCanonical,
        action: actionKey,
        parameters,
        summary: summaryText,
        priority,
        status: 'Mapped',
        note: note.trim()
      }
      if (elseEnabled) {
        baseRow.else_action = elseActionKey
        baseRow.else_parameters = elseParameters
      }
      rowsToSave.push(baseRow)
      for (const q of sizeInstanceQueue) {
        const ifLabQ = ifOptionsFlat.find(o => o.canonical === q.ifCanon)?.label || q.ifCanon
        const secSummary = buildPlainSentence(subj, inCanonical, q.ifCanon, actionKey, q.parameters, ifLabQ)
        const queuedRow = { ...baseRow, if: q.ifCanon, parameters: q.parameters, summary: secSummary }
        rowsToSave.push(queuedRow)
      }
    }
    setSaving(true)
    try { await onSave(rowsToSave); onClose() } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  if (!open) return null

  const panelOnly = key => openPanel === key
  const lockContext = Boolean(prefillContext && String(prefillContext).trim() !== '')

  return (
    <div className="wiz-page" role="dialog" aria-modal="true" aria-labelledby="wiz-title">
      <nav className="wiz-topbar">
        <h1 id="wiz-title" className="wiz-topbar-title">New Heuristic</h1>
        <button type="button" className="wiz-topbar-close" onClick={onClose} aria-label="Close">
          <span className="wiz-close-x">&times;</span>
        </button>
      </nav>

      <div className="wiz-scroll wiz-scroll-split">
        <div className="wiz-center">
          <div className="wiz-head">
            <h2 className="wiz-question">{STEP_QUESTIONS[step].q}</h2>
            <p className="wiz-subtitle">
              {STEP_QUESTIONS[step].sub}
              {step === 1 && (
                <>
                  , or <button type="button" className="wiz-inline-link" onClick={() => openAddPanel('el')}>Add New</button>
                </>
              )}
            </p>
          </div>

          {/* ════ STEP 1: Element ════ */}
          {step === 1 && (() => {
            const concreteChips = elementChips.filter(c => c.group !== 'Catch-all')
            const catchAllChips = elementChips.filter(c => c.group === 'Catch-all')
            const customChips = extraElements
            const libraryChips = [...catchAllChips, ...customChips.filter(c => !catchAllChips.some(x => x.canonical === c.canonical))]
            const renderTile = c => {
              const isSelected = whenCanonicals.includes(c.canonical)
              return (
                <button
                  key={`${c.group}-${c.canonical}`}
                  type="button"
                  className={`wiz-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleWhen(c.canonical, c.group)}
                >
                  {isSelected && <span className="wiz-tile-check">&#x2713;</span>}
                  <span className="wiz-tile-icon"><WizardIcon name={c.canonical} /></span>
                  <span className="wiz-tile-name">{c.label}</span>
                </button>
              )
            }
            const groupedConcrete = ELEMENT_GROUPS
              .filter(g => g.id !== 'catch-all')
              .map(g => ({
                label: g.label,
                chips: concreteChips.filter(c => c.group === g.label)
              }))
              .filter(g => g.chips.length > 0)
            return (
            <div className="wiz-step-body wiz-step-lanes">
              <div className="wiz-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={elementTab === 'elements'}
                  className={`wiz-tab ${elementTab === 'elements' ? 'active' : ''}`}
                  onClick={() => setElementTab('elements')}
                >Elements</button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={elementTab === 'library'}
                  className={`wiz-tab ${elementTab === 'library' ? 'active' : ''}`}
                  onClick={() => setElementTab('library')}
                >Library</button>
              </div>
              {whenCanonicals.length > 1 && (
                <div className="wiz-notice green">{whenCanonicals.length} subjects selected — a separate rule will be created for each</div>
              )}

              {elementTab === 'elements' ? (
                groupedConcrete.length === 0 ? (
                  <div className="wiz-tile-empty">Nothing here yet — click <em>Add New</em> above to create one.</div>
                ) : (
                  groupedConcrete.map(g => (
                    <React.Fragment key={g.label}>
                      <div className="wiz-group-head">{g.label}</div>
                      <div className="wiz-tile-grid wiz-tile-grid-3">
                        {g.chips.map(renderTile)}
                      </div>
                    </React.Fragment>
                  ))
                )
              ) : (
                libraryChips.length === 0 ? (
                  <div className="wiz-tile-empty">Nothing here yet — click <em>Add New</em> above to create one.</div>
                ) : (
                  <>
                    {catchAllChips.length > 0 && (
                      <>
                        <div className="wiz-group-head">Catch-all</div>
                        <div className="wiz-tile-grid wiz-tile-grid-3">
                          {catchAllChips.map(renderTile)}
                        </div>
                      </>
                    )}
                    {customChips.length > 0 && (
                      <>
                        <div className="wiz-group-head">Your elements</div>
                        <div className="wiz-tile-grid wiz-tile-grid-3">
                          {customChips.map(renderTile)}
                        </div>
                      </>
                    )}
                  </>
                )
              )}

              {panelOnly('el') && (
                <WizardModal title="Add a new element type" onClose={() => setOpenPanel(null)}>
                  <label className="wiz-panel-field">Name<input value={addElementName} onChange={e => setAddElementName(e.target.value)} placeholder="Component name" autoFocus /></label>
                  <label className="wiz-panel-field">Group<select value={addElementGroup} onChange={e => setAddElementGroup(e.target.value)}>{ELEMENT_GROUP_DROPDOWN.map(g => <option key={g} value={g}>{g}</option>)}</select></label>
                  <div className="wiz-panel-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddElement}>Add</button>
                  </div>
                </WizardModal>
              )}
            </div>
            )})()}

          {/* ════ STEP 2: Context ════ */}
          {step === 2 && (() => {
            const orderedCtx = [
              ...contextOptions.filter(c => c.canonical !== 'Any Parent'),
              ...contextOptions.filter(c => c.canonical === 'Any Parent')
            ]
            return (
            <div className="wiz-step-body wiz-step-lanes">
              {lockContext && <div className="wiz-notice blue">Context is locked to your active table filter.</div>}
              {step2Notice && <div className="wiz-notice green">{step2Notice}</div>}
              <div className="wiz-tile-grid">
                {orderedCtx.map(c => (
                  <button
                    key={c.canonical}
                    type="button"
                    disabled={lockContext && inCanonical !== c.canonical}
                    className={`wiz-tile ${inCanonical === c.canonical ? 'selected' : ''} ${c.canonical === 'Any Parent' ? 'wiz-tile-any' : ''}`}
                    onClick={() => { if (!lockContext) setInCanonical(c.canonical) }}
                  >
                    <span className="wiz-tile-icon"><ContextIcon name={c.canonical} /></span>
                    <span className="wiz-tile-name">{c.label}</span>
                  </button>
                ))}
              </div>

              {!lockContext && (
                <button type="button" className="wiz-add-btn" onClick={() => openAddPanel('ctx')}>+ Add new context</button>
              )}
              {panelOnly('ctx') && (
                <WizardModal title="Add a new context" onClose={() => setOpenPanel(null)}>
                  <label className="wiz-panel-field">Context<input value={addContextText} onChange={e => setAddContextText(e.target.value)} placeholder='e.g. Section › CSS Grid' autoFocus /></label>
                  <div className="wiz-panel-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddContext}>Add</button>
                  </div>
                </WizardModal>
              )}
            </div>
            )})()}

          {/* ════ STEP 3: Condition ════ */}
          {step === 3 && (() => {
            // ── Selected-chips strip (rendered with real per-pair operators) ──
            const SelectedStrip = () => {
              if (ifCanonicals.length === 0) return null
              return (
                <div className="wiz-cond-selected" aria-label="Selected conditions">
                  {ifCanonicals.map((c, i) => {
                    const op = i > 0 ? (ifOperators[i] || 'AND') : ''
                    return (
                      <React.Fragment key={c}>
                        {op && (
                          <span className={`wiz-cond-op wiz-cond-op-${op.toLowerCase()}`}>{op}</span>
                        )}
                        <span className="wiz-cond-chip">
                          <span className="wiz-cond-chip-text">{labelForIf(c)}</span>
                          <button
                            type="button"
                            className="wiz-cond-chip-x"
                            aria-label={`Remove ${labelForIf(c)}`}
                            onClick={() => toggleIf(c)}
                          >&times;</button>
                        </span>
                      </React.Fragment>
                    )
                  })}
                </div>
              )
            }

            // ── +AND / +OR operator row (rendered at the bottom of a
            //    configurator). Stores `pendingOperator` so the next added
            //    canonical attaches with the right join, then sends the user
            //    back to the type-picker to pick condition #2's type. ELSE
            //    is now an optional fallback branch on Step 4 (not a join).
            //
            //    First commits any live draft emitted by the active
            //    configurator so users who fill out a form and click +AND /
            //    +OR don't lose their in-progress condition.
            const onAddOp = (op) => {
              commitPendingDraft()
              setPendingOperator(op)
              setCondView('picker')
            }
            const OperatorRow = () => {
              // The row is meaningful as soon as there's anything that
              // could become condition #1 — committed canonicals OR a live
              // draft. Showing it during draft lets the user split into
              // AND/OR without first having to click "Add condition".
              if (ifCanonicals.length === 0 && pendingDraft.length === 0) return null
              return (
                <>
                  <div className="wiz-group-head">Add another condition</div>
                  <div className="wiz-cond-add-ops">
                    <button type="button" className="wiz-op-btn wiz-op-and" onClick={() => onAddOp('AND')}>
                      <span className="wiz-op-glyph" aria-hidden>&#43;</span>
                      <span className="wiz-op-body">
                        <span className="wiz-op-name">AND</span>
                        <span className="wiz-op-desc">Both must be true</span>
                      </span>
                    </button>
                    <button type="button" className="wiz-op-btn wiz-op-or" onClick={() => onAddOp('OR')}>
                      <span className="wiz-op-glyph" aria-hidden>&#43;</span>
                      <span className="wiz-op-body">
                        <span className="wiz-op-name">OR</span>
                        <span className="wiz-op-desc">Either can be true</span>
                      </span>
                    </button>
                  </div>
                  <p className="wiz-op-hint">
                    Need a fallback? Configure an ELSE branch in <strong>Step 4</strong> after picking the main action.
                  </p>
                </>
              )
            }

            // ── Unified Step 3 layout ──
            // The dropdown trigger is always visible at the top of the step.
            // When a condition type has been chosen via the dropdown, that
            // type's sub-conditions render INLINE directly under the dropdown
            // (no view swap, same scroll position).
            const anyOn = ifCanonicals.length === 1 && ifCanonicals[0] === 'Any'
            const nextNum = ifCanonicals.length + 1
            const pickerHeader = pendingOperator
              ? `Pick a type for condition #${nextNum}`
              : 'Pick a condition type'

            const activeType = condView !== 'picker'
              ? CONDITION_TYPES.find(t => t.id === condView)
              : null
            // Recover from a stale condView pointing at a removed type.
            if (condView !== 'picker' && !activeType) {
              setCondView('picker')
              return null
            }
            const triggerIconName = activeType ? (activeType.members[0] || activeType.id) : null
            const offers = activeType ? (offersByType[activeType.id] || []).slice(0, 6) : []
            const type = activeType // re-export under the original name used by the per-type renderers below

            // ── Unified condition body ──
            // Every Step 3 condition type now flows through the generic
            // `ConditionConfigurator` v2 — a direct form-based UI (no
            // strategy cards, no mini-diagrams). Per-type form descriptors
            // come from `configForConditionType(type.id)`.
            //
            // The "Used before" offers strip below stays as a sibling so
            // the two surfaces don't compete: the form is the primary
            // path; offers are a shortcut to canonicals already used on
            // earlier rules. Spacing labels via `formatPositionLabel`,
            // size/padding/margin via their respective formatters,
            // everything else falls back to `labelForIf`.
            const renderConditionBody = () => {
              const cfg = configForConditionType(type.id)
              if (!cfg) return null

              const offerLabelFor = (canonical) => {
                if (type.id === 'position') return formatPositionLabel(canonical)
                if (type.id === 'size') {
                  const s = parseSizeCanonical(canonical)
                  if (s) return formatSizeLabel(s.dim, s.min, s.max, 600)
                }
                if (type.id === 'padding' || type.id === 'margin') {
                  const sp = parseSpacingCanonical(canonical)
                  if (sp) return formatSpacingLabel(sp.kind, sp.min, sp.max, 80)
                }
                return labelForIf(canonical)
              }

              return (
                <>
                  <ConditionConfigurator
                    form={cfg.form}
                    ifCanonicals={ifCanonicals}
                    onAddCondition={handleAddCustomCondition}
                    category={cfg.category}
                    intro={cfg.intro}
                    /* Hide the configurator's own "Add condition" CTA —
                       the wizard's Next button auto-commits the live
                       draft so the most common (single-condition) flow
                       is one click instead of two. */
                    hideAddCondition
                    onDraftChange={setPendingDraft}
                  />

                  {SHOW_USED_BEFORE_OFFERS && offers.length > 0 && (
                    <>
                      <div className="wiz-group-head">Used before · pick to reuse</div>
                      <div className="wiz-offers-row">
                        {offers.map(({ canonical, count }) => {
                          const on = ifCanonicals.includes(canonical)
                          return (
                            <button
                              key={canonical}
                              type="button"
                              className={`wiz-offer-chip ${on ? 'on' : ''}`}
                              onClick={() => {
                                if (on) {
                                  toggleIf(canonical)
                                } else {
                                  handleAddCustomCondition(canonical, offerLabelFor(canonical), cfg.category)
                                }
                              }}
                            >
                              <span className="wiz-offer-chip-text">{offerLabelFor(canonical)}</span>
                              <span className="wiz-offer-count">{count}</span>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </>
              )
            }

            // ── Unified Step 3 return ──
            // Always renders: shared notices/recap, the dropdown trigger,
            // then the active type's inline configurator body, then the
            // selection strip and the AND/OR operator row.
            return (
              <div className="wiz-step-body wiz-step-lanes">
                <SelectedStrip />
                {pendingOperator && ifCanonicals.length > 0 && (
                  <div className="wiz-prev-recap" aria-label="Previously selected">
                    <div className="wiz-group-head wiz-prev-recap-head">Previously selected</div>
                    <div className="wiz-tile-grid wiz-tile-grid-recap">
                      {ifCanonicals.map((c) => (
                        <div key={c} className="wiz-tile selected wiz-tile-locked" aria-disabled="true">
                          <span className="wiz-tile-check">&#x2713;</span>
                          <span className="wiz-tile-icon"><ConditionIcon name={c} /></span>
                          <span className="wiz-tile-name">{labelForIf(c)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {pendingOperator && (
                  <div className="wiz-notice blue wiz-notice-op">
                    <span>
                      Adding condition #{nextNum} joined with{' '}
                      <strong className={`wiz-cond-op wiz-cond-op-${pendingOperator.toLowerCase()}`}>
                        {pendingOperator}
                      </strong>. Pick a type to continue.
                    </span>
                    <button
                      type="button"
                      className="wiz-inline-link"
                      onClick={() => setPendingOperator(null)}
                    >Cancel</button>
                  </div>
                )}
                {ifCanonicals.length > 1 && !pendingOperator && (
                  <div className="wiz-notice green">{ifCanonicals.length} conditions selected</div>
                )}
                <div className="wiz-group-head">{pickerHeader}</div>

                {/* Always-visible condition-type dropdown trigger. */}
                <div className="wiz-cond-type-dropdown" data-cond-type-dropdown>
                  <button
                    type="button"
                    className={`wiz-cond-type-trigger ${activeType ? 'has-pick' : ''} ${showCondTypeDropdown ? 'is-open' : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={showCondTypeDropdown}
                    onClick={() => setShowCondTypeDropdown(v => !v)}
                  >
                    {activeType && (
                      <span className="wiz-cond-type-trigger-icon">
                        <ConditionIcon name={triggerIconName} />
                      </span>
                    )}
                    <span className={`wiz-cond-type-trigger-label ${activeType ? 'has-pick' : ''}`}>
                      {activeType ? activeType.label : 'Choose condition type…'}
                    </span>
                    <span className="wiz-cond-type-trigger-chevron" aria-hidden="true">▾</span>
                  </button>

                  {showCondTypeDropdown && (
                    <div className="wiz-cond-type-popover" role="listbox">
                      {CONDITION_TYPES.map(t => {
                        const iconName = t.members[0] || t.id
                        const on = activeType && activeType.id === t.id
                        return (
                          <button
                            key={t.id}
                            type="button"
                            role="option"
                            aria-selected={!!on}
                            className={`wiz-cond-type-option ${on ? 'on' : ''}`}
                            onClick={() => { setCondView(t.id); setShowCondTypeDropdown(false) }}
                            title={t.desc}
                          >
                            <span className="wiz-cond-type-option-icon">
                              <ConditionIcon name={iconName} />
                            </span>
                            <span className="wiz-cond-type-option-text">
                              <span className="wiz-cond-type-option-label">{t.label}</span>
                              <span className="wiz-cond-type-option-desc">{t.desc}</span>
                            </span>
                          </button>
                        )
                      })}
                      <div className="wiz-cond-type-popover-divider" />
                      <button
                        type="button"
                        role="option"
                        aria-selected={anyOn}
                        className={`wiz-cond-type-option wiz-cond-type-option-any ${anyOn ? 'on' : ''}`}
                        onClick={() => { toggleIf('Any'); setShowCondTypeDropdown(false); setCondView('picker') }}
                      >
                        <span className="wiz-cond-type-option-text">
                          <span className="wiz-cond-type-option-label">Always applies</span>
                          <span className="wiz-cond-type-option-desc">No conditions — the rule fires every time.</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline configurator body for the picked type — shown
                    immediately under the dropdown, no view swap. Every
                    type goes through the generic ConditionConfigurator
                    via `configForConditionType(type.id)`. */}
                {activeType && renderConditionBody()}

                <SelectedStrip />
                <OperatorRow />
              </div>
            )
          })()}

          {/* ════ STEP 4: Result ════ */}
          {step === 4 && (() => {
            const allowed = actionsForCanonicals(ifCanonicals)
            const restricted = !showAllActions && Array.isArray(allowed) && allowed.length > 0
            const actionsToShow = restricted
              ? WIZARD_ACTIONS.filter(a => allowed.includes(a.action))
              : WIZARD_ACTIONS
            const hiddenCount = restricted ? WIZARD_ACTIONS.length - actionsToShow.length : 0

            // Renders the dynamic params grid for either the primary action
            // or the ELSE branch — keeps the field-type switch in one place
            // so info / select / number / text behave identically in both.
            const renderParamsGrid = (def, values, update) => (
              <div className="wiz-params-grid">
                {def.fields.map(f => {
                  if (f.type === 'info') {
                    return (
                      <div key={f.key} className="wiz-param-field wiz-param-field-info">
                        <span className="wiz-param-label">{f.label}</span>
                        <span className="wiz-param-info-value" aria-label={`${f.label} (locked preset)`}>
                          {f.value}
                        </span>
                      </div>
                    )
                  }
                  if (f.type === 'select') {
                    return (
                      <label key={f.key} className="wiz-param-field">
                        <span className="wiz-param-label">{f.label}</span>
                        <select
                          value={values[f.key] != null ? values[f.key] : ''}
                          onChange={e => update(f.key, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </label>
                    )
                  }
                  if (f.type === 'number') {
                    return (
                      <label key={f.key} className="wiz-param-field">
                        <span className="wiz-param-label">{f.label}{f.suffix ? ` (${f.suffix})` : ''}</span>
                        <span className="wiz-param-number">
                          <input
                            type="number"
                            value={values[f.key] != null ? values[f.key] : ''}
                            placeholder={f.placeholder != null ? f.placeholder : ''}
                            min={f.min}
                            max={f.max}
                            step={f.step != null ? f.step : 1}
                            onChange={e => {
                              const raw = e.target.value
                              update(f.key, raw === '' ? '' : Number(raw))
                            }}
                          />
                          {f.suffix && <span className="wiz-param-suffix" aria-hidden>{f.suffix}</span>}
                        </span>
                      </label>
                    )
                  }
                  return (
                    <label key={f.key} className="wiz-param-field">
                      <span className="wiz-param-label">{f.label}</span>
                      <input
                        type="text"
                        value={values[f.key] != null ? values[f.key] : ''}
                        placeholder={f.placeholder || ''}
                        onChange={e => update(f.key, e.target.value)}
                      />
                    </label>
                  )
                })}
              </div>
            )

            return (
            <div className="wiz-step-body wiz-step-lanes">
              {restricted && (
                <div className="wiz-action-gate">
                  <span className="wiz-action-gate-text">
                    Showing {actionsToShow.length} action{actionsToShow.length === 1 ? '' : 's'} suggested by your conditions.
                  </span>
                  {hiddenCount > 0 && (
                    <button
                      type="button"
                      className="wiz-action-gate-link"
                      onClick={() => setShowAllActions(true)}
                    >
                      Show all actions ({hiddenCount} more)
                    </button>
                  )}
                </div>
              )}
              {!restricted && Array.isArray(allowed) && allowed.length > 0 && showAllActions && (
                <div className="wiz-action-gate">
                  <span className="wiz-action-gate-text">Showing all actions.</span>
                  <button
                    type="button"
                    className="wiz-action-gate-link"
                    onClick={() => setShowAllActions(false)}
                  >
                    Limit to suggested
                  </button>
                </div>
              )}
              <div className="wiz-tile-grid">
                {actionsToShow.map(a => (
                  <button
                    key={a.action}
                    type="button"
                    className={`wiz-tile wiz-tile-action ${actionKey === a.action ? 'selected' : ''}`}
                    onClick={() => setActionKey(a.action)}
                  >
                    {a.tag && (
                      <span
                        className={`wiz-tile-tag wiz-tile-tag-${tagSlug(a.tag)}`}
                        aria-label={`Category: ${a.tag}`}
                      >
                        {a.tag}
                      </span>
                    )}
                    <span className="wiz-tile-icon"><ActionIcon name={a.action} /></span>
                    <span className="wiz-tile-name">{a.action}</span>
                    <span className="wiz-tile-desc">{a.desc || ACTION_DESCRIPTIONS[a.action] || ''}</span>
                  </button>
                ))}
              </div>

              <div className="wiz-params-section">
                <div className="wiz-params-title">Parameters for {actionKey}</div>
                {renderParamsGrid(actionDef, paramFields, updateParamField)}
              </div>

              {actionKey === 'Set Size' && (
                <>
                  <button type="button" className="wiz-add-btn amber" onClick={() => openAddPanel('size')}>+ Add a size instance</button>
                  {panelOnly('size') && (
                    <WizardModal title="Add a size instance" onClose={() => setOpenPanel(null)}>
                      <p className="wiz-panel-hint">Same element / context / action; different condition and height.</p>
                      <label className="wiz-panel-field">Condition<input value={addSizeIf} onChange={e => setAddSizeIf(e.target.value)} placeholder="IF condition text" autoFocus /></label>
                      <label className="wiz-panel-field">Height<input value={addSizeHeight} onChange={e => setAddSizeHeight(e.target.value)} placeholder="e.g. 14px" /></label>
                      <div className="wiz-panel-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => setOpenPanel(null)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleAddSizeInstance}>Add instance</button>
                      </div>
                    </WizardModal>
                  )}
                  {sizeInstanceQueue.length > 0 && (
                    <ul className="wiz-queue">{sizeInstanceQueue.map((q, i) => <li key={i}>IF: {q.ifCanon} — {q.parameters}</li>)}</ul>
                  )}
                </>
              )}

              {/* ── ELSE branch (optional fallback THEN) ───────────────
                 Lives at the end of Step 4 because it's a fallback to
                 the primary action — not a join between conditions. */}
              <div className="wiz-else-section">
                {!elseEnabled ? (
                  <button
                    type="button"
                    className="wiz-else-add-btn"
                    onClick={() => setElseEnabled(true)}
                    aria-expanded="false"
                  >
                    <span className="wiz-else-add-glyph" aria-hidden>+</span>
                    <span className="wiz-else-add-body">
                      <span className="wiz-else-add-name">Add ELSE branch</span>
                      <span className="wiz-else-add-desc">
                        Optional — apply a fallback action when the IF condition is false.
                      </span>
                    </span>
                  </button>
                ) : (
                  <div className="wiz-else-panel" aria-label="ELSE fallback branch">
                    <div className="wiz-else-panel-head">
                      <span className="wiz-else-tag">ELSE</span>
                      <span className="wiz-else-panel-title">Fallback action</span>
                      <button
                        type="button"
                        className="wiz-else-remove"
                        onClick={() => setElseEnabled(false)}
                        aria-label="Remove ELSE branch"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="wiz-else-panel-hint">
                      Runs only when the IF condition is <strong>not</strong> met for this subject in this context.
                    </p>

                    <div className="wiz-tile-grid">
                      {WIZARD_ACTIONS.map(a => (
                        <button
                          key={a.action}
                          type="button"
                          className={`wiz-tile wiz-tile-action ${elseActionKey === a.action ? 'selected' : ''}`}
                          onClick={() => setElseActionKey(a.action)}
                        >
                          {a.tag && (
                            <span
                              className={`wiz-tile-tag wiz-tile-tag-${tagSlug(a.tag)}`}
                              aria-label={`Category: ${a.tag}`}
                            >
                              {a.tag}
                            </span>
                          )}
                          <span className="wiz-tile-icon"><ActionIcon name={a.action} /></span>
                          <span className="wiz-tile-name">{a.action}</span>
                          <span className="wiz-tile-desc">{a.desc || ACTION_DESCRIPTIONS[a.action] || ''}</span>
                        </button>
                      ))}
                    </div>

                    <div className="wiz-params-section">
                      <div className="wiz-params-title">Parameters for {elseActionKey}</div>
                      {renderParamsGrid(elseActionDef, elseParamFields, updateElseParamField)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            )
          })()}

          {/* ════ STEP 5: Review ════ */}
          {step === 5 && (
            <div className="wiz-step-body wiz-review">
              {conflicts.length > 0 && (
                <div className="wiz-notice red">Conflict — rule #{conflicts[0].rule_id} already covers {whenCanonical} / {inCanonical} / {actionKey}. Set priority below.</div>
              )}
              {sentenceSegments.length > 0 && (
                <div className="wiz-sentence">{sentenceSegments.map((seg, i) => <span key={i} className={`wiz-sent-${seg.role}`}>{seg.text}</span>)}</div>
              )}
              <div className="wiz-review-grid">
                <div className="wiz-review-row">
                  <span className="wiz-review-key">WHEN</span>
                  <span className="wiz-review-pills">
                    {whenCanonicals.map((c, i) => (
                      <React.Fragment key={c}>{i > 0 && <span className="wiz-review-and">OR</span>}<span className="wiz-pill when">{c}</span></React.Fragment>
                    ))}
                  </span>
                </div>
                <div className="wiz-review-row"><span className="wiz-review-key">IN</span><span className="wiz-pill in">{contextOptions.find(c => c.canonical === inCanonical)?.label || inCanonical}</span></div>
                <div className="wiz-review-row">
                  <span className="wiz-review-key">IF</span>
                  <span className="wiz-review-pills">{ifCanonicals.map((c, i) => (
                    <React.Fragment key={c}>{i > 0 && <span className="wiz-review-and">AND</span>}<span className="wiz-pill if">{labelForIf(c)}</span></React.Fragment>
                  ))}</span>
                </div>
                <div className="wiz-review-row"><span className="wiz-review-key">ACTION</span><span className="wiz-pill then">{actionKey}</span></div>
                {actionDef.fields.map(f => {
                  let display
                  if (f.type === 'info') {
                    display = String(f.value)
                  } else {
                    const v = paramFields[f.key]
                    if (v == null || String(v).trim() === '') {
                      display = '—'
                    } else if (f.type === 'number') {
                      display = `${String(v).trim()}${f.suffix || ''}`
                    } else {
                      display = String(v).trim()
                    }
                  }
                  return (
                    <div key={f.key} className="wiz-review-row">
                      <span className="wiz-review-key">{f.label.toUpperCase()}</span>
                      <span className="wiz-review-val">{display}</span>
                    </div>
                  )
                })}

                {elseEnabled && (
                  <>
                    <div className="wiz-review-row wiz-review-row-divider">
                      <span className="wiz-review-key">ELSE</span>
                      <span className="wiz-pill else-pill">{elseActionKey}</span>
                    </div>
                    {elseActionDef.fields.map(f => {
                      let display
                      if (f.type === 'info') {
                        display = String(f.value)
                      } else {
                        const v = elseParamFields[f.key]
                        if (v == null || String(v).trim() === '') {
                          display = '—'
                        } else if (f.type === 'number') {
                          display = `${String(v).trim()}${f.suffix || ''}`
                        } else {
                          display = String(v).trim()
                        }
                      }
                      return (
                        <div key={`else-${f.key}`} className="wiz-review-row wiz-review-row-else">
                          <span className="wiz-review-key">↳ {f.label.toUpperCase()}</span>
                          <span className="wiz-review-val">{display}</span>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
              <div className="wiz-review-extras">
                <label className="wiz-param-field"><span className="wiz-param-label">Priority</span><select value={priority} onChange={e => setPriority(Number(e.target.value))}>{PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label>
                <label className="wiz-param-field"><span className="wiz-param-label">Note</span><input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Optional — add any notes" /></label>
              </div>
            </div>
          )}
        </div>
        <WizardDiagram
          step={step}
          whenCanonicals={whenCanonicals}
          inCanonical={inCanonical}
          ifCanonicals={ifCanonicals}
          ifOperators={ifOperators}
          actionKey={actionKey}
          paramFields={paramFields}
          elseEnabled={elseEnabled}
          elseActionKey={elseActionKey}
          elseParamFields={elseParamFields}
        />
      </div>

      <div className="wiz-footer">
        <ol className="wiz-stepper" aria-label="Wizard progress">
          {STEPS.map(({ n, label }, i) => {
            const isActive = step === n
            const isDone = step > n
            const clickable = n < step
            return (
              <React.Fragment key={n}>
                <li className={`wiz-stepper-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                  <button
                    type="button"
                    className="wiz-stepper-dot"
                    aria-current={isActive ? 'step' : undefined}
                    onClick={() => { if (clickable) setStep(n) }}
                    disabled={!clickable && !isActive}
                  >
                    {isDone ? (
                      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
                        <path d="M2 6.5l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : isActive ? (
                      <span className="wiz-stepper-dot-inner" />
                    ) : null}
                  </button>
                  <span className="wiz-stepper-label">{label}</span>
                </li>
                {i < STEPS.length - 1 && (
                  <li className={`wiz-stepper-line ${step > n ? 'done' : ''}`} aria-hidden />
                )}
              </React.Fragment>
            )
          })}
        </ol>

        <div className="wiz-footer-actions">
          {step > 1 && (
            <button type="button" className="wiz-back-btn" onClick={() => setStep(s => s - 1)}>&#x2039; Back</button>
          )}
          {step < 5 ? (
            <button
              type="button"
              className={`wiz-next-btn ${canNext() ? '' : 'disabled'}`}
              disabled={!canNext()}
              onClick={() => {
                /* Commit any in-progress condition draft when leaving
                   Step 3 so the user doesn't have to click "Add
                   condition" first — the most common path is a single
                   condition, and clicking Next now means "use these
                   values as my condition and continue". */
                if (step === 3) commitPendingDraft()
                setStep(s => s + 1)
              }}
            >Next</button>
          ) : (
            <button type="button" className="wiz-next-btn save" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save rule'}</button>
          )}
        </div>
      </div>
    </div>
  )
}

function WizardModal({ title, onClose, children }) {
  const dialogRef = React.useRef(null)

  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    const focusables = () => Array.from(
      node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled && el.offsetParent !== null)

    const all = focusables()
    const firstInput = all.find(el => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') || all[0]
    if (firstInput) firstInput.focus()

    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="wiz-modal-backdrop" onMouseDown={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="wiz-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="wiz-modal-header">
          <div className="wiz-modal-title">{title}</div>
          <button type="button" className="wiz-modal-close" onClick={onClose} aria-label="Close">
            <span aria-hidden>&times;</span>
          </button>
        </div>
        <div className="wiz-modal-body">{children}</div>
      </div>
    </div>
  )
}
