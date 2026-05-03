import React, { useMemo } from 'react'
import { buildResultLines, WIZARD_ACTIONS } from '../addRuleWizardConfig'

function tagSlug(tag) {
  return String(tag)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * WizardDiagram — clean, aesthetic flowchart that builds progressively as the
 * user fills out the wizard. Replaces the older "device-frames" preview.
 *
 * Visual language:
 *   • stadium (rounded ends)        → Element   (Step 1)
 *   • rect with header/body         → Context   (Step 2 — Element in Context)
 *   • hexagon                       → Condition (Step 3)
 *   • soft-purple result panel      → Action    (Step 4 — with parameter list)
 *
 * Empty / future nodes render as ghost placeholders so the user always sees
 * the full skeleton of the rule.
 */

const STEP_HINTS = {
  1: 'Pick a subject to begin',
  2: 'Place it in a context',
  3: 'Add a condition',
  4: 'Choose what happens',
  5: 'Review your rule'
}

function paramLines(actionKey, paramFields) {
  if (!actionKey) return []
  // Prefer the canonical config-driven builder so info-field presets ("Width:
  // 100%", "Height: Auto") are always shown alongside whatever custom values
  // the user has entered. Falls back to paramFields-only display when the
  // action isn't defined in WIZARD_ACTIONS.
  const lines = buildResultLines(actionKey, paramFields || {})
  if (lines.length > 0) return lines
  const entries = Object.entries(paramFields || {})
    .filter(([, v]) => v != null && String(v).trim() !== '')
  return entries.map(([k, v]) => {
    const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')
    return `${label}: ${v}`
  })
}

function contextLabel(canonical) {
  if (!canonical) return ''
  if (canonical === 'Any' || canonical === 'Any Parent') return 'Any Parent'
  return canonical.replace(/\s*\|\s*/g, ' or ').replace(/\s*>\s*/g, ' › ')
}

function Connector({ active }) {
  return (
    <div className={`wd-connector ${active ? 'on' : 'off'}`} aria-hidden>
      <span className="wd-connector-line" />
      <svg className="wd-connector-tip" width="12" height="10" viewBox="0 0 12 10">
        <path d="M6 10L0.5 0.5h11z" fill="currentColor" />
      </svg>
    </div>
  )
}

function StadiumNode({ filled, label, ghostText, items }) {
  if (filled && items && items.length > 1) {
    return (
      <div className="wd-node wd-stadium wd-stadium-multi on">
        <span className="wd-node-tag">WHEN</span>
        <div className="wd-stadium-list">
          {items.map((s, i) => (
            <span key={`${s}-${i}`} className="wd-stadium-chip">{s}</span>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className={`wd-node wd-stadium ${filled ? 'on' : 'off'}`}>
      <span className="wd-node-tag">WHEN</span>
      <span className="wd-stadium-text">{filled ? label : ghostText}</span>
    </div>
  )
}

function RectNode({ filled, label, ghostText }) {
  return (
    <div className={`wd-node wd-rect ${filled ? 'on' : 'off'}`}>
      <span className="wd-node-tag">IN</span>
      <span className="wd-rect-text">{filled ? label : ghostText}</span>
    </div>
  )
}

function ConditionNode({ filled, label, ghostText, showPrefix = true }) {
  return (
    <div className={`wd-node wd-cond ${filled ? 'on' : 'off'}`}>
      {showPrefix && <span className="wd-cond-prefix">IF</span>}
      <span className="wd-cond-text">{filled ? label : ghostText}</span>
    </div>
  )
}

/**
 * Group consecutive conditions that share the same join operator into runs.
 * `operators[i]` (i > 0) describes how `items[i]` joins to `items[i-1]`.
 *
 *   ifOperators = ['', 'AND', 'AND']  → one run: AND[C0,C1,C2]
 *   ifOperators = ['', 'AND', 'OR']   → AND[C0,C1] then OR[C2]
 *   ifOperators = ['', 'OR',  'AND']  → OR[C0,C1]  then AND[C2]
 *
 * The first item seeds a run; subsequent items either extend the current run
 * (when its op matches, or the run still has only one item) or open a new
 * run carrying the new operator.
 */
function groupConditions(items, operators) {
  if (!items || items.length === 0) return []
  const groups = [{ op: 'AND', items: [items[0]] }]
  for (let i = 1; i < items.length; i++) {
    const op = (operators[i] || 'AND').toUpperCase()
    const cur = groups[groups.length - 1]
    if (cur.items.length === 1) {
      cur.op = op
      cur.items.push(items[i])
    } else if (op === cur.op) {
      cur.items.push(items[i])
    } else {
      groups.push({ op, items: [items[i]] })
    }
  }
  return groups
}

/**
 * Grouped condition block — rendered when there are 2 or more conditions.
 * Visual: each run of same-operator conditions is wrapped in a dashed-bordered
 * frame; cards inside the frame are separated by `+` (AND) or `/` (OR) glyphs.
 * Single-item groups (which only occur in mixed-operator rules) render bare.
 * When two groups appear back-to-back, a small operator chip sits on the
 * connecting trunk between them.
 */
function ConditionSplit({ items, operators, active }) {
  const groups = useMemo(() => groupConditions(items, operators), [items, operators])
  return (
    <div
      className={`wd-cond-split ${active ? 'on' : 'off'}`}
      aria-label={`${items.length} conditions in ${groups.length} group${groups.length === 1 ? '' : 's'}`}
    >
      {groups.map((g, gi) => {
        const opKey = g.op.toLowerCase()
        const sep = g.op === 'AND' ? '+' : '/'
        return (
          <React.Fragment key={gi}>
            {gi > 0 && (
              <div className={`wd-cond-group-link wd-cond-group-link-${opKey}`} aria-hidden>
                <span className="wd-cond-group-link-line" />
                <span className={`wd-cond-group-chip wd-cond-op-${opKey}`}>{g.op}</span>
                <span className="wd-cond-group-link-line" />
              </div>
            )}
            {g.items.length > 1 ? (
              <div
                className={`wd-cond-group wd-cond-group-${opKey}`}
                role="group"
                aria-label={`${g.op} group with ${g.items.length} conditions`}
              >
                <span className={`wd-cond-group-tag wd-cond-op-${opKey}`} aria-hidden>{g.op}</span>
                <div className="wd-cond-group-row">
                  {g.items.map((label, ii) => (
                    <React.Fragment key={ii}>
                      {ii > 0 && (
                        <span
                          className={`wd-cond-sep wd-cond-sep-${opKey}`}
                          aria-label={g.op}
                        >
                          {sep}
                        </span>
                      )}
                      <div className="wd-cond-cell">
                        <ConditionNode filled label={label} showPrefix={false} />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className="wd-cond-cell wd-cond-cell-solo">
                <ConditionNode filled label={g.items[0]} showPrefix={false} />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function ResultNode({ filled, action, lines, ghostText, tag = 'THEN' }) {
  const tone = tag === 'ELSE' ? 'wd-result-else' : ''
  const def = filled ? WIZARD_ACTIONS.find(a => a.action === action) : null
  const cat = def && def.tag
  return (
    <div className={`wd-node wd-result ${tone} ${filled ? 'on' : 'off'}`}>
      <span className={`wd-node-tag ${tag === 'ELSE' ? 'wd-node-tag-else' : ''}`}>{tag}</span>
      {filled ? (
        <>
          {cat && (
            <span className={`wd-result-tag wd-result-tag-${tagSlug(cat)}`} aria-label={`Category: ${cat}`}>
              {cat}
            </span>
          )}
          <div className="wd-result-title">{action}</div>
          {lines.length > 0 && (
            <ul className="wd-result-list">
              {lines.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          )}
        </>
      ) : (
        <div className="wd-result-ghost">{ghostText}</div>
      )}
    </div>
  )
}

export default function WizardDiagram({
  step,
  whenCanonicals = [],
  inCanonical,
  ifCanonicals,
  ifOperators = [],
  actionKey,
  paramFields,
  elseEnabled = false,
  elseActionKey,
  elseParamFields
}) {
  const subjects = whenCanonicals.filter(Boolean)
  const hasElement = subjects.length > 0
  const hasContext = !!inCanonical && step >= 2
  const conditions = (ifCanonicals || []).filter(Boolean)
  const hasCondition = step >= 3 && conditions.length > 0
  const isSplit = hasCondition && conditions.length > 1
  const hasAction = step >= 4 && !!actionKey
  const hasElse = step >= 4 && elseEnabled && !!elseActionKey

  const elementLabel = subjects.length === 1
    ? subjects[0]
    : subjects.length > 1
      ? subjects.join(' or ')
      : ''
  const ctxLabel = contextLabel(inCanonical)
  const fullElementCtx = hasElement
    ? hasContext
      ? `${elementLabel} in ${ctxLabel}`
      : elementLabel
    : ''
  const conditionLabel = useMemo(() => {
    if (!hasCondition) return ''
    return conditions[0]
  }, [hasCondition, conditions])

  const actionParamLines = useMemo(
    () => (hasAction ? paramLines(actionKey, paramFields) : []),
    [hasAction, actionKey, paramFields]
  )

  const elseParamLinesMemo = useMemo(
    () => (hasElse ? paramLines(elseActionKey, elseParamFields) : []),
    [hasElse, elseActionKey, elseParamFields]
  )

  return (
    <div className="wd-wrap" aria-label="Live rule diagram">
      <div className="wd-head">
        <div className="wd-head-eyebrow">Diagram</div>
        <div className="wd-head-title">Rule preview</div>
        <div className="wd-head-sub">{STEP_HINTS[step]}</div>
      </div>

      <div className="wd-canvas">
        <div className="wd-stack">
          {/* 1 — Element */}
          <StadiumNode
            filled={hasElement}
            label={elementLabel}
            items={subjects}
            ghostText="Subject"
          />

          <Connector active={hasElement} />

          {/* 2 — Element in Context */}
          <RectNode
            filled={hasElement && hasContext}
            label={fullElementCtx}
            ghostText="Subject in Context"
          />

          <Connector active={hasContext} />

          {/* 3 — Condition (single card, or branched fan when ≥2) */}
          {isSplit ? (
            <ConditionSplit
              items={conditions}
              operators={ifOperators}
              active={hasCondition}
            />
          ) : (
            <ConditionNode
              filled={hasCondition}
              label={conditionLabel}
              ghostText="Condition"
            />
          )}

          <Connector active={hasCondition} />

          {/* 4 — Result */}
          <ResultNode
            filled={hasAction}
            action={actionKey}
            lines={actionParamLines}
            ghostText="Result"
          />

          {/* 4b — Optional ELSE / fallback result. Connector carries an
                inline "ELSE" chip so the branching is visually obvious. */}
          {hasElse && (
            <>
              <div className={`wd-connector wd-connector-else ${hasElse ? 'on' : 'off'}`} aria-hidden>
                <span className="wd-connector-line" />
                <span className="wd-connector-op wd-cond-op-else">ELSE</span>
                <svg className="wd-connector-tip" width="12" height="10" viewBox="0 0 12 10">
                  <path d="M6 10L0.5 0.5h11z" fill="currentColor" />
                </svg>
              </div>
              <ResultNode
                filled={hasElse}
                action={elseActionKey}
                lines={elseParamLinesMemo}
                ghostText="Fallback"
                tag="ELSE"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
