let base44Client = null
let Heuristic = null
let HeaderHeuristic = null
let _connected = false
let _connectionError = null

export function isConnected() {
  return _connected
}

export function getConnectionError() {
  return _connectionError
}

export async function initConnection() {
  if (_connected) return true
  _connectionError = null
  try {
    const mod = await import('./api/base44Client')
    base44Client = mod.base44
    Heuristic = base44Client.entities.Heuristic
    HeaderHeuristic = base44Client.entities.HeaderHeuristic

    if (!Heuristic || !HeaderHeuristic) {
      throw new Error('Heuristic or HeaderHeuristic entity not found in Base44 app. Make sure the entities are defined in base44/entities/.')
    }

    try {
      await Heuristic.list('-created_at', 1)
    } catch (listErr) {
      console.warn('[Base44] Entity list test failed (entities may be empty):', listErr?.message)
    }

    _connected = true
    return true
  } catch (err) {
    const msg = err?.message || String(err)
    console.warn('[Base44] Connection failed:', msg)
    _connectionError = msg
    _connected = false
    return false
  }
}

export async function fetchHeuristics() {
  if (!_connected) throw new Error('Not connected')
  try {
    return await Heuristic.list('rule_id')
  } catch (err) {
    console.warn('[Base44] fetchHeuristics failed:', err?.message)
    return []
  }
}

export async function fetchHeaderHeuristics() {
  if (!_connected) throw new Error('Not connected')
  try {
    return await HeaderHeuristic.list('rule_id')
  } catch (err) {
    console.warn('[Base44] fetchHeaderHeuristics failed:', err?.message)
    return []
  }
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
  try {
    let items = await Entity.list('rule_id')
    while (items.length > 0) {
      for (const item of items) {
        await Entity.delete(item.id)
      }
      items = await Entity.list('rule_id')
    }
  } catch (err) {
    console.warn('[Base44] deleteAll — may be empty already:', err?.message)
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
