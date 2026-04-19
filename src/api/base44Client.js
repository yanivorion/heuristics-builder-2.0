import { createClient } from '@base44/sdk'

export const base44 = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID || '69e443859428256538e445b7',
})
