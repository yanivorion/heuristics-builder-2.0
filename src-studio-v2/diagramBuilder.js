export const UNIFIED_TAXONOMY = [
  'Set Size', 'Set Min Height', 'Set Margin', 'Set Padding',
  'Set Alignment', 'Set Rotation', 'Set Visibility', 'Set Spacing',
  'Set Pinned', 'Set Font Size', 'Set OOG'
]

export const OP_STYLE_MAP = {
  'Set Size':       { bg: '#eef2ff', color: '#4f46e5' },
  'Set Min Height': { bg: '#f0fdf4', color: '#16a34a' },
  'Set Margin':     { bg: '#ecfdf5', color: '#059669' },
  'Set Padding':    { bg: '#f0fdfa', color: '#0d9488' },
  'Set Alignment':  { bg: '#faf5ff', color: '#9333ea' },
  'Set Rotation':   { bg: '#fff7ed', color: '#ea580c' },
  'Set Visibility': { bg: '#fef2f2', color: '#dc2626' },
  'Set Spacing':    { bg: '#fefce8', color: '#ca8a04' },
  'Set Pinned':     { bg: '#fffbeb', color: '#d97706' },
  'Set Font Size':  { bg: '#fdf4ff', color: '#c026d3' },
  'Set OOG':        { bg: '#f0f9ff', color: '#0284c7' },
  _default:         { bg: '#f8fafc', color: '#64748b' }
}

export const STRIP_COLORS = {
  'Set Size':       { bg: '#eef2ff', pill: '#4f46e5' },
  'Set Min Height': { bg: '#f0fdf4', pill: '#16a34a' },
  'Set Margin':     { bg: '#ecfdf5', pill: '#059669' },
  'Set Padding':    { bg: '#f0fdfa', pill: '#0d9488' },
  'Set Alignment':  { bg: '#faf5ff', pill: '#9333ea' },
  'Set Rotation':   { bg: '#fff7ed', pill: '#ea580c' },
  'Set Visibility': { bg: '#fef2f2', pill: '#dc2626' },
  'Set Spacing':    { bg: '#fefce8', pill: '#ca8a04' },
  'Set Pinned':     { bg: '#fffbeb', pill: '#d97706' },
  'Set Font Size':  { bg: '#fdf4ff', pill: '#c026d3' },
  'Set OOG':        { bg: '#f0f9ff', pill: '#0284c7' },
  _default:         { bg: '#f8fafc', pill: '#64748b' }
}

function esc(s) {
  return String(s).replace(/"/g, '#quot;').replace(/\n/g, ' ')
}

function nodeClass(action) {
  return action.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')
}

function buildStyleDefs(usedOps) {
  const lines = []
  for (const op of usedOps) {
    const s = OP_STYLE_MAP[op] || OP_STYLE_MAP._default
    const cls = nodeClass(op)
    lines.push(`classDef ${cls} fill:${s.bg},stroke:${s.color},color:${s.color}`)
  }
  return lines.join('\n')
}

function buildChart(category, rules) {
  const lines = ['flowchart TD']
  const usedOps = new Set()
  const classAssignments = []

  lines.push(`  START(["<b>${esc(category)}</b>"])`)

  rules.forEach((r, i) => {
    const nodeId = `R${i}`
    const condId = `C${i}`
    const outId = `O${i}`

    const when = r.when || 'Any'
    const ctx = r.in || 'Any'
    const cond = r.if || 'Any'
    const action = r.action || '—'
    const params = r.parameters || '—'

    const condLabel = cond === 'Any' ? 'Any condition' : esc(cond)
    const elementLabel = when === 'Any' && ctx === 'Any'
      ? 'Any element'
      : when === 'Any'
        ? `Any in ${esc(ctx)}`
        : ctx === 'Any'
          ? esc(when)
          : `${esc(when)} in ${esc(ctx)}`

    lines.push(`  START --> ${nodeId}["${elementLabel}"]`)
    lines.push(`  ${nodeId} --> ${condId}{{"${condLabel}"}}`)

    const outLabel = params !== '—' ? `${esc(action)}\\n${esc(params)}` : esc(action)
    lines.push(`  ${condId} -->|Yes| ${outId}["${outLabel}"]`)

    usedOps.add(action)
    const cls = nodeClass(action)
    classAssignments.push(`class ${outId} ${cls}`)
  })

  lines.push(buildStyleDefs([...usedOps]))
  lines.push(classAssignments.join('\n'))

  return lines.join('\n')
}

function generateDescription(category, rules) {
  const ops = [...new Set(rules.map(r => r.action))]
  const elements = [...new Set(rules.map(r => r.when).filter(w => w !== 'Any'))]

  let desc = `${rules.length} rule${rules.length > 1 ? 's' : ''} in "${category}"`
  if (ops.length > 0) desc += ` — operations: ${ops.join(', ')}`
  if (elements.length > 0) desc += ` — targets: ${elements.slice(0, 4).join(', ')}${elements.length > 4 ? '...' : ''}`
  return desc
}

function buildOutputs(rules) {
  const outputMap = new Map()
  for (const r of rules) {
    const action = r.action || '—'
    const params = r.parameters || '—'
    const key = `${action}::${params}`
    if (!outputMap.has(key)) {
      outputMap.set(key, {
        operation: action,
        subType: params,
        labelParts: params !== '—' ? [action, params] : [action],
        count: 0
      })
    }
    outputMap.get(key).count++
  }
  return [...outputMap.values()]
}

export function buildDiagrams(data) {
  const groups = new Map()
  for (const r of data) {
    const cat = r.category || 'Uncategorized'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat).push(r)
  }

  const diagrams = []
  for (const [category, rules] of groups) {
    const id = category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const note = rules.map(r => r.note).filter(Boolean).join('; ')

    diagrams.push({
      id,
      title: category,
      rules: `${rules.length} rule${rules.length > 1 ? 's' : ''}`,
      ruleIds: rules.map(r => r.rule_id),
      desc: generateDescription(category, rules),
      chart: buildChart(category, rules),
      outputs: buildOutputs(rules),
      note
    })
  }

  return diagrams
}
