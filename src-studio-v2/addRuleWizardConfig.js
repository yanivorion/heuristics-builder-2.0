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
  { label: 'Any Parent', canonical: 'Any Parent' },
  { label: 'Inside Section', canonical: 'Section' },
  { label: 'Inside Header', canonical: 'Header' },
  { label: 'Inside Box', canonical: 'Box' },
  { label: 'Inside Easy Grid › Cell', canonical: 'Section > Easy Grid' },
  { label: 'Inside Header or System Container', canonical: 'Header | System Container' },
  { label: 'Inside Section or Footer', canonical: 'Section | Footer' }
]

/** Display label → canonical IF (handover §3 table, regrouped per the IF→THEN chart). */
export const IF_OPTIONS = [
  {
    group: null,
    options: [
      { label: 'Always applies', canonical: 'Any' }
    ]
  },
  {
    group: 'Rotation Value',
    options: [
      { label: 'Rotation = 0°', canonical: 'Rotation = 0' },
      { label: 'Element is rotated (≠ 0°)', canonical: 'Is Rotated (Value ≠ 0)' },
      { label: 'Rotation = 90° / 270° (±)', canonical: 'Rotation = 90/270 (±)' },
      { label: 'Rotation = 180°', canonical: 'Rotation = 180' }
    ]
  },
  {
    group: 'Size State',
    options: [
      { label: 'Desktop width: 1–100px', canonical: 'Desktop Width: 1px – 100px' },
      { label: 'Desktop width: 101–200px', canonical: 'Desktop Width: 101px – 200px' },
      { label: 'Desktop width: 201px+', canonical: 'Desktop Width: 201px+' },
      { label: 'Desktop height: 1–100px', canonical: 'Desktop Height: 1px – 100px' },
      { label: 'Desktop height: 101px+', canonical: 'Desktop Height: 101px+' }
    ]
  },
  {
    group: 'Text Alignment State',
    options: [
      { label: 'All descendant text: Left', canonical: 'All Descendant Text Style: Left' },
      { label: 'All descendant text: Center', canonical: 'All Descendant Text Style: Center' },
      { label: 'All descendant text: Right', canonical: 'All Descendant Text Style: Right' },
      { label: 'All descendant text: Mixed', canonical: 'All Descendant Text Style: Mixed' }
    ]
  },
  {
    group: 'Position State',
    options: [
      { label: 'Element is first in container', canonical: 'Is First' },
      { label: 'Element is last in container', canonical: 'Is Last' },
      { label: 'Element above is same type', canonical: 'Component Above is Same Type' },
      { label: 'Element above is different type', canonical: 'Component Above is Different Type' },
      { label: 'Element below is same type', canonical: 'Component Below is Same Type' },
      { label: 'Element below is different type', canonical: 'Component Below is Different Type' },
      { label: 'Element is logo', canonical: 'Is Logo Component' },
      { label: 'Element is not logo', canonical: 'Is NOT Logo Component' }
    ]
  },
  {
    group: 'Visibility State',
    options: [
      { label: 'Element is visible', canonical: 'Is Visible' },
      { label: 'Element is hidden', canonical: 'Is Hidden' }
    ]
  },
  {
    group: 'Pinned State',
    options: [
      { label: 'Element is pinned', canonical: 'Is Pinned' },
      { label: 'Element is not pinned', canonical: 'Is Not Pinned' }
    ]
  },
  {
    group: 'Padding State',
    options: [
      { label: 'Has padding', canonical: 'Has Padding' },
      { label: 'No padding', canonical: 'No Padding' }
    ]
  },
  {
    group: 'Margin State',
    options: [
      { label: 'Has margin', canonical: 'Has Margin' },
      { label: 'No margin', canonical: 'No Margin' }
    ]
  },
  {
    group: 'Container State',
    options: [
      { label: 'Container is blank', canonical: 'Blank' },
      { label: 'Container has elements', canonical: 'Contains Elements' }
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
    action: 'Set Position',
    fields: [
      { key: 'x', label: 'X', type: 'text', placeholder: 'e.g. 0px or auto' },
      { key: 'y', label: 'Y', type: 'text', placeholder: 'e.g. 0px or auto' }
    ]
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
  },

  // ── Size / Font-Size presets ──
  // Each of these maps to one of the canonical "Item Size" / "Font Size"
  // result cards from the diagram set. `info` fields are display-only
  // (they describe the preset's locked shape — "Width: 100%", "Height:
  // Auto", etc.) and surface in the diagram preview as static lines.
  // `number` fields are editable numeric inputs with a unit suffix; their
  // values are persisted in localStorage so the user's last entered value
  // pre-fills the next time they pick the same action.
  // ── Font-Size presets ──
  {
    action: 'Set Font Size (PX)',
    tag: 'Custom',
    desc: 'Fixed pixel font size',
    fields: [
      { key: 'value', label: 'Font Size', type: 'number', suffix: 'px', defaultValue: 18, min: 1, step: 1 }
    ]
  },
  {
    action: 'Set Font Size (Auto)',
    tag: 'Auto',
    desc: 'Auto viewport-width sizing',
    fields: [
      { key: 'unit', label: 'Unit', type: 'info', value: 'VW' }
    ]
  },

  // ── Item-Size presets ──
  // The `tag` field is a short use-case category surfaced as a chip on the
  // action tile card and in the diagram's result-node header. Tags map onto
  // the Figma matrix (Reset Scaling / Resize to Aspect Ratio / Reduce by %
  // / Custom / Generic Heuristics) so the picker reads as a typed catalog.
  {
    action: 'Set Item Size — Bounding Box',
    tag: 'Reset Scaling',
    desc: 'Width 100% · Height auto',
    fields: [
      { key: 'width',  label: 'Bounding Box Width', type: 'info', value: '100%' },
      { key: 'height', label: 'Height',             type: 'info', value: 'Auto' }
    ]
  },
  {
    action: 'Set Item Size — Height (PX)',
    tag: 'Generic Heuristics',
    desc: 'Width 100% · fixed height in px',
    fields: [
      { key: 'width',  label: 'Width',  type: 'info',   value: '100%' },
      { key: 'height', label: 'Height', type: 'number', suffix: 'px', defaultValue: 200, min: 1, step: 1 }
    ]
  },
  {
    action: 'Set Item Size — Width (PX)',
    tag: 'Custom',
    desc: 'Fixed width in px · auto height',
    fields: [
      { key: 'width',  label: 'Width',  type: 'number', suffix: 'px', defaultValue: 320, min: 1, step: 1 },
      { key: 'height', label: 'Height', type: 'info',   value: 'Auto' }
    ]
  },
  {
    action: 'Set Item Size — Aspect Ratio',
    tag: 'Resize to Aspect Ratio',
    desc: 'Width 100% · height aspect-ratio',
    fields: [
      { key: 'width',  label: 'Width',  type: 'info', value: '100%' },
      { key: 'height', label: 'Height', type: 'info', value: 'Aspect ratio' }
    ]
  },
  {
    action: 'Set Item Size — Aspect Ratio (Bounded)',
    tag: 'Resize to Aspect Ratio',
    desc: 'Aspect ratio with min/max height',
    fields: [
      { key: 'width',     label: 'Width',      type: 'info',   value: '100%' },
      { key: 'height',    label: 'Height',     type: 'info',   value: 'Aspect ratio' },
      { key: 'minHeight', label: 'Min Height', type: 'number', suffix: 'px', defaultValue: 120, min: 0, step: 1 },
      { key: 'maxHeight', label: 'Max Height', type: 'number', suffix: 'px', defaultValue: 480, min: 0, step: 1 }
    ]
  },
  {
    action: 'Reduce Item Size',
    tag: 'Reduce by %',
    desc: 'Reduce width/height by % with min width',
    fields: [
      { key: 'widthReduce',  label: 'Width Reduce',  type: 'number', suffix: '%',  defaultValue: 20, min: 0, max: 100, step: 1 },
      { key: 'heightReduce', label: 'Height Reduce', type: 'number', suffix: '%',  defaultValue: 20, min: 0, max: 100, step: 1 },
      { key: 'minWidth',     label: 'Min Width',     type: 'number', suffix: 'px', defaultValue: 240, min: 0, step: 1 }
    ]
  },
  {
    action: 'Set Item Size — Keep Size + SPX',
    tag: 'Reset Scaling',
    desc: 'Keep size · max width direct parent · SPX',
    fields: [
      { key: 'width',          label: 'Width',           type: 'info',   value: 'Keep size' },
      { key: 'maxWidth',       label: 'Max Width',       type: 'info',   value: 'Direct parent' },
      { key: 'height',         label: 'Height',          type: 'info',   value: 'SPX' },
      { key: 'resetFontSize',  label: 'Reset Font Size', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' }
    ]
  },
  {
    action: 'Set Item Size — Keep Size · Min/Max Height',
    tag: 'Reset Scaling',
    desc: 'Keep size · height min/max range',
    fields: [
      { key: 'width',     label: 'Width',      type: 'info',   value: 'Keep size' },
      { key: 'minHeight', label: 'Min Height', type: 'number', suffix: 'px', defaultValue: 48,  min: 0, step: 1 },
      { key: 'maxHeight', label: 'Max Height', type: 'number', suffix: 'px', defaultValue: 600, min: 0, step: 1 }
    ]
  }
]

/**
 * Step 3 — Size State quick-pick templates.
 *
 * Each template represents a common Width × Height shape (Bounding Box,
 * Aspect Ratio, Reduce by %, Custom px, Generic Heuristics, etc.). Picking
 * a template populates the Width and Height range inputs in one click and
 * surfaces the matching category `tag` chip so the picker visually agrees
 * with the Step 4 action presets that emit the same shapes.
 *
 * `width` / `height` carry `{ min, max }` ranges in px:
 *   - `max: null`  → render as "Any" (open-ended; mapped to the slider's
 *     upper bound `slider.max` so `formatSizeCanonical(...)` emits the
 *     `…px+` open canonical).
 *   - both `min: 0, max: null` → equivalent to clicking the "Any" button
 *     for that dimension.
 *
 * `summary` is a short two-line label rendered on the chip face (e.g.
 * "W 100% · H Auto") so the user can scan the Width/Height shape at a
 * glance without expanding the chip.
 */
/**
 * Each top-level template represents a *category* of size strategy (the
 * row's primary identifier — uppercase tag in the picker). Categories
 * fall into two shapes:
 *
 *   • Multi-alt template — `alternatives: [...]` with at least 2 entries.
 *     Click the row to expand → user picks one of the radio sub-rows.
 *     A sub-row may carry its own `inputs` array (rendered inline below
 *     the sub-row when selected).
 *
 *   • Leaf template — no `alternatives`. Click the row to select it.
 *     May carry `inputs` (rendered inline below the row when selected)
 *     for parametric leafs like "Reduce by %", or no inputs at all for
 *     symbolic leafs like "Generic Heuristics".
 *
 * Each alternative / leaf carries an `emit(values)` function that returns
 * an array of `{ canonical, label }` to push onto the rule's `IF` list
 * when the user clicks "Add condition" at the bottom of the configurator.
 * Returning more than one entry yields coupled conditions (joined by AND
 * via the existing `handleAddCustomCondition` logic).
 */
export const SIZE_STATE_TEMPLATES = [
  {
    tag: 'Reset Scaling',
    name: 'Reset Scaling',
    summary: 'Snap back to base size',
    diagram: 'reset-scaling',
    alternatives: [
      {
        id: 'reset-100-auto',
        label: 'Width 100% · Height Auto',
        summary: 'W 100% · H Auto',
        emit: () => [
          { canonical: 'Width 100%',  label: 'Width: 100%'  },
          { canonical: 'Height Auto', label: 'Height: Auto' }
        ]
      },
      {
        id: 'reset-keep-spx',
        label: 'Width Keep · Height SPX',
        summary: 'W Keep · H SPX',
        emit: () => [
          { canonical: 'Width Keep', label: 'Width: Keep' },
          { canonical: 'Height SPX', label: 'Height: SPX' }
        ]
      }
    ]
  },
  {
    tag: 'Resize to Aspect Ratio',
    name: 'Aspect Ratio',
    summary: 'Fit width, lock proportions',
    diagram: 'aspect-ratio',
    alternatives: [
      {
        id: 'aspect-100-aspect',
        label: 'Width 100% · Height Aspect Ratio',
        summary: 'W 100% · H Aspect',
        emit: () => [
          { canonical: 'Width 100%',         label: 'Width: 100%'           },
          { canonical: 'Height Aspect Ratio', label: 'Height: Aspect Ratio' }
        ]
      },
      {
        id: 'aspect-100-range',
        label: 'Width 100% · Height range',
        summary: 'W 100% · H Min–Max',
        inputs: [
          { key: 'hMin', label: 'Height Min', suffix: 'px', defaultValue: 120, min: 0, step: 1 },
          { key: 'hMax', label: 'Height Max', suffix: 'px', defaultValue: 480, min: 0, step: 1 }
        ],
        emit: ({ hMin, hMax }) => [
          { canonical: 'Width 100%',                  label: 'Width: 100%' },
          { canonical: `Height ${hMin}-${hMax}px`,    label: `Height: ${hMin}px – ${hMax}px` }
        ]
      }
    ]
  },
  {
    tag: 'Reduce by %',
    name: 'Reduce',
    summary: 'Shrink to a percentage',
    diagram: 'reduce-pct',
    inputs: [
      { key: 'wPct', label: 'Width %',  suffix: '%',  defaultValue: 50,  min: 0, max: 100, step: 1 },
      { key: 'wMin', label: 'W Min',    suffix: 'px', defaultValue: 0,   min: 0,           step: 1 },
      { key: 'wMax', label: 'W Max',    suffix: 'px', defaultValue: 100, min: 0,           step: 1 },
      { key: 'hPct', label: 'Height %', suffix: '%',  defaultValue: 50,  min: 0, max: 100, step: 1 },
      { key: 'hMin', label: 'H Min',    suffix: 'px', defaultValue: 0,   min: 0,           step: 1 },
      { key: 'hMax', label: 'H Max',    suffix: 'px', defaultValue: 100, min: 0,           step: 1 }
    ],
    summary: 'Reduce W & H by %',
    emit: ({ wPct, wMin, wMax, hPct, hMin, hMax }) => [
      { canonical: `Width Reduce ${wPct}% (${wMin}-${wMax}px)`,  label: `Width: Reduce ${wPct}% (${wMin}px – ${wMax}px)`  },
      { canonical: `Height Reduce ${hPct}% (${hMin}-${hMax}px)`, label: `Height: Reduce ${hPct}% (${hMin}px – ${hMax}px)` }
    ]
  },
  {
    tag: 'Generic Heuristics',
    name: 'Generic Heuristics',
    summary: 'Use other size heuristics',
    diagram: 'generic',
    emit: () => [
      { canonical: 'Generic Size Heuristic', label: 'Generic size heuristic' }
    ]
  }
]

/* ============================================================
   Step 3 — per-type FORM descriptors for ConditionConfigurator v2

   Each Step 3 condition type (Rotation, Size, Alignment, Spacing,
   Visibility, Pinned, Padding, Margin, Container, OOC, Font Size)
   declares a single `form` object with:
     • fields[]   — list of field descriptors (numeric, range,
                    spectrum, choice, element-pick, numeric-or-any,
                    composite-row), each with a unique `key` and an
                    optional `visibleWhen(values)` predicate
     • emit(values) — builds the canonicals to push onto IF when
                    the user clicks "Add condition"

   Strategy cards / mini-diagrams have been moved out of the IF
   step entirely — those are THEN action presets (Reset Scaling,
   Aspect Ratio, Reduce by %, Generic Heuristics) and live on
   `WIZARD_ACTIONS` above.
   ============================================================ */

/* ── Legacy template arrays kept temporarily for diff readability;
       no longer consumed by the wizard. */
export const ROTATION_TEMPLATES = [
  {
    tag: 'No rotation', name: 'Rotation = 0\u00B0',
    summary: 'Element is upright',
    diagram: 'rot-0', atom: true,
    emit: () => [{ canonical: 'Rotation = 0', label: 'Rotation = 0\u00B0' }]
  },
  {
    tag: 'Tilted', name: 'Element is rotated',
    summary: 'Any non-zero angle',
    diagram: 'rot-tilted', atom: true,
    emit: () => [{ canonical: 'Is Rotated (Value \u2260 0)', label: 'Element is rotated (\u2260 0\u00B0)' }]
  },
  {
    tag: 'Quarter turn', name: 'Rotation = 90\u00B0 / 270\u00B0',
    summary: 'Sideways layout',
    diagram: 'rot-90', atom: true,
    emit: () => [{ canonical: 'Rotation = 90/270 (\u00B1)', label: 'Rotation = 90\u00B0 / 270\u00B0 (\u00B1)' }]
  },
  {
    tag: 'Upside-down', name: 'Rotation = 180\u00B0',
    summary: 'Element is flipped',
    diagram: 'rot-180', atom: true,
    emit: () => [{ canonical: 'Rotation = 180', label: 'Rotation = 180\u00B0' }]
  }
]

export const ALIGNMENT_TEMPLATES = [
  {
    tag: 'Left', name: 'Left-aligned',
    summary: 'All descendant text: left',
    diagram: 'align-left', atom: true,
    emit: () => [{ canonical: 'All Descendant Text Style: Left', label: 'All descendant text: Left' }]
  },
  {
    tag: 'Center', name: 'Center-aligned',
    summary: 'All descendant text: center',
    diagram: 'align-center', atom: true,
    emit: () => [{ canonical: 'All Descendant Text Style: Center', label: 'All descendant text: Center' }]
  },
  {
    tag: 'Right', name: 'Right-aligned',
    summary: 'All descendant text: right',
    diagram: 'align-right', atom: true,
    emit: () => [{ canonical: 'All Descendant Text Style: Right', label: 'All descendant text: Right' }]
  },
  {
    tag: 'Mixed', name: 'Mixed alignment',
    summary: 'Descendant text alignment varies',
    diagram: 'align-mixed', atom: true,
    emit: () => [{ canonical: 'All Descendant Text Style: Mixed', label: 'All descendant text: Mixed' }]
  }
]

/**
 * Position State templates.
 *
 * Two atom cards (First / Last) commit immediately on CTA click.
 * "Element above" and "Element below" each carry a 3-alt segmented
 * control: Same Type / Different Type / Specific element... The
 * "Specific element" alt is a `kind: 'element-pick'` alternative
 * that opens a grouped element list. Picking an element fills
 * `ctx.element` for `emit(ctx)`.
 *
 * "Logo" is an alt-style card with two simple variants (Is logo /
 * Is not logo) — keeps the legacy canonicals intact.
 */
export const POSITION_TEMPLATES = [
  {
    tag: 'First', name: 'First in container',
    summary: 'The element is the first child',
    diagram: 'pos-first', atom: true,
    emit: () => [{ canonical: 'Is First', label: 'Element is first in container' }]
  },
  {
    tag: 'Last', name: 'Last in container',
    summary: 'The element is the last child',
    diagram: 'pos-last', atom: true,
    emit: () => [{ canonical: 'Is Last', label: 'Element is last in container' }]
  },
  {
    tag: 'Above', name: 'Element above',
    summary: 'Match by what sits directly above',
    diagram: 'pos-above',
    alternatives: [
      {
        id: 'above-same', label: 'Same type', summary: 'Above is same component type',
        emit: () => [{ canonical: 'Component Above is Same Type', label: 'Element above is same type' }]
      },
      {
        id: 'above-diff', label: 'Different type', summary: 'Above is a different type',
        emit: () => [{ canonical: 'Component Above is Different Type', label: 'Element above is different type' }]
      },
      {
        id: 'above-specific', label: 'Specific element\u2026', summary: 'Pick an exact component',
        kind: 'element-pick',
        groups: ELEMENT_GROUPS,
        emit: ({ element }) => element
          ? [{ canonical: `Component Above is ${element}`, label: `Element above is ${element}` }]
          : []
      }
    ]
  },
  {
    tag: 'Below', name: 'Element below',
    summary: 'Match by what sits directly below',
    diagram: 'pos-below',
    alternatives: [
      {
        id: 'below-same', label: 'Same type', summary: 'Below is same component type',
        emit: () => [{ canonical: 'Component Below is Same Type', label: 'Element below is same type' }]
      },
      {
        id: 'below-diff', label: 'Different type', summary: 'Below is a different type',
        emit: () => [{ canonical: 'Component Below is Different Type', label: 'Element below is different type' }]
      },
      {
        id: 'below-specific', label: 'Specific element\u2026', summary: 'Pick an exact component',
        kind: 'element-pick',
        groups: ELEMENT_GROUPS,
        emit: ({ element }) => element
          ? [{ canonical: `Component Below is ${element}`, label: `Element below is ${element}` }]
          : []
      }
    ]
  },
  {
    tag: 'Logo', name: 'Logo state',
    summary: 'Whether the element is the logo',
    diagram: 'pos-logo',
    alternatives: [
      {
        id: 'is-logo',     label: 'Is logo',     summary: 'Mark as the page logo',
        emit: () => [{ canonical: 'Is Logo Component',     label: 'Element is logo' }]
      },
      {
        id: 'is-not-logo', label: 'Is not logo', summary: 'Explicitly not the logo',
        emit: () => [{ canonical: 'Is NOT Logo Component', label: 'Element is not logo' }]
      }
    ]
  }
]

export const VISIBILITY_TEMPLATES = [
  {
    tag: 'Visible', name: 'Element is visible',
    summary: 'Rendered and laid out',
    diagram: 'vis-visible', atom: true,
    emit: () => [{ canonical: 'Is Visible', label: 'Element is visible' }]
  },
  {
    tag: 'Hidden', name: 'Element is hidden',
    summary: 'Removed from the layout',
    diagram: 'vis-hidden', atom: true,
    emit: () => [{ canonical: 'Is Hidden', label: 'Element is hidden' }]
  }
]

export const PINNED_TEMPLATES = [
  {
    tag: 'Pinned', name: 'Element is pinned',
    summary: 'Sticks to the viewport',
    diagram: 'pin-yes', atom: true,
    emit: () => [{ canonical: 'Is Pinned', label: 'Element is pinned' }]
  },
  {
    tag: 'Not pinned', name: 'Element is not pinned',
    summary: 'Scrolls with the page',
    diagram: 'pin-no', atom: true,
    emit: () => [{ canonical: 'Is Not Pinned', label: 'Element is not pinned' }]
  }
]

export const PADDING_TEMPLATES = [
  {
    tag: 'Has padding', name: 'Has padding',
    summary: 'Element has inner spacing',
    diagram: 'pad-yes', atom: true,
    emit: () => [{ canonical: 'Has Padding', label: 'Has padding' }]
  },
  {
    tag: 'No padding', name: 'No padding',
    summary: 'Element has no inner spacing',
    diagram: 'pad-no', atom: true,
    emit: () => [{ canonical: 'No Padding', label: 'No padding' }]
  }
]

export const MARGIN_TEMPLATES = [
  {
    tag: 'Has margin', name: 'Has margin',
    summary: 'Element has outer spacing',
    diagram: 'mar-yes', atom: true,
    emit: () => [{ canonical: 'Has Margin', label: 'Has margin' }]
  },
  {
    tag: 'No margin', name: 'No margin',
    summary: 'Element has no outer spacing',
    diagram: 'mar-no', atom: true,
    emit: () => [{ canonical: 'No Margin', label: 'No margin' }]
  }
]

export const CONTAINER_TEMPLATES = [
  {
    tag: 'Blank', name: 'Container is blank',
    summary: 'No children inside',
    diagram: 'cont-blank', atom: true,
    emit: () => [{ canonical: 'Blank', label: 'Container is blank' }]
  },
  {
    tag: 'Has elements', name: 'Container has elements',
    summary: 'One or more children',
    diagram: 'cont-has', atom: true,
    emit: () => [{ canonical: 'Contains Elements', label: 'Container has elements' }]
  }
]

/* ============================================================
   Helpers used by the form `emit` builders below.
   ============================================================ */

const PIN_POSITIONS = [
  'Any', 'Center',
  'Top left', 'Top', 'Top Right',
  'Left', 'Right',
  'Bottom Left', 'Bottom', 'Bottom Right'
]

const ALIGN_OPTS = ['Mixed', 'Left', 'Right', 'Center']

const SPACING_REL_OPTS = [
  { value: 'first',          label: 'Element is first' },
  { value: 'last',           label: 'Element is Last' },
  { value: 'above-specific', label: 'Element Above is\u2026' }
]

/* Spectrum emitter — emits one or two canonicals (single-value or
 * range) depending on `mode`. `dim` is the canonical dimension
 * label ("Padding", "Margin", "Width", "Height"); `prefix` is the
 * canonical prefix used in the IF list ("Desktop Width" for size,
 * just "Padding" for padding). */
function emitSpectrum(value, prefix, dim, displayDim) {
  if (!value) return null
  if (value.mode === 'single') {
    const v = value.single?.[dim]
    if (v == null) return null
    return {
      canonical: `${prefix}: ${v}px`,
      label:     `${displayDim || dim}: ${v}px`
    }
  }
  const r = value.range?.[dim]
  if (!r) return null
  return {
    canonical: `${prefix}: ${r.min}px \u2013 ${r.max}px`,
    label:     `${displayDim || dim}: ${r.min}\u2013${r.max}px`
  }
}

/**
 * Resolve the form descriptor + intro copy for a given Step 3
 * condition type id. Returns null for unknown ids so callers can
 * fall through to a fallback UI.
 */
export function configForConditionType(typeId) {
  switch (typeId) {

    /* ── Rotation ── */
    case 'rotation':
      return {
        intro:    { title: 'Rotation', subtitle: 'Pick the rotation angle to match.' },
        category: 'Rotation State',
        form: {
          fields: [
            {
              type: 'numeric', key: 'value',
              label: 'Rotation value is',
              suffix: '\u00B0',
              defaultValue: 0, min: -360, max: 360, step: 1
            }
          ],
          emit: ({ value }) => {
            const n = Number(value)
            if (n === 0) return [{ canonical: 'Rotation = 0', label: 'Rotation = 0\u00B0' }]
            if (n === 180 || n === -180) return [{ canonical: 'Rotation = 180', label: 'Rotation = 180\u00B0' }]
            if (n === 90 || n === -90 || n === 270 || n === -270) {
              return [{ canonical: 'Rotation = 90/270 (\u00B1)', label: 'Rotation = 90\u00B0 / 270\u00B0' }]
            }
            return [{
              canonical: `Rotation = ${n}`,
              label:     `Rotation = ${n}\u00B0`
            }]
          }
        }
      }

    /* ── Size (Width + Height; single value or min\u2013max range) ── */
    case 'size':
      return {
        intro:    { title: 'Size', subtitle: 'When the element on desktop is this size.' },
        category: 'Size-based',
        form: {
          fields: [
            {
              type: 'spectrum', key: 'size',
              label: '',
              dimensions: ['Width', 'Height'],
              suffix: 'px',
              min: 0, max: 9999, step: 1,
              defaultMode: 'single',
              defaultValue: {
                mode: 'single',
                single: { Width: 100, Height: 100 },
                range:  { Width: { min: 0, max: 100 }, Height: { min: 0, max: 100 } }
              }
            }
          ],
          emit: ({ size }) => [
            emitSpectrum(size, 'Desktop Width',  'Width'),
            emitSpectrum(size, 'Desktop Height', 'Height')
          ].filter(Boolean)
        }
      }

    /* ── Text Alignment ── */
    case 'alignment':
      return {
        intro:    { title: 'Alignment', subtitle: 'All Direct Children Align value.' },
        category: 'Text Alignment State',
        form: {
          fields: [
            {
              type: 'choice', key: 'align',
              label: 'All Direct Children Align value',
              options: ALIGN_OPTS.map((v) => ({ value: v, label: v })),
              defaultValue: 'Left'
            }
          ],
          emit: ({ align }) => [{
            canonical: `All Descendant Text Style: ${align}`,
            label:     `All descendant text: ${align}`
          }]
        }
      }

    /* ── Spacing (formerly Position) ── */
    case 'position':
      return {
        intro:    { title: 'Spacing', subtitle: 'Match the element\u2019s order or its neighbour.' },
        category: 'Spacing',
        form: {
          fields: [
            {
              type: 'choice', key: 'rel',
              label: '',
              options: SPACING_REL_OPTS,
              defaultValue: 'first'
            },
            {
              type: 'element-pick', key: 'aboveElement',
              label: 'Element selection',
              groups: ELEMENT_GROUPS,
              visibleWhen: (v) => v.rel === 'above-specific'
            }
          ],
          emit: ({ rel, aboveElement }) => {
            if (rel === 'first') {
              return [{ canonical: 'Is First', label: 'Element is first' }]
            }
            if (rel === 'last') {
              return [{ canonical: 'Is Last',  label: 'Element is last' }]
            }
            if (rel === 'above-specific' && aboveElement) {
              return [{
                canonical: `Component Above is ${aboveElement}`,
                label:     `Element above is ${aboveElement}`
              }]
            }
            return []
          }
        }
      }

    /* ── Visibility ── */
    case 'visibility':
      return {
        intro:    { title: 'Visibility', subtitle: 'Show or hide the element.' },
        category: 'Visibility State',
        form: {
          fields: [
            {
              type: 'choice', key: 'value',
              label: 'Visibility Value',
              options: [
                { value: 'Show', label: 'Show' },
                { value: 'Hide', label: 'Hide' }
              ],
              defaultValue: 'Show'
            }
          ],
          emit: ({ value }) => [
            value === 'Hide'
              ? { canonical: 'Is Hidden',  label: 'Element is hidden' }
              : { canonical: 'Is Visible', label: 'Element is visible' }
          ]
        }
      }

    /* ── Pinned ── */
    case 'pinned':
      return {
        intro:    { title: 'Pinned', subtitle: 'Match a pinned position and offset.' },
        category: 'Pinned State',
        form: {
          fields: [
            {
              type: 'composite-row', key: '__pinned_row',
              fields: [
                {
                  type: 'choice', key: 'position',
                  label: 'Pinned Value',
                  options: PIN_POSITIONS.map((p) => ({ value: p, label: p })),
                  defaultValue: 'Any'
                },
                {
                  type: 'numeric-or-any', key: 'offset',
                  label: 'Offset',
                  suffix: 'px',
                  min: 0, max: 9999, step: 1,
                  defaultValue: { mode: 'any', value: 0 }
                }
              ]
            }
          ],
          emit: ({ position, offset }) => {
            const pos = position || 'Any'
            const off = offset && offset.mode === 'value' ? `${offset.value}px` : 'Any'
            if (pos === 'Any' && off === 'Any') {
              return [{ canonical: 'Is Pinned', label: 'Element is pinned' }]
            }
            return [{
              canonical: `Pinned: ${pos} @ ${off}`,
              label:     `Pinned: ${pos} \u00B7 offset ${off}`
            }]
          }
        }
      }

    /* ── Padding (single value OR min\u2013max range) ── */
    case 'padding':
      return {
        intro:    { title: 'Padding', subtitle: 'Inner spacing on the element.' },
        category: 'Padding State',
        form: {
          fields: [
            {
              type: 'spectrum', key: 'padding',
              label: 'Padding value',
              dimensions: ['Padding'],
              suffix: 'px',
              min: 0, max: 9999, step: 1,
              defaultMode: 'single',
              defaultValue: {
                mode: 'single',
                single: { Padding: 16 },
                range:  { Padding: { min: 0, max: 16 } }
              }
            }
          ],
          emit: ({ padding }) => {
            const e = emitSpectrum(padding, 'Padding', 'Padding')
            return e ? [e] : []
          }
        }
      }

    /* ── Margin (single value OR min\u2013max range) ── */
    case 'margin':
      return {
        intro:    { title: 'Margin', subtitle: 'Outer spacing around the element.' },
        category: 'Margin State',
        form: {
          fields: [
            {
              type: 'spectrum', key: 'margin',
              label: 'Margin value',
              dimensions: ['Margin'],
              suffix: 'px',
              min: 0, max: 9999, step: 1,
              defaultMode: 'single',
              defaultValue: {
                mode: 'single',
                single: { Margin: 16 },
                range:  { Margin: { min: 0, max: 16 } }
              }
            }
          ],
          emit: ({ margin }) => {
            const e = emitSpectrum(margin, 'Margin', 'Margin')
            return e ? [e] : []
          }
        }
      }

    /* ── Container ── */
    case 'container':
      return {
        intro:    { title: 'Container', subtitle: 'Whether the container has any children.' },
        category: 'Container State',
        form: {
          fields: [
            {
              type: 'choice', key: 'state',
              label: 'Container state',
              options: [
                { value: 'Blank',             label: 'Blank',             help: 'No children inside' },
                { value: 'Contains Elements', label: 'Has elements',      help: 'One or more children' }
              ],
              defaultValue: 'Blank'
            }
          ],
          emit: ({ state }) => [{
            canonical: state,
            label:     state === 'Blank' ? 'Container is blank' : 'Container has elements'
          }]
        }
      }

    /* ── OOC (Order) — new ── */
    case 'ooc':
      return {
        intro:    { title: 'OOC', subtitle: 'Out-of-order container behaviour.' },
        category: 'OOC',
        form: {
          fields: [
            {
              type: 'choice', key: 'order',
              label: 'Order',
              options: [
                { value: 'Any Order', label: 'Any Order' }
              ],
              defaultValue: 'Any Order'
            }
          ],
          emit: ({ order }) => [{
            canonical: `Order: ${order}`,
            label:     `Order: ${order}`
          }]
        }
      }

    /* ── Font Size — new (range only per spec) ── */
    case 'font-size':
      return {
        intro:    { title: 'Font Size', subtitle: 'Match a font-size range in pixels.' },
        category: 'Font Size State',
        form: {
          fields: [
            {
              type: 'range', key: 'fontSize',
              label: 'Range',
              suffix: 'px',
              min: 1, max: 999, step: 1,
              defaultValue: { min: 14, max: 18 }
            }
          ],
          emit: ({ fontSize }) => [{
            canonical: `Font Size: ${fontSize.min}\u2013${fontSize.max}px`,
            label:     `Font size: ${fontSize.min}\u2013${fontSize.max}px`
          }]
        }
      }

    default:
      return null
  }
}

/** §7.4 — first option pre-selected in UI. */
export const PRIORITY_OPTIONS = [
  { value: 1, label: '1 — global default (pre-selected)' },
  { value: 2, label: '2 — context-specific override' },
  { value: 3, label: '3 — exception' }
]

export const ELEMENT_GROUP_DROPDOWN = ['Layout', 'Interactive', 'Text', 'Media', 'Decorative', 'Containers']

export const CONDITION_TYPE_DROPDOWN = [
  'Rotation',
  'Size',
  'Alignment',
  'Spacing',
  'Visibility',
  'Pinned',
  'Padding',
  'Margin',
  'Container',
  'OOC',
  'Font Size'
]

/**
 * Step 3 condition types — modelled on the IF→THEN chart.
 * Each type bundles:
 *   • `members` — the canonical conditions selectable inside this type
 *   • `actions` — the THEN actions allowed when this type is in play
 *                 (used by Step 4 gating; null/empty = no restriction)
 *   • `slider`  — optional dual-thumb slider config for numeric ranges
 *                 (`size` for px width/height, `padding`/`margin` for spacing)
 */
export const CONDITION_TYPES = [
  {
    id: 'rotation',
    label: 'Rotation',
    desc: 'The element’s rotation angle',
    members: [
      'Rotation = 0',
      'Is Rotated (Value ≠ 0)',
      'Rotation = 90/270 (±)',
      'Rotation = 180'
    ],
    actions: ['Set Rotation']
  },
  {
    id: 'size',
    label: 'Size',
    desc: 'Desktop width / height (single value or range)',
    members: [
      'Desktop Width: 1px – 100px',
      'Desktop Width: 101px – 200px',
      'Desktop Width: 201px+',
      'Desktop Height: 1px – 100px',
      'Desktop Height: 101px+'
    ],
    slider: { kind: 'size', min: 0, max: 600, step: 1, defaults: { min: 0, max: 100 } },
    actions: [
      'Set Size',
      'Set Min Height',
      // Item Size / Font Size preset cards (each carries a category `tag`
      // like "Reset Scaling", "Resize to Aspect Ratio", "Reduce by %",
      // "Custom", "Generic Heuristics" — surfaced as a chip on the tile
      // and on the diagram's THEN/ELSE result-node header).
      'Set Item Size — Bounding Box',
      'Set Item Size — Height (PX)',
      'Set Item Size — Width (PX)',
      'Set Item Size — Aspect Ratio',
      'Set Item Size — Aspect Ratio (Bounded)',
      'Reduce Item Size',
      'Set Item Size — Keep Size + SPX',
      'Set Item Size — Keep Size · Min/Max Height',
      'Set Font Size (PX)',
      'Set Font Size (Auto)'
    ]
  },
  {
    id: 'alignment',
    label: 'Alignment',
    desc: 'How descendant text is aligned',
    members: [
      'All Descendant Text Style: Left',
      'All Descendant Text Style: Center',
      'All Descendant Text Style: Right',
      'All Descendant Text Style: Mixed'
    ],
    actions: ['Set Position', 'Set Alignment']
  },
  {
    id: 'position',
    label: 'Spacing',
    desc: 'Element’s order or what sits next to it',
    members: [
      'Is First',
      'Is Last',
      'Component Above is Same Type',
      'Component Above is Different Type',
      'Component Below is Same Type',
      'Component Below is Different Type',
      'Is Logo Component',
      'Is NOT Logo Component'
    ],
    actions: ['Set OOG', 'Set Margin', 'Set Padding', 'Set Spacing']
  },
  {
    id: 'visibility',
    label: 'Visibility',
    desc: 'Whether the element is shown or hidden',
    members: ['Is Visible', 'Is Hidden'],
    actions: ['Set Visibility']
  },
  {
    id: 'pinned',
    label: 'Pinned',
    desc: 'Pinned position and offset',
    members: ['Is Pinned', 'Is Not Pinned'],
    actions: ['Set Pinned']
  },
  {
    id: 'padding',
    label: 'Padding',
    desc: 'Inner spacing on the element',
    members: ['Has Padding', 'No Padding'],
    slider: { kind: 'padding', min: 0, max: 80, step: 1, defaults: { min: 0, max: 16 } },
    actions: ['Set Margin', 'Set Padding', 'Set Spacing']
  },
  {
    id: 'margin',
    label: 'Margin',
    desc: 'Outer spacing around the element',
    members: ['Has Margin', 'No Margin'],
    slider: { kind: 'margin', min: 0, max: 80, step: 1, defaults: { min: 0, max: 16 } },
    actions: ['Set Margin', 'Set Padding', 'Set Spacing']
  },
  {
    id: 'container',
    label: 'Container',
    desc: 'Whether the container is blank or has elements',
    members: ['Blank', 'Contains Elements'],
    actions: [
      'Set Size',
      'Set Min Height',
      'Set Item Size — Bounding Box',
      'Set Item Size — Height (PX)',
      'Set Item Size — Width (PX)',
      'Set Item Size — Aspect Ratio',
      'Set Item Size — Aspect Ratio (Bounded)',
      'Reduce Item Size',
      'Set Item Size — Keep Size + SPX',
      'Set Item Size — Keep Size · Min/Max Height'
    ]
  },
  {
    id: 'ooc',
    label: 'OOC',
    desc: 'Out-of-order container behaviour',
    members: ['Order: Any Order'],
    actions: ['Set OOG']
  },
  {
    id: 'font-size',
    label: 'Font Size',
    desc: 'Match a font-size range in pixels',
    members: [],
    actions: ['Set Font Size', 'Set Font Size (PX)', 'Set Font Size (Auto)']
  }
]

const SIZE_CANON_RE = /^Desktop\s+(Width|Height):\s*(\d+)px\s*(?:–|-)\s*(\d+)px$/i
const SIZE_CANON_OPEN_RE = /^Desktop\s+(Width|Height):\s*(\d+)px\+$/i
const SIZE_CANON_ANY_RE = /^Desktop\s+(Width|Height):\s*Any$/i

/**
 * Returns `{ dim: 'Width'|'Height', min, max|null, any?: boolean }` for a
 * Size canonical, or null. The `Any` form (no constraint on this dimension)
 * is reported with `any: true` and `min/max = null`.
 */
export function parseSizeCanonical(canonical) {
  if (!canonical) return null
  const ma = String(canonical).match(SIZE_CANON_ANY_RE)
  if (ma) {
    const dim = ma[1].charAt(0).toUpperCase() + ma[1].slice(1).toLowerCase()
    return { dim, min: null, max: null, any: true }
  }
  const m1 = String(canonical).match(SIZE_CANON_RE)
  if (m1) {
    const dim = m1[1].charAt(0).toUpperCase() + m1[1].slice(1).toLowerCase()
    return { dim, min: Number(m1[2]), max: Number(m1[3]) }
  }
  const m2 = String(canonical).match(SIZE_CANON_OPEN_RE)
  if (m2) {
    const dim = m2[1].charAt(0).toUpperCase() + m2[1].slice(1).toLowerCase()
    return { dim, min: Number(m2[2]), max: null }
  }
  return null
}

/**
 * Build a canonical Size string. If `max` is null OR equal to the slider
 * ceiling (600 by default), the open-ended `Npx+` form is used. Pass `min`
 * as `null` (or both `min` and `max` as `null`) to produce the `Any` form
 * meaning "no constraint on this dimension".
 */
export function formatSizeCanonical(dim, min, max, ceiling = 600) {
  const d = dim === 'Width' || dim === 'Height' ? dim : 'Width'
  if (min == null && max == null) return `Desktop ${d}: Any`
  if (max == null || max >= ceiling) return `Desktop ${d}: ${min}px+`
  return `Desktop ${d}: ${min}px – ${max}px`
}

/** Human-readable label for a Size canonical (used by chips/diagram). */
export function formatSizeLabel(dim, min, max, ceiling = 600) {
  const d = (dim === 'Width' || dim === 'Height' ? dim : 'Width').toLowerCase()
  if (min == null && max == null) return `Desktop ${d}: Any`
  if (max == null || max >= ceiling) return `Desktop ${d}: ${min}px+`
  return `Desktop ${d}: ${min}–${max}px`
}

const SPACING_CANON_RE = /^(Padding|Margin):\s*(\d+)px\s*(?:–|-)\s*(\d+)px$/i
const SPACING_CANON_OPEN_RE = /^(Padding|Margin):\s*(\d+)px\+$/i

/** Returns `{ kind: 'Padding'|'Margin', min, max|null }` for a spacing canonical, or null. */
export function parseSpacingCanonical(canonical) {
  if (!canonical) return null
  const m1 = String(canonical).match(SPACING_CANON_RE)
  if (m1) {
    const kind = m1[1].charAt(0).toUpperCase() + m1[1].slice(1).toLowerCase()
    return { kind, min: Number(m1[2]), max: Number(m1[3]) }
  }
  const m2 = String(canonical).match(SPACING_CANON_OPEN_RE)
  if (m2) {
    const kind = m2[1].charAt(0).toUpperCase() + m2[1].slice(1).toLowerCase()
    return { kind, min: Number(m2[2]), max: null }
  }
  return null
}

/** Build a canonical Padding/Margin range string. */
export function formatSpacingCanonical(kind, min, max, ceiling = 80) {
  const k = kind === 'Margin' ? 'Margin' : 'Padding'
  if (max == null || max >= ceiling) return `${k}: ${min}px+`
  return `${k}: ${min}px – ${max}px`
}

/** Human-readable label for a Padding/Margin canonical. */
export function formatSpacingLabel(kind, min, max, ceiling = 80) {
  const k = kind === 'Margin' ? 'Margin' : 'Padding'
  if (max == null || max >= ceiling) return `${k}: ${min}px+`
  return `${k}: ${min}–${max}px`
}

/**
 * Bucket a canonical condition into one of CONDITION_TYPES.
 * Returns the type id, or null if it doesn't fit (e.g. user-authored 'Other').
 */
export function typeForCanonical(canonical) {
  if (!canonical || canonical === 'Any') return null
  if (parseSizeCanonical(canonical)) return 'size'
  const sp = parseSpacingCanonical(canonical)
  if (sp) return sp.kind === 'Margin' ? 'margin' : 'padding'
  for (const t of CONDITION_TYPES) {
    if (t.members.includes(canonical)) return t.id
  }
  // Dynamic Position State canonicals authored via the dropdown picker:
  //   "Component Above is <X>" / "Component Below is <X>" / "Is <X>" / "Is NOT <X>"
  // The static-member lookup above already catches Is First/Is Last/Is Visible/etc.,
  // so anything still matching these patterns is an element-name dropdown choice.
  if (parsePositionCanonical(canonical)) return 'position'
  return null
}

const POS_ABOVE_RE = /^Component Above is (.+)$/
const POS_BELOW_RE = /^Component Below is (.+)$/
const POS_IS_NOT_RE = /^Is NOT (.+)$/
const POS_IS_RE = /^Is (.+)$/

/**
 * Returns `{ relation, value }` for dynamic Position State canonicals,
 * where relation ∈ 'above' | 'below' | 'is' | 'is-not'. Returns null
 * for any non-position-shaped canonical.
 */
export function parsePositionCanonical(canonical) {
  if (!canonical) return null
  let m = canonical.match(POS_ABOVE_RE)
  if (m) return { relation: 'above', value: m[1] }
  m = canonical.match(POS_BELOW_RE)
  if (m) return { relation: 'below', value: m[1] }
  m = canonical.match(POS_IS_NOT_RE)
  if (m) return { relation: 'is-not', value: m[1] }
  m = canonical.match(POS_IS_RE)
  if (m) return { relation: 'is', value: m[1] }
  return null
}

/**
 * Build a canonical from a Position State row + value. Keeps the
 * legacy `Is Logo Component` / `Is NOT Logo Component` shape for the
 * Logo meta-option so existing rules continue to match.
 */
export function formatPositionCanonical(relation, value) {
  if (!relation || !value) return ''
  if (relation === 'is' && value === 'Logo') return 'Is Logo Component'
  if (relation === 'is-not' && value === 'Logo') return 'Is NOT Logo Component'
  if (relation === 'above') return `Component Above is ${value}`
  if (relation === 'below') return `Component Below is ${value}`
  if (relation === 'is') return `Is ${value}`
  if (relation === 'is-not') return `Is NOT ${value}`
  return ''
}

/**
 * Human-readable label for a Position State canonical (used by chips,
 * the diagram, and Step 5 review). Falls back to the canonical itself.
 */
export function formatPositionLabel(canonical) {
  const p = parsePositionCanonical(canonical)
  if (!p) return canonical
  if (p.relation === 'above') return `Element above is ${p.value}`
  if (p.relation === 'below') return `Element below is ${p.value}`
  if (p.relation === 'is-not') {
    if (p.value === 'Logo Component') return 'Element is not Logo'
    return `Element is not ${p.value}`
  }
  if (p.value === 'Logo Component') return 'Element is Logo'
  return `Element is ${p.value}`
}

/**
 * Compute the union of allowed Step 4 actions for a set of selected
 * IF canonicals. `null` = no restriction (no conditions / Any selected /
 * unknown canonicals only).
 */
export function actionsForCanonicals(ifCanonicals) {
  if (!ifCanonicals || ifCanonicals.length === 0) return null
  if (ifCanonicals.length === 1 && ifCanonicals[0] === 'Any') return null
  const out = new Set()
  let anyKnown = false
  for (const c of ifCanonicals) {
    if (c === 'Any') continue
    const tid = typeForCanonical(c)
    const t = CONDITION_TYPES.find(x => x.id === tid)
    if (!t || !t.actions) continue
    anyKnown = true
    for (const a of t.actions) out.add(a)
  }
  return anyKnown ? [...out] : null
}

/** Step titles (handover §1 overview + section headers). */
export const STEP_HEADINGS = {
  1: { title: 'Element — which element does this rule apply to?', maps: 'Maps to: WHEN' },
  2: { title: 'Context — where does this rule apply?', maps: 'Maps to: IN' },
  3: { title: 'Condition — when does this rule fire?', maps: 'Maps to: IF' },
  4: { title: 'Result — what should happen?', maps: 'Maps to: THEN' },
  5: { title: 'Review and save', maps: 'Conflict check + plain-language sentence + save' }
}

/**
 * Build the human-readable parameters string for a rule row.
 *
 * - `info` fields use the field's locked `value` (always emitted, even if the
 *   user never touched the form — they're preset parts of the action).
 * - `number` fields append the field's `suffix` (e.g. "px", "%") to the value.
 * - `text` / `select` fields use the user's value verbatim and are skipped
 *   when blank.
 */
export function buildParametersString(actionKey, fieldValues) {
  const def = WIZARD_ACTIONS.find(a => a.action === actionKey)
  if (!def) return ''
  const parts = []
  for (const f of def.fields) {
    if (f.type === 'info') {
      const v = (f.value != null ? f.value : fieldValues[f.key])
      if (v != null && String(v).trim() !== '') {
        parts.push(`${f.label}: ${String(v).trim()}`)
      }
      continue
    }
    const raw = fieldValues[f.key]
    const v = raw != null ? String(raw).trim() : ''
    if (v === '') continue
    if (f.type === 'number') {
      parts.push(`${f.label}: ${v}${f.suffix || ''}`)
    } else {
      parts.push(`${f.label}: ${v}`)
    }
  }
  return parts.join(' | ')
}

/**
 * Compact preset/parameter lines for the diagram preview — one line per
 * non-empty field, formatted exactly like the screenshots ("Width: 100%",
 * "Width: 320px", "Height: Aspect ratio", etc.). Returns an array of strings.
 */
export function buildResultLines(actionKey, fieldValues) {
  const def = WIZARD_ACTIONS.find(a => a.action === actionKey)
  if (!def) return []
  const out = []
  for (const f of def.fields) {
    if (f.type === 'info') {
      const v = (f.value != null ? f.value : fieldValues[f.key])
      if (v != null && String(v).trim() !== '') out.push(`${f.label}: ${String(v).trim()}`)
      continue
    }
    const raw = fieldValues[f.key]
    const v = raw != null ? String(raw).trim() : ''
    if (v === '') continue
    if (f.type === 'number') out.push(`${f.label}: ${v}${f.suffix || ''}`)
    else out.push(`${f.label}: ${v}`)
  }
  return out
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
    'Rotation = 0': 'rotation is 0°',
    'Is Rotated (Value ≠ 0)': 'the element is rotated',
    'Rotation = 90/270 (±)': 'rotation is 90° or 270°',
    'Rotation = 180': 'rotation is 180°',
    'All Descendant Text Style: Left': 'all descendant text is left-aligned',
    'All Descendant Text Style: Center': 'all descendant text is center-aligned',
    'All Descendant Text Style: Right': 'all descendant text is right-aligned',
    'All Descendant Text Style: Mixed': 'descendant text alignment is mixed',
    'Is Visible': 'the element is visible',
    'Is Hidden': 'the element is hidden',
    'Is Pinned': 'the element is pinned',
    'Is Not Pinned': 'the element is not pinned',
    'Has Padding': 'the element has padding',
    'No Padding': 'the element has no padding',
    'Has Margin': 'the element has margin',
    'No Margin': 'the element has no margin',
    Blank: 'the container is blank',
    'Contains Elements': 'the container has elements',
    'Component Above is Same Type': 'the element above is the same type',
    'Component Above is Different Type': 'the element above is a different type',
    'Component Below is Same Type': 'the element below is the same type',
    'Component Below is Different Type': 'the element below is a different type',
    'Is Logo Component': 'the element is the logo',
    'Is NOT Logo Component': 'the element is not the logo'
  }
  if (map[ifCanonical]) return map[ifCanonical]
  const sized = parseSizeCanonical(ifCanonical)
  if (sized) {
    const dim = sized.dim.toLowerCase()
    if (sized.any) return `desktop ${dim} is any size`
    if (sized.max == null) return `desktop ${dim} is ${sized.min}px+`
    return `desktop ${dim} is ${sized.min}–${sized.max}px`
  }
  const spaced = parseSpacingCanonical(ifCanonical)
  if (spaced) {
    const k = spaced.kind.toLowerCase()
    if (spaced.max == null) return `${k} is ${spaced.min}px+`
    return `${k} is ${spaced.min}–${spaced.max}px`
  }
  const pos = parsePositionCanonical(ifCanonical)
  if (pos) {
    if (pos.relation === 'above') return `the element above is a ${pos.value}`
    if (pos.relation === 'below') return `the element below is a ${pos.value}`
    if (pos.relation === 'is-not') return `the element is not a ${pos.value}`
    return `the element is a ${pos.value}`
  }
  return (ifDisplayLabel || ifCanonical).toLowerCase()
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
