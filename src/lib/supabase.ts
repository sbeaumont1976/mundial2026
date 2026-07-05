import { createClient } from '@supabase/supabase-js'

// Cliente Supabase de SOLO LECTURA para el frontend.
//
// Seguridad: la ANON KEY está pensada para publicarse en el cliente. Lo que
// protege tus datos NO es esconder la clave, sino Row Level Security (RLS):
//   1. Activa RLS en cada tabla (teams, matches).
//   2. Crea una única policy de SELECT pública, sin policies de INSERT/UPDATE/DELETE.
//   3. Tú editas los datos a mano desde el panel de Supabase (usa la service_role,
//      que NUNCA sale del servidor de Supabase ni aparece en este repo).
//
// Mientras no configures el .env.local, la app usa los datos mock automáticamente
// (ver src/hooks/useBracket.ts), así que puedes desarrollar sin Supabase.

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Todo el modelo vive en el schema `mundial2026` (no en `public`), así que lo
// fijamos como schema por defecto: `.from('teams')` apunta a `mundial2026.teams`.
// Recuerda exponer `mundial2026` en Settings → API → Exposed schemas.
export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      db: { schema: 'mundial2026' },
    })
  : null
