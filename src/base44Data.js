let base44Client = null
let Heuristic = null
let HeaderHeuristic = null
let _connected = false

export function isConnected() {
  return _connected
}

export async function initConnection() {
  if (_connected) return true
  try {
    const { base44 } = await import('./api/base44Client')
    base44Client = base44
    Heuristic = base44.entities.Heuristic
    HeaderHeuristic = base44.entities.HeaderHeuristic
    await Heuristic.list('-created_at', 1)
    _connected = true
    return true
  } catch (err) {
    console.warn('[Base44] Connection failed, running in local mode:', err?.message || err)
    _connected = false
    return false
  }
}

export async function fetchHeuristics() {
  if (!_connected) throw new Error('Not connected')
  return Heuristic.list('rule_id')
}

export async function fetchHeaderHeuristics() {
  if (!_connected) throw new Error('Not connected')
  return HeaderHeuristic.list('rule_id')
}

export async function insertHeuristic(data, isHeader = false) {
  if (!_connected) throw new Error('Not connected')
  const Entity = isHeader ? HeaderHeuristic : Heuristic
  const { id, created_at, updated_at, ...clean } = data
  return Entity.create(clean)
}

export async function updateHeuristic(id, updates, isHeader = false) {
  if (!_connected) throw new Error('Not connected')
  const Entity = isHeader ? HeaderHeuristic : Heuristic
  return Entity.update(id, updates)
}

export async function deleteHeuristic(id, isHeader = false) {
  if (!_connected) throw new Error('Not connected')
  const Entity = isHeader ? HeaderHeuristic : Heuristic
  return Entity.delete(id)
}

export async function seedHeuristics(rows) {
  if (!_connected) throw new Error('Not connected')
  for (const row of rows) {
    const { id, created_at, updated_at, ...data } = row
    await Heuristic.create(data)
  }
}

export async function seedHeaderHeuristics(rows) {
  if (!_connected) throw new Error('Not connected')
  for (const row of rows) {
    const { id, created_at, updated_at, ...data } = row
    await HeaderHeuristic.create(data)
  }
}

async function deleteAll(Entity) {
  let items = await Entity.list('rule_id')
  while (items.length > 0) {
    for (const item of items) {
      await Entity.delete(item.id)
    }
    items = await Entity.list('rule_id')
  }
}

export async function migrateSupabaseToBase44(mainRows, headerRows, onProgress) {
  if (!_connected) throw new Error('Not connected')

  const total = mainRows.length + headerRows.length
  let done = 0

  onProgress?.({ phase: 'clearing', done: 0, total })
  await deleteAll(Heuristic)
  await deleteAll(HeaderHeuristic)

  onProgress?.({ phase: 'seeding', done: 0, total })
  for (const row of mainRows) {
    const { id, created_at, updated_at, ...data } = row
    await Heuristic.create(data)
    done++
    onProgress?.({ phase: 'seeding', done, total })
  }

  for (const row of headerRows) {
    const { id, created_at, updated_at, ...data } = row
    await HeaderHeuristic.create(data)
    done++
    onProgress?.({ phase: 'seeding', done, total })
  }

  onProgress?.({ phase: 'done', done: total, total })
  return { main: mainRows.length, header: headerRows.length }
}
