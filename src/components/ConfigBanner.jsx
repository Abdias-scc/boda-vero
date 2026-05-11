/**
 * Banner que aparece cuando faltan las variables de entorno de Supabase.
 * Solo visible en desarrollo / pre-configuración.
 */
export default function ConfigBanner() {
  const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) return null

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-start gap-3">
        <span className="text-amber-500 text-lg flex-shrink-0">⚙️</span>
        <div>
          <p className="font-sans text-sm font-medium text-amber-800">
            Configuración pendiente
          </p>
          <p className="font-sans text-xs text-amber-700 mt-0.5 leading-relaxed">
            Copia <code className="bg-amber-100 px-1 rounded">.env.example</code> →{' '}
            <code className="bg-amber-100 px-1 rounded">.env.local</code> y agrega
            tus credenciales de Supabase para activar la galería y la subida de fotos.
          </p>
        </div>
      </div>
    </div>
  )
}
