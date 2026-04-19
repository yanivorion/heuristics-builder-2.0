export const HEADER_SEED_DATA = [
  { rule_id: 1, category: "Header Grid", when: "Super Grid", "in": "Any Parent", "if": "Structure in desktop", action: "Set Pinned", parameters: "Don't wrap rows into columns", summary: "Set Pinned | Don't wrap rows into columns", priority: 1, status: "Mapped", note: "" },
  { rule_id: 2, category: "Header Grid", when: "Super Grid", "in": "Any Parent", "if": "Empty Cells", action: "Set Visibility", parameters: "Value: Hide", summary: "Set Visibility | Value: Hide", priority: 1, status: "Mapped", note: "" },
  { rule_id: 3, category: "Header Grid", when: "Super Grid Cell", "in": "Any Parent", "if": "Cell contains logo → Language LTR", action: "Set Alignment", parameters: "Position: Most left side", summary: "Set Alignment | Position: Most left side", priority: 1, status: "Mapped", note: "" },
  { rule_id: 4, category: "Header Grid", when: "Super Grid Cell", "in": "Any Parent", "if": "Cell contains Menu / Cart / Search → Language LTR", action: "Set Alignment", parameters: "Position: Most right side", summary: "Set Alignment | Position: Most right side", priority: 1, status: "Mapped", note: "" },
  { rule_id: 5, category: "Header Grid", when: "Super Grid Cell", "in": "Any Parent", "if": "Child is logo → Language LTR → Header padding = 0px", action: "Set Margin", parameters: "Margin Left: 24px", summary: "Set Margin | Margin Left: 24px", priority: 1, status: "Mapped", note: "" },
  { rule_id: 6, category: "Header Grid", when: "Super Grid Cell", "in": "Any Parent", "if": "Cell contains Menu / Cart → Language LTR → Header padding = 0px", action: "Set Margin", parameters: "Margin Right: 24px", summary: "Set Margin | Margin Right: 24px", priority: 1, status: "Mapped", note: "" },
  { rule_id: 7, category: "Header Grid", when: "Super Grid", "in": "Any Parent", "if": "Section padding value > 0", action: "Set Padding", parameters: "Padding: 24px (each edge separately)", summary: "Set Padding | Padding: 24px (each edge separately)", priority: 1, status: "Mapped", note: "" },
  { rule_id: 8, category: "Header Grid", when: "Super Grid Cell", "in": "Any Parent", "if": "Padding is any value", action: "Set Padding", parameters: "Padding: 0px", summary: "Set Padding | Padding: 0px", priority: 1, status: "Mapped", note: "" },
  { rule_id: 9, category: "Header Grid", when: "Header Cell", "in": "Any Parent", "if": "Any width", action: "Set Size", parameters: "Width: Equal on all cells", summary: "Set Size | Width: Equal on all cells", priority: 1, status: "Mapped", note: "" },
  { rule_id: 10, category: "Header Docking", when: "Header", "in": "Any Parent", "if": "Docking is applied on desktop", action: "Set Pinned", parameters: "—", summary: "Set Pinned", priority: 1, status: "Mapped", note: "" },
  { rule_id: 11, category: "Header Layout", when: "Header Cell", "in": "Any Parent", "if": "Cell contains elements", action: "Set Alignment", parameters: "Vertical Align: Center", summary: "Set Alignment | Vertical Align: Center", priority: 1, status: "Mapped", note: "" },
  { rule_id: 12, category: "Header Layout", when: "Header Section", "in": "Any Parent", "if": "Stack / No stack", action: "Set Pinned", parameters: "Always preserve horizontal stack", summary: "Set Pinned | Always preserve horizontal stack", priority: 1, status: "Mapped", note: "Spacing: 24px outer, 12px between elements" },
  { rule_id: 13, category: "Header Layout", when: "Header Cell", "in": "Any Parent", "if": "1 cell only / CSS Grid", action: "Set Size", parameters: "Apply: Harmony heuristics", summary: "Set Size | Apply: Harmony heuristics", priority: 1, status: "Mapped", note: "" },
  { rule_id: 14, category: "Header Size", when: "Header", "in": "Any Parent", "if": "Blank (no elements)", action: "Set Size", parameters: "Height: 70px", summary: "Set Size | Height: 70px", priority: 1, status: "Mapped", note: "Nested containers also 70px" },
  { rule_id: 15, category: "Header Size", when: "Header", "in": "Any Parent", "if": "Contains elements", action: "Set Size", parameters: "Height: Auto", summary: "Set Size | Height: Auto", priority: 1, status: "Mapped", note: "" },
  { rule_id: 16, category: "Header Layout", when: "Header (Stretched)", "in": "Any Parent", "if": "Stretched layout", action: "Set Size", parameters: "Apply: Standard section heuristics", summary: "Set Size | Apply: Standard section heuristics", priority: 1, status: "Mapped", note: "" }
]

export const HEADER_COLUMNS = [
  { key: 'rule_id', label: 'ID', className: 'col-id' },
  { key: 'category', label: 'Category', className: 'col-category' },
  { key: 'when', label: 'When', className: 'col-when' },
  { key: 'in', label: 'In', className: 'col-in' },
  { key: 'if', label: 'If', className: 'col-if' },
  { key: 'action', label: 'Action', className: 'col-action' },
  { key: 'parameters', label: 'Parameters', className: 'col-params' },
  { key: 'priority', label: 'Pri', className: 'col-priority' },
  { key: 'status', label: 'Status', className: 'col-status' },
  { key: 'note', label: 'Note', className: 'col-note' }
]

export const HEADER_CATEGORIES = [...new Set(HEADER_SEED_DATA.map(r => r.category))]
export const HEADER_ACTIONS = [...new Set(HEADER_SEED_DATA.map(r => r.action))]
export const HEADER_CONTEXTS = [...new Set(HEADER_SEED_DATA.map(r => r.in))]
export const HEADER_STATUSES = ['Mapped', 'Needs Values', 'Dev in Progress', 'Done', 'On Hold', 'Rejected']
