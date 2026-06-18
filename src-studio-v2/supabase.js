import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasUrl = typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')
const hasKey = typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 20

if (!hasUrl || !hasKey) {
  console.warn(
    '[Supabase] Missing or invalid VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — local-only mode. Copy .env.example to .env and add your project URL and anon key.'
  )
}

export const supabase = hasUrl && hasKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isConnected = () => !!supabase
