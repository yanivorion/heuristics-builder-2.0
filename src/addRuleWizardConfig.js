/** Handover: Add_Rule_Flow_Handover — canonical lists, mappings, and sentence builders. */

export const ELEMENT_GROUPS = [
  {
    id: 'layout',
    label: 'Layout',
    components: ['Section', 'Box', 'Cell', 'Easy Grid']
  },
  {
    id: 'interactive',
    label: 'Interactive',
    components: ['Button', 'Social Bar', 'Hamburger Menu']
  },
  {
    id: 'text',
    label: 'Text',
    components: ['Text', 'Text Mask', 'Text Marquee', 'Collapsible Text']
  },
  {
    id: 'media',
    label: 'Media',
    components: [
      'Image',
      'Video Box',
      'Lottie Animation',
      'Transparent Video',
      'Single Video Player',
      'Custom Element',
      'Embed',
      'Google Maps'
    ]
  },
  {
    id: 'decorative',
    label: 'Decorative',
    components: ['Shape', 'Horizontal Line', 'Vertical Line', 'List Item']
  },
  {
    id: 'containers',
    label: 'Containers',
    components: ['System Container', 'Repeater', 'Lightbox', 'Tabs', 'Accordion']
  },
  {
    id: 'catch-all',
    label: 'Catch-all',
    components: [
      { label: 'Any Element', canonical: 'Any Element' },
      { label: 'Any Container', canonical: 'Any Container' },
      { label: 'Any Child Element', canonical: 'Any Child Element' },
      { label: 'Any Pinned Element', canonical: 'Any Pinned Element' }
    ]
  }
]

export const CONTEXT_OPTIONS = [
  { label: 'Anywhere (any parent)', canonical: 'Any Parent' },
  { label: 'Inside Section', canonical: 'Section' },
  { label: 'Inside Header', canonical: 'Header' },
  { label: 'Inside Box', canonical: 'Box' },
  { label: 'Inside Easy Grid › Cell', canonical: 'Section > Easy Grid' },
  { label: 'Inside Header or System Container', canonical: 'Header | System Container' },
  { label: 'Inside Section or Footer', canonical: 'Section | Footer' }
]

/** Display label → canonical IF (handover §3 table). */
export const IF_OPTIONS = [
  {
    group: null,
    options: [
      { label: 'Always applies', canonical: 'Any' },
      { label: 'Element is first in container', canonical: 'Is First' },
      { label: 'Element is last in container', canonical: 'Is Last' }
    ]
  },
  {
    group: 'Size-based',
    options: [
      { label: 'Desktop width: 1–100px', canonical: 'Desktop Width: 1px – 100px' },
      { label: 'Desktop width: 101–200px', canonical: 'Desktop Width: 101px – 200px' },
      { label: 'Desktop width: 201px+', canonical: 'Desktop Width: 201px+' },
      { label: 'Desktop height: 1–100px', canonical: 'Desktop Height: 1px – 100px' },
      { label: 'Desktop height: 101px+', canonical: 'Desktop Height: 101px+' }
    ]
  },
  {
    group: 'State-based',
    options: [
      { label: 'Element is rotated', canonical: 'Is Rotated (Value ≠ 0)' },
      { label: 'Container is blank', canonical: 'Blank' },
      { label: 'Container has elements', canonical: 'Contains Elements' }
    ]
  },
  {
    group: 'Relative position',
    options: [
      { label: 'Element above is same type', canonical: 'Component Above is Same Type' },
      { label: 'Element above is different type', canonical: 'Component Above is Different Type' },
      { label: 'Element is logo', canonical: 'Is Logo Component' },
      { label: 'Element is not logo', canonical: 'Is NOT Logo Component' }
    ]
  }
]

export const WIZARD_ACTIONS = [
  {
    action: 'Set Size',
    fields: [
      { key: 'method', label: 'Method', type: 'select', options: ['Reset Scaling', 'Keep Scaling', 'Scale in Aspect Ratio'] },
      { key: 'width', label: 'Width', type: 'text', placeholder: 'e.g. according to desktop (max 100%)' },
      { key: 'height', label: 'Height', type: 'text', placeholder: 'e.g. SPX' }
    ]
  },
  {
    action: 'Set Min Height',
    fields: [{ key: 'value', label: 'Value', type: 'text', placeholder: 'e.g. 200px' }]
  },
  {
    action: 'Set Margin',
    fields: [
      { key: 'top', label: 'Top', type: 'text' },
      { key: 'bottom', label: 'Bottom', type: 'text' },
      { key: 'left', label: 'Left', type: 'text' },
      { key: 'right', label: 'Right', type: 'text' }
    ]
  },
  {
    action: 'Set Padding',
    fields: [
      { key: 'top', label: 'Top', type: 'text' },
      { key: 'bottom', label: 'Bottom', type: 'text' },
      { key: 'left', label: 'Left', type: 'text' },
      { key: 'right', label: 'Right', type: 'text' }
    ]
  },
  {
    action: 'Set Alignment',
    fields: [{ key: 'value', label: 'Value', type: 'select', options: ['Left', 'Center', 'Right'] }]
  },
  {
    action: 'Set Rotation',
    fields: [{ key: 'value', label: 'Value', type: 'text', placeholder: 'e.g. 0' }]
  },
  {
    action: 'Set Visibility',
    fields: [{ key: 'value', label: 'Value', type: 'select', options: ['Show', 'Hide'] }]
  },
  {
    action: 'Set Spacing',
    fields: [{ key: 'value', label: 'Value', type: 'text' }]
  },
  {
    action: 'Set Pinned',
    fields: [
      { key: 'value', label: 'Value', type: 'text' },
      { key: 'offset', label: 'Offset', type: 'text' }
    ]
  },
  {
    action: 'Set Font Size',
    fields: [{ key: 'value', label: 'Value', type: 'text' }]
  },
  {
    action: 'Set OOG',
    fields: [{ key: 'arrangement', label: 'Arrangement', type: 'text' }]
  }
]

/** §7.4 — first option pre-selected in UI. */
export const PRIORITY_OPTIONS = [
  { value: 1, label: '1 — global default (pre-selected)' },
  { value: 2, label: '2 — context-specific override' },
  { value: 3, label: '3 — exception' }
]

export const ELEMENT_GROUP_DROPDOWN = ['Layout', 'Interactive', 'Text', 'Media', 'Decorative', 'Containers']

export const CONDITION_TYPE_DROPDOWN = ['Size-based', 'State-based', 'Relative position', 'Other']

/** Step titles (handover §1 overview + section headers). */
export const STEP_HEADINGS = {
  1: { title: 'Element — which element does this rule apply to?', maps: 'Maps to: WHEN' },
  2: { title: 'Context — where does this rule apply?', maps: 'Maps to: IN' },
  3: { title: 'Condition — when does this rule fire?', maps: 'Maps to: IF' },
  4: { title: 'Result — what should happen?', maps: 'Maps to: THEN' },
  5: { title: 'Review and save', maps: 'Conflict check + plain-language sentence + save' }
}

export function buildParametersString(actionKey, fieldValues) {
  const def = WIZARD_ACTIONS.find(a => a.action === actionKey)
  if (!def) return ''
  const parts = []
  for (const f of def.fields) {
    const v = fieldValues[f.key]
    if (v != null && String(v).trim() !== '') {
      parts.push(`${f.label}: ${String(v).trim()}`)
    }
  }
  return parts.join(' | ')
}

/** Natural-language IF clause for §7.2 sentence (matches handover examples). */
export function ifClauseForSentence(ifCanonical, ifDisplayLabel) {
  if (!ifCanonical || ifCanonical === 'Any') return 'the rule always applies'
  const map = {
    'Is First': 'it is the first element',
    'Is Last': 'it is the last element',
    'Desktop Width: 1px – 100px': 'desktop width is 1–100px',
    'Desktop Width: 101px – 200px': 'desktop width is 101–200px',
    'Desktop Width: 201px+': 'desktop width is 201px+',
    'Desktop Height: 1px – 100px': 'desktop height is 1–100px',
    'Desktop Height: 101px+': 'desktop height is 101px+',
    'Is Rotated (Value ≠ 0)': 'the element is rotated',
    Blank: 'the container is blank',
    'Contains Elements': 'the container has elements',
    'Component Above is Same Type': 'the element above is the same type',
    'Component Above is Different Type': 'the element above is a different type',
    'Is Logo Component': 'the element is the logo',
    'Is NOT Logo Component': 'the element is not the logo'
  }
  return map[ifCanonical] || (ifDisplayLabel || ifCanonical).toLowerCase()
}

/** IN phrase after “inside ” (handover examples). */
export function inPhraseForSentence(inCanonical) {
  if (!inCanonical || inCanonical === 'Any' || inCanonical === 'Any Parent') return 'any parent'
  if (inCanonical === 'Section') return 'a Section'
  if (inCanonical === 'Header') return 'a Header'
  if (inCanonical === 'Footer') return 'a Footer'
  if (inCanonical === 'Box') return 'a Box'
  if (inCanonical === 'Section > Easy Grid') return 'Easy Grid › Cell'
  if (inCanonical === 'Header | System Container') return 'Header or System Container'
  if (inCanonical === 'Section | Footer') return 'Section or Footer'
  return inCanonical.replace(/\s*\|\s*/g, ' or ').replace(/>/g, ' › ')
}

/** Subject after “When ” — “any element” vs “a Button”. */
export function whenSubjectForSentence(whenCanonical) {
  if (!whenCanonical) return 'any element'
  const lower = whenCanonical.toLowerCase()
  if (lower.startsWith('any ')) return lower
  return `a ${whenCanonical}`
}

/** §7.2 template + examples style — lowercase action, “using …” for parameters. */
export function buildPlainSentence(whenCanon, inCanon, ifCanon, action, parameters, ifDisplayLabel) {
  const whenSubj = whenSubjectForSentence(whenCanon)
  const inPh = inPhraseForSentence(inCanon)
  const ifPh = ifClauseForSentence(ifCanon, ifDisplayLabel)
  const actLower = (action || '').toLowerCase()
  let thenPart = actLower
  if (parameters && String(parameters).trim()) {
    const bits = String(parameters)
      .split('|')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    thenPart = `${actLower} using ${bits.join(', ')}`
  }
  return `When ${whenSubj} is inside ${inPh} and ${ifPh} → ${thenPart}.`
}

/**
 * Styled segments for §7.2 sentence part formatting.
 * glue #26215C 400 | when #534AB7 500 | in #0F6E56 500 | if #185FA5 500 | then #712B13 500
 */
export function buildSentenceSegments(whenCanon, inCanon, ifCanon, action, parameters, ifDisplayLabel) {
  const whenSubj = whenSubjectForSentence(whenCanon)
  const inPh = inPhraseForSentence(inCanon)
  const ifPh = ifClauseForSentence(ifCanon, ifDisplayLabel)
  const actLower = (action || '').toLowerCase()
  let thenText = actLower
  if (parameters && String(parameters).trim()) {
    const bits = String(parameters)
      .split('|')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    thenText = `${actLower} using ${bits.join(', ')}`
  }

  return [
    { role: 'glue', text: 'When ' },
    { role: 'when', text: whenSubj },
    { role: 'glue', text: ' is inside ' },
    { role: 'in', text: inPh },
    { role: 'glue', text: ' and ' },
    { role: 'if', text: ifPh },
    { role: 'glue', text: ' → ' },
    { role: 'then', text: thenText },
    { role: 'glue', text: '.' }
  ]
}

export function categoryForElementGroup(groupLabel) {
  if (!groupLabel || groupLabel === 'Catch-all') return 'Custom Rule'
  return `${groupLabel} · Wizard`
}
