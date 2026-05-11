import { createClient } from '@supabase/supabase-js'

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️  Faltan variables de entorno de Supabase.\n' +
    'Copia .env.example → .env.local y rellena tus credenciales.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'wedding-photos'
