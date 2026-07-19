import { base44 } from '@/api/base44Client'
import { useState, useEffect } from 'react'

/**
 * Returns permission level for the current user:
 *   'admin'    — role === 'admin' → full edit/add access
 *   'viewer'   — email ends with @wix.com → read-only
 *   'denied'   — everyone else
 *   null       — still loading
 */
export function usePermissions() {
  const [permission, setPermission] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u)
        if (u.role === 'admin') {
          setPermission('admin')
        } else if (u.email && u.email.toLowerCase().endsWith('@wix.com')) {
          setPermission('viewer')
        } else {
          setPermission('denied')
        }
      })
      .catch(() => {
        setPermission('denied')
      })
  }, [])

  return { permission, user }
}