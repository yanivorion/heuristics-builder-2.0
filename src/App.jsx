import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  isConnected, initConnection,
  fetchHeuristics, fetchHeaderHeuristics,
  insertHeuristic, updateHeuristic, deleteHeuristic,
  seedHeuristics, seedHeaderHeuristics
} from './base44Data'
import { SEED_DATA, COLUMNS, CATEGORIES, ACTIONS, CONTEXTS, STATUSES, PRIORITIES } from './seedData'
import { HEADER_SEED_DATA, HEADER_COLUMNS } from './headerSeedData'
import Toast from './components/Toast'
import ConfirmModal from './components/ConfirmModal'
import EditableCell from './components/EditableCell'
import DiagramsView from './components/DiagramsView'
import Simulator from './components/Simulator'
import AddRuleWizard from './components/AddRuleWizard'

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
    initConnection().then(() => loadData())
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      if (isConnected()) {
        const data = await fetchHeuristics()
        if (data.length === 0) {
          const seeded = SEED_DATA.map((r, i) => ({ ...r, id: i + 1 }))
          setRows(seeded)
          await seedHeuristics(seeded)
          toast('Database seeded with heuristics')
          const freshData = await fetchHeuristics()
          if (freshData.length > 0) setRows(freshData)
        } else {
          setRows(data)
        }

        const hData = await fetchHeaderHeuristics()
        if (hData.length === 0) {
          const seeded = HEADER_SEED_DATA.map((r, i) => ({ ...r, id: i + 1 }))
          setHeaderRows(seeded)
          await seedHeaderHeuristics(seeded)
          const freshH = await fetchHeaderHeuristics()
          if (freshH.length > 0) setHeaderRows(freshH)
        } else {
          setHeaderRows(hData)
        }
      } else {
        setRows(SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
        setHeaderRows(HEADER_SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
        toast('Running in local mode — Base44 not connected', 'info')
      }
    } catch (err) {
      toast(`Load error: ${err.message}`, 'error')
      setRows(SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
      setHeaderRows(HEADER_SEED_DATA.map((r, i) => ({ ...r, id: i + 1 })))
    }
    setLoading(false)
  }

  async function handleCellSave(rowId, key, value, isHeader = false) {
    const setter = isHeader ? setHeaderRows : setRows
    setter(prev => prev.map(r => r.id === rowId ? { ...r, [key]: value } : r))
    setEditingCell(null)

    if (isConnected()) {
      setPendingChanges(prev => {
        const next = new Map(prev)
        const tag = `${isHeader ? 'h' : 'm'}:${rowId}`
        const existing = next.get(tag) || { rowId, isHeader, updates: {} }
        existing.updates[key] = value
        next.set(tag, existing)
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

    for (const [, { rowId, isHeader, updates }] of changes) {
      try {
        await updateHeuristic(rowId, updates, isHeader)
      } catch {
        errorCount++
      }
    }

    if (errorCount > 0) {
      toast(`${errorCount} update(s) failed`, 'error')
    } else {
      toast(`Saved ${changes.size} change(s)`)
    }
  }

  async function handleWizardSave(rowsPayload) {
    const isHeader = activeTab === 'header'
    const setter = isHeader ? setHeaderRows : setRows
    const targetRows = isHeader ? headerRows : rows
    let nextRuleId = Math.max(0, ...targetRows.map(r => r.rule_id))

    for (const payload of rowsPayload) {
      nextRuleId += 1
      const row = { ...emptyRow(), ...payload, rule_id: nextRuleId }

      if (isConnected()) {
        try {
          const created = await insertHeuristic(row, isHeader)
          setter(prev => [...prev, created])
        } catch (err) {
          toast('Failed to save — try again', 'error')
          throw err
        }
      } else {
        setter(prev => [...prev, { ...row, id: Date.now() + Math.floor(Math.random() * 1000) }])
      }
    }

    toast(rowsPayload.length > 1 ? `Saved ${rowsPayload.length} rules` : 'Rule saved')
  }

  async function handleDeleteRow(row) {
    const isHeader = activeTab === 'header'
    if (isConnected()) {
      try {
        await deleteHeuristic(row.id, isHeader)
      } catch (err) {
        toast(`Delete failed: ${err.message}`, 'error')
        return
      }
    }
    const setter = isHeader ? setHeaderRows : setRows
    setter(prev => prev.filter(r => r.id !== row.id))
    setConfirmDelete(null)
    toast('Row deleted')
  }

  async function handleDuplicateRow(row) {
    const isHeader = activeTab === 'header'
    const targetRows = isHeader ? headerRows : rows
    const nextId = Math.max(...targetRows.map(r => r.rule_id), 0) + 1
    const { id, created_at, updated_at, ...rest } = row
    const dup = { ...rest, rule_id: nextId }

    if (isConnected()) {
      try {
        const created = await insertHeuristic(dup, isHeader)
        const setter = isHeader ? setHeaderRows : setRows
        setter(prev => [...prev, created])
      } catch (err) {
        toast(`Duplicate failed: ${err.message}`, 'error')
        return
      }
    } else {
      const setter = isHeader ? setHeaderRows : setRows
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
      <table className="table" key={`table-${activeTab}`}>
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
          {currentFiltered.map((row, idx) => (
            <tr key={row.id} className={confirmDelete?.id === row.id ? 'deleting' : ''} style={{ '--i': idx }}>
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
            {isConnected() ? 'Base44 connected' : 'Local mode'}
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
              <div className="search-wrap" style={{ '--i': 0 }}>
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
                style={{ '--i': 1 }}
                value={activeTab === 'header' ? headerFilterCategory : filterCategory}
                onChange={e => activeTab === 'header' ? setHeaderFilterCategory(e.target.value) : setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {(activeTab === 'header' ? headerCategories : CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="filter-select"
                style={{ '--i': 2 }}
                value={activeTab === 'header' ? headerFilterAction : filterAction}
                onChange={e => activeTab === 'header' ? setHeaderFilterAction(e.target.value) : setFilterAction(e.target.value)}
              >
                <option value="">All Actions</option>
                {(activeTab === 'header' ? headerActions : ACTIONS).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              {activeTab === 'main' && (
                <>
                  <select className="filter-select" style={{ '--i': 3 }} value={filterContext} onChange={e => setFilterContext(e.target.value)}>
                    <option value="">All Contexts</option>
                    {CONTEXTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="filter-select" style={{ '--i': 4 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                    <option value="">All Priorities</option>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </>
              )}
              <select
                className="filter-select"
                style={{ '--i': 5 }}
                value={activeTab === 'header' ? headerFilterStatus : filterStatus}
                onChange={e => activeTab === 'header' ? setHeaderFilterStatus(e.target.value) : setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="toolbar-right">
              <button className="btn btn-ghost" style={{ '--i': 0 }} onClick={loadData}>Refresh</button>
              <button type="button" className="btn btn-primary" style={{ '--i': 1 }} onClick={() => setShowAddWizard(true)}>+ Add Rule</button>
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
