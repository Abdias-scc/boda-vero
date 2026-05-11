import { useState, useCallback } from 'react'
import { supabase, BUCKET } from '../lib/supabase'

/**
 * Genera un nombre único para cada archivo evitando colisiones.
 */
function uniqueName(file) {
  const ext    = file.name.split('.').pop()
  const ts     = Date.now()
  const rand   = Math.random().toString(36).slice(2, 8)
  return `${ts}_${rand}.${ext}`
}

/**
 * Hook de subida de imágenes a Supabase Storage.
 * Expone: uploadFiles, uploading, progress, results, reset
 */
export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState([])   // array of { name, status, url }
  const [results,   setResults]   = useState([])

  const uploadFiles = useCallback(async (files, onComplete) => {
    if (!files?.length) return
    setUploading(true)

    const fileArray = Array.from(files)
    const initial   = fileArray.map(f => ({ name: f.name, status: 'pending', url: null }))
    setProgress(initial)

    const uploaded = []

    for (let i = 0; i < fileArray.length; i++) {
      const file     = fileArray[i]
      const safeName = uniqueName(file)

      setProgress(prev =>
        prev.map((p, idx) => idx === i ? { ...p, status: 'uploading' } : p)
      )

      try {
        const { error: upErr } = await supabase
          .storage
          .from(BUCKET)
          .upload(safeName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'image/jpeg',
          })

        if (upErr) throw upErr

        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(safeName)

        setProgress(prev =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: 'done', url: urlData.publicUrl } : p
          )
        )
        uploaded.push({ name: safeName, url: urlData.publicUrl })
      } catch (err) {
        console.error(`Error subiendo ${file.name}:`, err)
        setProgress(prev =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: 'error' } : p
          )
        )
      }
    }

    setResults(uploaded)
    setUploading(false)
    if (onComplete) onComplete(uploaded)
  }, [])

  const reset = useCallback(() => {
    setProgress([])
    setResults([])
    setUploading(false)
  }, [])

  return { uploadFiles, uploading, progress, results, reset }
}
