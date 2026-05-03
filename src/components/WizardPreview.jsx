import React, { useMemo } from 'react'
import ElementMock, { HiddenMock } from './ElementMock'

/**
 * WizardPreview — live, high-fidelity "real case" preview for the rule being authored.
 *
 * Always renders two stages side-by-side (Desktop baseline / Mobile after rule fires),
 * each as a full page scene (header · content context · footer). The target element is
 * highlighted with a blue ring; when the rule fires on mobile, the target is also ringed
 * in amber and annotated with the applied parameters.
 *
 * All inputs are live — every keystroke/selection in the wizard re-renders this.
 */

const STEP_LABEL = { 1: 'Element', 2: 'Context', 3: 'Condition', 4: 'Result', 5: 'Review' }
const STEP_BADGE = { 1: '#534ab7', 2: '#185fa5', 3: '#e65100', 4: '#0f6e56', 5: '#712b13' }

function parsePx(value, fallback = null) {
  if (!value) return fallback
  const m = String(value).match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : fallback
}

function parseAction(actionKey, paramFields) {
  if (!actionKey) return null
  const p = paramFields || {}
  switch (actionKey) {
    case 'Set Visibility':
      return { kind: 'visibility', hide: String(p.value || '').toLowerCase() === 'hide' }
    case 'Set Rotation':
      return { kind: 'rotation', deg: parsePx(p.value, 0) }
    case 'Set Alignment':
      return { kind: 'alignment', value: (p.value || 'Left').toLowerCase() }
    case 'Set Size':
      return {
        kind: 'size',
        width: p.width || '',
        height: parsePx(p.height, null),
        method: p.method || ''
      }
    case 'Set Min Height':
      return { kind: 'minHeight', value: parsePx(p.value, null) }
    case 'Set Margin':
      return {
        kind: 'margin',
        top: parsePx(p.top, 0),
        bottom: parsePx(p.bottom, 0),
        left: parsePx(p.left, 0),
        right: parsePx(p.right, 0)
      }
    case 'Set Padding':
      return {
        kind: 'padding',
        top: parsePx(p.top, 0),
        bottom: parsePx(p.bottom, 0),
        left: parsePx(p.left, 0),
        right: parsePx(p.right, 0)
      }
    case 'Set Font Size':
      return { kind: 'fontSize', value: parsePx(p.value, null) }
    case 'Set Spacing':
      return { kind: 'spacing', value: parsePx(p.value, null) }
    case 'Set Pinned':
      return { kind: 'pinned', value: p.value || '', offset: parsePx(p.offset, 0) }
    case 'Set OOG':
      return { kind: 'oog', arrangement: p.arrangement || '' }
    default:
      return null
  }
}

function formatAction(actionKey, paramFields) {
  if (!actionKey) return ''
  const entries = Object.entries(paramFields || {})
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => `${k}: ${v}`)
  return entries.length ? `${actionKey} — ${entries.join(', ')}` : actionKey
}

/** Classify the chosen context into the scene slot we should highlight. */
function classifyContext(ctx) {
  if (!ctx || ctx === 'Any Parent') return 'section'
  const c = String(ctx).toLowerCase()
  if (c.includes('header') && c.includes('system')) return 'header'
  if (c.includes('header')) return 'header'
  if (c.includes('footer')) return 'footer'
  if (c.includes('easy grid') || c.includes('grid')) return 'grid'
  if (c.includes('box')) return 'box'
  if (c.includes('cell')) return 'grid'
  return 'section'
}

/** Position of the target relative to its siblings (derived from the primary condition). */
function classifyPosition(condition) {
  if (!condition) return 'middle'
  const c = String(condition).toLowerCase()
  if (c === 'is first' || c.includes('is first')) return 'first'
  if (c === 'is last' || c.includes('is last')) return 'last'
  if (c.includes('blank')) return 'blank'
  return 'middle'
}

function RuleSentence({ whenCanonical, inCanonical, ifCanonicals, actionKey, paramFields }) {
  const parts = []
  if (whenCanonical) parts.push({ role: 'when', text: whenCanonical })
  if (inCanonical && inCanonical !== 'Any Parent') parts.push({ role: 'glue', text: 'inside' }, { role: 'in', text: inCanonical })
  if (ifCanonicals && ifCanonicals.length > 0) {
    parts.push({ role: 'glue', text: 'when' })
    ifCanonicals.forEach((c, i) => {
      if (i > 0) parts.push({ role: 'glue', text: 'AND' })
      parts.push({ role: 'if', text: c })
    })
  }
  if (actionKey) {
    parts.push({ role: 'glue', text: '→' })
    parts.push({ role: 'then', text: actionKey })
    const ps = (paramFields ? Object.entries(paramFields) : [])
      .filter(([, v]) => v != null && String(v).trim() !== '')
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    if (ps) parts.push({ role: 'params', text: ps })
  }
  if (parts.length === 0) {
    return <div className="wiz-preview-sentence muted">Pick an element to begin building the rule…</div>
  }
  return (
    <div className="wiz-preview-sentence">
      {parts.map((p, i) => (
        <span key={i} className={`wiz-preview-sent wiz-preview-sent-${p.role}`}>{p.text}</span>
      ))}
    </div>
  )
}

/** Inline style deltas applied ONLY on the mobile side when the rule fires. */
function applyActionStyle(action) {
  if (!action) return { style: {}, wrapStyle: {}, alignSelf: null }
  const style = {}
  const wrapStyle = {}
  let alignSelf = null

  switch (action.kind) {
    case 'rotation':
      if (action.deg) style.transform = `rotate(${action.deg}deg)`
      break
    case 'size':
      if (action.height) {
        style.height = Math.min(Math.max(action.height, 2), 80) + 'px'
        style.overflow = 'hidden'
      }
      if (action.width === '100%' || /100%|full/i.test(action.width)) {
        style.width = '100%'
        wrapStyle.width = '100%'
      }
      break
    case 'minHeight':
      if (action.value) style.minHeight = Math.min(action.value, 100) + 'px'
      break
    case 'fontSize':
      if (action.value) style.fontSize = Math.min(Math.max(action.value, 6), 28) + 'px'
      break
    case 'margin':
      wrapStyle.marginTop = Math.min(action.top, 24) + 'px'
      wrapStyle.marginBottom = Math.min(action.bottom, 24) + 'px'
      wrapStyle.marginLeft = Math.min(action.left, 24) + 'px'
      wrapStyle.marginRight = Math.min(action.right, 24) + 'px'
      break
    case 'alignment':
      alignSelf = action.value === 'center' ? 'center' : action.value === 'right' ? 'flex-end' : 'flex-start'
      break
    default:
      break
  }
  return { style, wrapStyle, alignSelf }
}

function ActionChip({ action, actionKey, paramFields }) {
  if (!action) return null
  const label = formatAction(actionKey, paramFields)
  return (
    <div className="wiz-preview-action-chip">
      <span className="wiz-preview-action-dot" />
      {label}
    </div>
  )
}

/** Sibling mock used to fill out the row so "first/last/middle/blank" is legible. */
function Sibling({ small = false }) {
  return (
    <div className={`wiz-preview-sibling ${small ? 'small' : ''}`}>
      <div className="wiz-preview-sibling-bar" />
      <div className="wiz-preview-sibling-bar short" />
    </div>
  )
}

/** Elements whose mock already visually conveys their name — suppress the extra label. */
const SELF_LABELED = new Set([
  'Button', 'Logo', 'Logo Component', 'Text', 'Text Box', 'Text Box (Form)', 'Rich Text',
  'Text Mask', 'Text Marquee', 'Collapsible Text', 'Image', 'Video Box', 'Single Video Player',
  'Transparent Video', 'Audio Player', 'Lottie Animation', 'Lightbox', 'Google Maps',
  'Embed', 'Custom Element', 'Horizontal Line', 'Vertical Line', 'Shape', 'Hamburger Menu',
  'Social Bar', 'Breadcrumbs', 'Site Search', 'Progress Bar', 'System Container',
  'Repeater', 'Tabs', 'Accordion', 'Box', 'Cell', 'Section', 'Easy Grid', 'Container Box',
  'Container Box (Blank)', 'Container Box (With Elements)', 'List Item', 'Signature',
  'Upload Buttons', 'Recaptcha', 'Any Element', 'Any Container', 'Any Child Element',
  'Any Pinned Element', 'Pinned Element'
])

/** Renders the target element with its ring + optional applied action style. */
function TargetElement({ element, action, ringTone }) {
  const { style, wrapStyle, alignSelf } = applyActionStyle(action)
  const isHidden = action?.kind === 'visibility' && action.hide
  const showLabel = element && !SELF_LABELED.has(element) && !isHidden
  return (
    <div
      className={`wiz-preview-el-wrap ring-${ringTone}`}
      style={{ ...wrapStyle, alignSelf: alignSelf || undefined }}
    >
      <div className="wiz-preview-el" style={style}>
        {isHidden ? <HiddenMock name={element || 'Element'} /> : <ElementMock name={element || 'Any Element'} />}
      </div>
      {showLabel && <div className="wiz-preview-el-label">{element}</div>}
    </div>
  )
}

/** The content slot — arranges target + siblings for the current condition.
 *  When `bare` is true, renders only the target (used for single-cell slots like Easy Grid › Cell). */
function ContentSlot({ element, condition, action, ringTone, bare = false }) {
  const position = classifyPosition(condition)

  if (position === 'blank') {
    return (
      <div className="wiz-preview-blank">
        <span>(empty container)</span>
      </div>
    )
  }

  const target = <TargetElement key="t" element={element} action={action} ringTone={ringTone} />

  if (bare) {
    return <div className="wiz-preview-row wiz-preview-row-bare">{target}</div>
  }

  if (position === 'first') {
    return (
      <div className="wiz-preview-row">
        {target}
        <Sibling />
        <Sibling />
      </div>
    )
  }
  if (position === 'last') {
    return (
      <div className="wiz-preview-row">
        <Sibling />
        <Sibling />
        {target}
      </div>
    )
  }
  return (
    <div className="wiz-preview-row">
      <Sibling />
      {target}
      <Sibling />
    </div>
  )
}

/** Full page scene — header, body section with a highlighted context slot, footer. */
function PageScene({ element, context, condition, action, isMobile, ringTone, ruleFired }) {
  const ctxSlot = classifyContext(context)
  const position = classifyPosition(condition)

  const inHeader = ctxSlot === 'header'
  const inFooter = ctxSlot === 'footer'
  const inGrid = ctxSlot === 'grid'
  const inBox = ctxSlot === 'box'

  const contentSlot = (
    <ContentSlot element={element} condition={condition} action={action} ringTone={ringTone} />
  )
  const bareContentSlot = (
    <ContentSlot element={element} condition={condition} action={action} ringTone={ringTone} bare />
  )

  const gridCellCount = 4
  const focusIndex = position === 'first' ? 0 : position === 'last' ? gridCellCount - 1 : 2

  return (
    <div className={`wiz-scene ${isMobile ? 'mobile' : 'desktop'} ${ruleFired ? 'rule-fired' : ''}`}>
      {/* Header */}
      <div className={`wiz-scene-header ${inHeader ? 'is-target' : ''}`}>
        {inHeader ? (
          contentSlot
        ) : (
          <>
            <div className="wiz-scene-header-logo">LOGO</div>
            {!isMobile ? (
              <div className="wiz-scene-header-nav">
                <span /><span /><span /><span />
              </div>
            ) : (
              <div className="wiz-scene-header-ham">
                <span /><span /><span />
              </div>
            )}
          </>
        )}
        {inHeader && <span className="wiz-scene-slot-tag">header</span>}
      </div>

      {/* Body */}
      <div className="wiz-scene-body">
        {/* Hero section — always shown as page context */}
        {!(inHeader || inFooter) && (
          <div className={`wiz-scene-section hero ${ctxSlot === 'section' ? 'is-target' : ''}`}>
            {ctxSlot === 'section' ? (
              <>
                {contentSlot}
                <span className="wiz-scene-slot-tag">section</span>
              </>
            ) : (
              <>
                <div className="wiz-scene-hero-title" />
                <div className="wiz-scene-hero-sub" />
                <div className="wiz-scene-hero-sub short" />
              </>
            )}
          </div>
        )}

        {/* Grid / Box / Section slot when distinct from the hero */}
        {inGrid && (
          <div className="wiz-scene-section grid is-target">
            <div className="wiz-scene-grid">
              {Array.from({ length: gridCellCount }).map((_, i) => (
                <div key={i} className={`wiz-scene-cell ${i === focusIndex ? 'focus' : 'ghost'}`}>
                  {i === focusIndex ? bareContentSlot : null}
                </div>
              ))}
            </div>
            <span className="wiz-scene-slot-tag">grid · cell</span>
          </div>
        )}

        {inBox && (
          <div className="wiz-scene-section box is-target">
            <div className="wiz-scene-box-frame">{contentSlot}</div>
            <span className="wiz-scene-slot-tag">box</span>
          </div>
        )}

        {/* Filler section for visual rhythm */}
        {!inHeader && !inFooter && (
          <div className="wiz-scene-section filler">
            <div className="wiz-scene-hero-title short" />
            <div className="wiz-scene-hero-sub" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`wiz-scene-footer ${inFooter ? 'is-target' : ''}`}>
        {inFooter ? (
          contentSlot
        ) : (
          <>
            <div className="wiz-scene-footer-dot" />
            <div className="wiz-scene-footer-dot" />
            <div className="wiz-scene-footer-dot" />
          </>
        )}
        {inFooter && <span className="wiz-scene-slot-tag">footer</span>}
      </div>
    </div>
  )
}

function ConditionBadges({ conditions }) {
  if (!conditions || conditions.length === 0) return null
  return (
    <div className="wiz-preview-cond-strip">
      <span className="wiz-preview-cond-prefix">IF</span>
      {conditions.map((c, i) => (
        <React.Fragment key={c}>
          {i > 0 && <span className="wiz-preview-cond-and">AND</span>}
          <span className="wiz-preview-cond-chip">{c}</span>
        </React.Fragment>
      ))}
    </div>
  )
}

export default function WizardPreview({ step, whenCanonical, inCanonical, ifCanonicals, actionKey, paramFields }) {
  const element = whenCanonical || null
  const context = step >= 2 ? inCanonical : null
  const primaryCondition = step >= 3 && ifCanonicals && ifCanonicals[0] ? ifCanonicals[0] : null
  const action = step >= 4 ? parseAction(actionKey, paramFields) : null

  const subtitle = useMemo(() => {
    if (step === 1) return element ? `Showing how ${element} renders in a real page` : 'Pick an element to see a real-case preview'
    if (step === 2) return context ? `Placed inside ${context}` : 'Pick a parent context'
    if (step === 3) return primaryCondition ? `Condition: ${primaryCondition}` : 'Pick one or more conditions'
    if (step === 4) return actionKey ? `Applying ${actionKey} on mobile` : 'Pick an action'
    return 'Before (desktop) vs. after the rule fires (mobile)'
  }, [step, element, context, primaryCondition, actionKey])

  return (
    <aside className="wiz-preview" aria-label="Live mobile vs. desktop rendering">
      <div className="wiz-preview-head">
        <span
          className="wiz-preview-badge"
          style={{ background: `${STEP_BADGE[step]}14`, color: STEP_BADGE[step] }}
        >
          Step {step} — {STEP_LABEL[step]}
        </span>
        <div className="wiz-preview-title">Live rendering</div>
        <div className="wiz-preview-subtitle">{subtitle}</div>
      </div>

      <RuleSentence
        whenCanonical={whenCanonical}
        inCanonical={step >= 2 ? inCanonical : null}
        ifCanonicals={step >= 3 ? ifCanonicals : null}
        actionKey={step >= 4 ? actionKey : null}
        paramFields={step >= 4 ? paramFields : null}
      />

      <div className="wiz-preview-frame-grid">
        {/* Desktop scene */}
        <div className="wiz-preview-vp-block">
          <div className="wiz-preview-vp-chrome">
            <span className="wiz-preview-vp-dot" />
            <span className="wiz-preview-vp-dot" />
            <span className="wiz-preview-vp-dot" />
            <span className="wiz-preview-vp-label">Desktop · baseline</span>
          </div>
          <div className="wiz-preview-vp-stage desktop">
            <PageScene
              element={element}
              context={context}
              condition={primaryCondition}
              action={null}
              isMobile={false}
              ringTone="blue"
              ruleFired={false}
            />
          </div>
        </div>

        {/* Mobile scene */}
        <div className="wiz-preview-vp-block wiz-preview-vp-mobile">
          <div className="wiz-preview-phone">
            <div className="wiz-preview-phone-notch" />
            <div className="wiz-preview-vp-stage mobile">
              <PageScene
                element={element}
                context={context}
                condition={primaryCondition}
                action={action}
                isMobile
                ringTone={action ? 'amber' : 'blue'}
                ruleFired={Boolean(action)}
              />
            </div>
          </div>
          <span className={`wiz-preview-vp-label mobile ${action ? 'fired' : 'inactive'}`}>
            Mobile · {action ? 'rule applied' : 'rule inactive'}
          </span>
          {action && (
            <ActionChip action={action} actionKey={actionKey} paramFields={paramFields} />
          )}
        </div>
      </div>

      <ConditionBadges conditions={step >= 3 ? ifCanonicals : null} />
    </aside>
  )
}
