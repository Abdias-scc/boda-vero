import { useState, useEffect, useCallback } from 'react'
import { supabase, BUCKET } from '../lib/supabase'

/**
 * Hook que gestiona la lista de fotos del bucket de Supabase.
 * Expone: photos, loading, error, refresh
 */
export function usePhotos() {
  const [photos,  setPhotos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: sbError } = await supabase
        .storage
        .from(BUCKET)
        .list('', {
          limit: 500,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (sbError) throw sbError

      const images = (data || [])
        .filter(f => /\.(jpe?g|png|webp|gif|heic|avif)$/i.test(f.name))
        .map(f => {
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(f.name)
          return {
            id:        f.id,
            name:      f.name,
            url:       urlData.publicUrl,
            createdAt: f.created_at,
          }
        })

      setPhotos(images)
    } catch (err) {
      console.error('Error cargando fotos:', err)
      setError('No se pudieron cargar las fotos. Verifica tu configuración de Supabase.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  return { photos, loading, error, refresh: fetchPhotos }
}
