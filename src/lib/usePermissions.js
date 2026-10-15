import { base44 } from '@/api/base44Client'
import { useState, useEffect } from 'react'

/**
 * Returns permission level for the current user:
 *   'admin'    — signed-in admin → full edit/add access
 *   'viewer'   — everyone else → read-only (no login required)
 */
export function usePermissions() {
  const [permission, setPermission] = useState('viewer')
  const [user, setUser] = useState(null)

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u)
        if (u.role === 'admin') setPermission('admin')
      })
      .catch(() => {})
  }, [])

  return { permission, user }
}