import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { supabase, isConnected } from './supabase'
import { SEED_DATA, COLUMNS, CATEGORIES, ACTIONS, CONTEXTS, STATUSES, PRIORITIES } from './seedData'
import { HEADER_SEED_DATA, HEADER_COLUMNS } from './headerSeedData'
import Toast from './components/Toast'
import ConfirmModal from './components/ConfirmModal'
import EditableCell from './components/EditableCell'
import DiagramsView from './components/DiagramsView'
import Simulator from './components/Simulator'
import AddRuleWizard from './components/AddRuleWizard'

const TABLE_NAME = 'heuristics'
const HEADER_TABLE_NAME = 'header_heuristics'

const DB_TO_APP = {
  element_type: 'when',
  condition: 'if',
  output_operation: 'action',
  sub_type: 'parameters',
  final_label: 'summary',
  priority_note: 'note'
}
const APP_TO_DB = Object.fromEntries(Object.entries(DB_TO_APP).map(([k, v]) => [v, k]))

const ACTION_REMAP = {
  'Item Size': 'Set Size',
  'Item Resize': 'Set Size',
  'Container Item Resize': 'Set Size',
  'Show Element': 'Set Visibility',
  'Hide Element': 'Set Visibility',
  'Set ODC': 'Set OOG',
  'Item Rotation': 'Set Rotation',
  'Item Margin': 'Set Margin',
  'Item Padding': 'Set Padding',
  'Item Alignment': 'Set Alignment',
  'Item Font Size': 'Set Font Size',
  'Item Spacing': 'Set Spacing',
  'Item Min Height': 'Set Min Height',
  'Pin Item': 'Set Pinned'
}

const WHEN_REMAP = {
  'Any Element (Exception: Vertical Line)': 'Any Element',
  'System Container / Box': 'System Container',
  'Text Box': 'Text',
  'Hamburger Menu / Shape': 'Hamburger Menu | Shape',
  'Social Bar Container': 'Social Bar'
}

const PARAMS_REMAP = {
  'Rotation Value: 0': 'Value: 0',
  'Set ODC': 'Set OOG'
}

function transformFromDb(row) {
  const out = {}
  for (const [k, v] of Object.entries(row)) {
    out[DB_TO_APP[k] || k] = v
  }

  const origAction = out.action
  if (origAction && ACTION_REMAP[origAction]) out.action = ACTION_REMAP[origAction]
  if (origAction === 'Show Element') out.parameters = 'Value: Show'
  if (origAction === 'Hide Element') out.parameters = 'Value: Hide'

  if (out.when && WHEN_REMAP[out.when]) out.when = WHEN_REMAP[out.when]
  if (out.parameters && PARAMS_REMAP[out.parameters]) out.parameters = PARAMS_REMAP[out.parameters]

  if (out.action && out.parameters && out.parameters !== '—') {
    out.summary = `${out.action} | ${out.parameters}`
  } else if (out.action) {
    out.summary = out.action
  }

  if (!out.in) out.in = 'Any Parent'
  if (!out.priority) out.priority = 1

  return out
}

function transformToDb(updates) {
  const out = {}
  for (const [k, v] of Object.entries(updates)) {
    out[APP_TO_DB[k] || k] = v
  }
  return out
}

function App() {
  const [activeTab, setActiveTab] = useState('main')
  const [rows, setRows] = useState([])
  const [headerRows, setHeaderRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterContext, setFilterContext] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [headerSearch, setHeaderSearch] = useState('')
  const [headerFilterCategory, setHeaderFilterCategory] = useState('')
  const [headerFilterAction, setHeaderFilterAction] = useState('')
  const [headerFilterStatus, setHeaderFilterStatus] = useState('')
  const [sortKey, setSortKey] = useState('rule_id')
  const [sortDir, setSortDir] = useState('asc')
  const [headerSortKey, setHeaderSortKey] = useState('rule_id')
  const [headerSortDir, setHeaderSortDir] = useState('asc')
  const [editingCell, setEditingCell] = useState(null)
  const [showAddWizard, setShowAddWizard] = useState(false)
  const [toasts, setToasts] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [pendingChanges, setPendingChanges] = useState(new Map())
  const saveTimerRef = useRef(null)

  function emptyRow() {
    return {
      rule_id: 0,
      category: '',
      when: '',
      in: 'Any Parent',
      if: '',
      action: '',
      parameters: '',
      summary: '',
      priority: 1,
      status: 'Mapped',
      note: ''
    }
  }

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    if (isConnected()) {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('rule_id')
      if (error) {
        toast(`DB error: ${error.message}`, 'error')
        setRows(SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
      } else if (data.length === 0) {
        const seeded = SEED_DATA.map((r, i) => ({ ...r, id: i + 1 }))
        setRows(seeded)
        await seedDatabase(seeded)
      } else {
        setRows(data.map(transformFromDb))
      }

      const { data: hData, error: hError } = await supabase.from(HEADER_TABLE_NAME).select('*').order('rule_id')
      if (!hError && hData) {
        setHeaderRows(hData.length > 0 ? hData.map(transformFromDb) : HEADER_SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
      } else {
        setHeaderRows(HEADER_SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
      }
    } else {
      setRows(SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
      setHeaderRows(HEADER_SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
      toast('Running in local mode — no Supabase connected', 'info')
    }
    setLoading(false)
  }

  async function seedDatabase(data) {
    if (!isConnected()) return
    const toInsert = data.map(({ id, ...rest }) => transformToDb(rest))
    const { error } = await supabase.from(TABLE_NAME).insert(toInsert)
    if (error) {
      toast(`Seed failed: ${error.message}`, 'error')
    } else {
      toast('Database seeded with heuristics')
      loadData()
    }
  }

  async function handleCellSave(rowId, key, value, isHeader = false) {
    const setter = isHeader ? setHeaderRows : setRows
    setter(prev => prev.map(r => r.id === rowId ? { ...r, [key]: value } : r))
    setEditingCell(null)

    if (isConnected()) {
      const tableName = isHeader ? HEADER_TABLE_NAME : TABLE_NAME
      setPendingChanges(prev => {
        const next = new Map(prev)
        const existing = next.get(`${tableName}:${rowId}`) || { tableName, rowId, updates: {} }
        existing.updates[key] = value
        next.set(`${tableName}:${rowId}`, existing)
        return next
      })
      debouncedSave()
    }
  }

  function debouncedSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(flushChanges, 800)
  }

  async function flushChanges() {
    if (!isConnected()) return
    const changes = new Map(pendingChanges)
    if (changes.size === 0) return

    setPendingChanges(new Map())
    let errorCount = 0

    for (const [, { tableName, rowId, updates }] of changes) {
      const dbUpdates = transformToDb(updates)
      const { error } = await supabase.from(tableName).update(dbUpdates).eq('id', rowId)
      if (error) errorCount++
    }

    if (errorCount > 0) {
      toast(`${errorCount} update(s) failed`, 'error')
    } else {
      toast(`Saved ${changes.size} change(s)`)
    }
  }

  async function handleWizardSave(rowsPayload) {
    const tableName = activeTab === 'header' ? HEADER_TABLE_NAME : TABLE_NAME
    const setter = activeTab === 'header' ? setHeaderRows : setRows
    const targetRows = activeTab === 'header' ? headerRows : rows
    let nextRuleId = Math.max(0, ...targetRows.map(r => r.rule_id))

    for (const payload of rowsPayload) {
      nextRuleId += 1
      const row = { ...emptyRow(), ...payload, rule_id: nextRuleId }

      if (isConnected()) {
        const dbRow = transformToDb(row)
        const { data, error } = await supabase.from(tableName).insert([dbRow]).select()
        if (error) {
          toast('Failed to save — try again', 'error')
          throw new Error(error.message)
        }
        setter(prev => [...prev, transformFromDb(data[0])])
      } else {
        setter(prev => [...prev, { ...row, id: Date.now() + Math.floor(Math.random() * 1000) }])
      }
    }

    toast(rowsPayload.length > 1 ? `Saved ${rowsPayload.length} rules` : 'Rule saved')
  }

  async function handleDeleteRow(row) {
    const tableName = activeTab === 'header' ? HEADER_TABLE_NAME : TABLE_NAME
    if (isConnected()) {
      const { error } = await supabase.from(tableName).delete().eq('id', row.id)
      if (error) {
        toast(`Delete failed: ${error.message}`, 'error')
        return
      }
    }
    const setter = activeTab === 'header' ? setHeaderRows : setRows
    setter(prev => prev.filter(r => r.id !== row.id))
    setConfirmDelete(null)
    toast('Row deleted')
  }

  async function handleDuplicateRow(row) {
    const targetRows = activeTab === 'header' ? headerRows : rows
    const nextId = Math.max(...targetRows.map(r => r.rule_id), 0) + 1
    const { id, ...rest } = row
    const dup = { ...rest, rule_id: nextId }
    const tableName = activeTab === 'header' ? HEADER_TABLE_NAME : TABLE_NAME

    if (isConnected()) {
      const dbDup = transformToDb(dup)
      const { data, error } = await supabase.from(tableName).insert([dbDup]).select()
      if (error) {
        toast(`Duplicate failed: ${error.message}`, 'error')
        return
      }
      const setter = activeTab === 'header' ? setHeaderRows : setRows
      setter(prev => [...prev, transformFromDb(data[0])])
    } else {
      const setter = activeTab === 'header' ? setHeaderRows : setRows
      setter(prev => [...prev, { ...dup, id: Date.now() }])
    }
    toast('Row duplicated')
  }

  function handleSort(key) {
    if (activeTab === 'header') {
      if (headerSortKey === key) {
        setHeaderSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
      } else {
        setHeaderSortKey(key)
        setHeaderSortDir('asc')
      }
    } else {
      if (sortKey === key) {
        setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    }
  }

  const filteredRows = useMemo(() => {
    let result = [...rows]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      )
    }
    if (filterCategory) result = result.filter(r => r.category === filterCategory)
    if (filterAction) result = result.filter(r => r.action === filterAction)
    if (filterContext) result = result.filter(r => r.in === filterContext)
    if (filterPriority) result = result.filter(r => r.priority === Number(filterPriority))
    if (filterStatus) result = result.filter(r => r.status === filterStatus)

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal))
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [rows, search, filterCategory, filterAction, filterContext, filterPriority, filterStatus, sortKey, sortDir])

  const filteredHeaderRows = useMemo(() => {
    let result = [...headerRows]
    if (headerSearch) {
      const q = headerSearch.toLowerCase()
      result = result.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(q))
      )
    }
    if (headerFilterCategory) result = result.filter(r => r.category === headerFilterCategory)
    if (headerFilterAction) result = result.filter(r => r.action === headerFilterAction)
    if (headerFilterStatus) result = result.filter(r => r.status === headerFilterStatus)

    result.sort((a, b) => {
      const aVal = a[headerSortKey] ?? ''
      const bVal = b[headerSortKey] ?? ''
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal))
      return headerSortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [headerRows, headerSearch, headerFilterCategory, headerFilterAction, headerFilterStatus, headerSortKey, headerSortDir])

  const mappedCount = rows.filter(r => r.status === 'Mapped').length
  const needsCount = rows.filter(r => r.status === 'Needs Values').length
  const headerCategories = [...new Set(headerRows.map(r => r.category))]
  const headerActions = [...new Set(headerRows.map(r => r.action))]

  const currentColumns = activeTab === 'header' ? HEADER_COLUMNS : COLUMNS
  const editableColumns = currentColumns.filter(c => c.key !== 'rule_id')
  const currentFiltered = activeTab === 'header' ? filteredHeaderRows : filteredRows
  const currentSortKey = activeTab === 'header' ? headerSortKey : sortKey
  const currentSortDir = activeTab === 'header' ? headerSortDir : sortDir

  function renderTable() {
    if (loading) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">...</div>
          <h3>Loading heuristics</h3>
        </div>
      )
    }

    if (currentFiltered.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">&#x2205;</div>
          <h3>No rules match your filters</h3>
          <p>Try adjusting search or filter criteria</p>
        </div>
      )
    }

    return (
      <table className="table">
        <thead>
          <tr>
            {currentColumns.map(col => (
              <th
                key={col.key}
                className={`${col.className} ${currentSortKey === col.key ? 'sorted' : ''}`}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                <span className="sort-arrow">
                  {currentSortKey === col.key ? (currentSortDir === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
            ))}
            <th className="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          {currentFiltered.map(row => (
            <tr key={row.id} className={confirmDelete?.id === row.id ? 'deleting' : ''}>
              <td><div className="cell cell-id">{row.rule_id}</div></td>
              {editableColumns.map(col => (
                <td key={col.key}>
                  <EditableCell
                    value={row[col.key] ?? ''}
                    columnKey={col.key}
                    rowAction={row.action}
                    isEditing={editingCell?.rowId === row.id && editingCell?.key === col.key}
                    onStartEdit={() => setEditingCell({ rowId: row.id, key: col.key })}
                    onSave={val => handleCellSave(row.id, col.key, val, activeTab === 'header')}
                    onCancel={() => setEditingCell(null)}
                  />
                </td>
              ))}
              <td>
                <div className="row-actions">
                  <button className="btn-icon" onClick={() => handleDuplicateRow(row)} title="Duplicate">&#x2398;</button>
                  <button className="btn-icon danger" onClick={() => setConfirmDelete(row)} title="Delete">&#x2715;</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo">S2</div>
          <div>
            <div className="app-title">Studio 2.0 — Mobile Heuristics</div>
            <div className="app-subtitle">Desktop → Mobile transformation rules</div>
          </div>
        </div>
        <div className="app-header-center">
          <button className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`} onClick={() => setActiveTab('main')}>Table</button>
          <button className={`tab-btn ${activeTab === 'header' ? 'active' : ''}`} onClick={() => setActiveTab('header')}>Header</button>
          <button className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`} onClick={() => setActiveTab('simulator')}>Simulator</button>
          <button className={`tab-btn ${activeTab === 'diagrams' ? 'active' : ''}`} onClick={() => setActiveTab('diagrams')}>Diagrams</button>
        </div>
        <div className="app-header-right">
          <div className="db-status">
            <span className={`db-status-dot ${isConnected() ? '' : 'offline'}`} />
            {isConnected() ? 'Supabase connected' : 'Local mode'}
          </div>
          {pendingChanges.size > 0 && <span className="unsaved-dot" title="Saving..." />}
        </div>
      </header>

      {activeTab === 'diagrams' ? (
        <DiagramsView />
      ) : activeTab === 'simulator' ? (
        <Simulator rows={rows} headerRows={headerRows} />
      ) : (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-wrap">
                <span className="search-icon">&#x2315;</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search all columns..."
                  value={activeTab === 'header' ? headerSearch : search}
                  onChange={e => activeTab === 'header' ? setHeaderSearch(e.target.value) : setSearch(e.target.value)}
                />
              </div>
              <select
                className="filter-select"
                value={activeTab === 'header' ? headerFilterCategory : filterCategory}
                onChange={e => activeTab === 'header' ? setHeaderFilterCategory(e.target.value) : setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {(activeTab === 'header' ? headerCategories : CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="filter-select"
                value={activeTab === 'header' ? headerFilterAction : filterAction}
                onChange={e => activeTab === 'header' ? setHeaderFilterAction(e.target.value) : setFilterAction(e.target.value)}
              >
                <option value="">All Actions</option>
                {(activeTab === 'header' ? headerActions : ACTIONS).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {activeTab === 'main' && (
                <>
                  <select className="filter-select" value={filterContext} onChange={e => setFilterContext(e.target.value)}>
                    <option value="">All Contexts</option>
                    {CONTEXTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                    <option value="">All Priorities</option>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </>
              )}
              <select
                className="filter-select"
                value={activeTab === 'header' ? headerFilterStatus : filterStatus}
                onChange={e => activeTab === 'header' ? setHeaderFilterStatus(e.target.value) : setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-ghost" onClick={loadData}>Refresh</button>
              <button type="button" className="btn btn-primary" onClick={() => setShowAddWizard(true)}>+ Add Rule</button>
            </div>
          </div>

          <div className="stats-bar">
            <span>{(activeTab === 'header' ? headerRows : rows).length} rules total</span>
            <span>{currentFiltered.length} shown</span>
            {activeTab === 'main' && (
              <>
                <span className="stat-pill mapped">{mappedCount} mapped</span>
                <span className="stat-pill needs-values">{needsCount} needs values</span>
              </>
            )}
          </div>

          <div className="table-container">
            {renderTable()}
          </div>
        </>
      )}

      <Toast toasts={toasts} />

      {confirmDelete && (
        <ConfirmModal
          title="Delete Rule"
          message={`Delete rule #${confirmDelete.rule_id} (${confirmDelete.when})? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => handleDeleteRow(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {(activeTab === 'main' || activeTab === 'header') && (
        <AddRuleWizard
          open={showAddWizard}
          onClose={() => setShowAddWizard(false)}
          onSave={handleWizardSave}
          existingRows={activeTab === 'header' ? headerRows : rows}
          prefillContext={activeTab === 'main' ? filterContext : ''}
        />
      )}
    </>
  )
}

export default App
