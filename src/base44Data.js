import { base44 } from './api/base44Client'

const Heuristic = base44.entities.Heuristic
const HeaderHeuristic = base44.entities.HeaderHeuristic

let _connected = null

export function isConnected() {
  return _connected === true
}

export async function initConnection() {
  if (_connected !== null) return _connected
  try {
    await Heuristic.list('-created_at', 1)
    _connected = true
  } catch {
    _connected = false
  }
  return _connected
}

export async function fetchHeuristics() {
  const records = await Heuristic.list('rule_id')
  return records
}

export async function fetchHeaderHeuristics() {
  const records = await HeaderHeuristic.list('rule_id')
  return records
}

export async function insertHeuristic(data, isHeader = false) {
  const Entity = isHeader ? HeaderHeuristic : Heuristic
  const { id, created_at, updated_at, ...clean } = data
  return Entity.create(clean)
}

export async function updateHeuristic(id, updates, isHeader = false) {
  const Entity = isHeader ? HeaderHeuristic : Heuristic
  return Entity.update(id, updates)
}

export async function deleteHeuristic(id, isHeader = false) {
  const Entity = isHeader ? HeaderHeuristic : Heuristic
  return Entity.delete(id)
}

export async function seedHeuristics(rows) {
  for (const row of rows) {
    const { id, created_at, updated_at, ...data } = row
    await Heuristic.create(data)
  }
}

export async function seedHeaderHeuristics(rows) {
  for (const row of rows) {
    const { id, created_at, updated_at, ...data } = row
    await HeaderHeuristic.create(data)
  }
}
