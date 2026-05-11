import { useState, useRef, useCallback } from 'react'
import { useUpload } from '../hooks/useUpload'

const MAX_SIZE_MB = 20

export default function UploadModal({ isOpen, onClose, onUploaded }) {
  const fileInputRef = useRef(null)
  const [previews,   setPreviews]   = useState([])
  const [dragOver,   setDragOver]   = useState(false)

  const { uploadFiles, uploading, progress, reset } = useUpload()

  /* ── Helpers ── */
  const isImage = f => f.type.startsWith('image/')
  const isBig   = f => f.size > MAX_SIZE_MB * 1024 * 1024

  const prepareFiles = useCallback((rawFiles) => {
    const valid = Array.from(rawFiles).filter(f => isImage(f) && !isBig(f))
    const previewUrls = valid.map(f => ({
      name: f.name,
      url:  URL.createObjectURL(f),
      size: (f.size / 1024 / 1024).toFixed(1),
    }))
    setPreviews(previewUrls)
    return valid
  }, [])

  /* ── File input change ── */
  const handleFileChange = (e) => {
    const files = prepareFiles(e.target.files)
    if (!files.length) return
    // Store for later upload
    fileInputRef.current._selectedFiles = files
  }

  /* ── Drag & Drop ── */
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const files = prepareFiles(e.dataTransfer.files)
    if (files.length && fileInputRef.current) {
      fileInputRef.current._selectedFiles = files
    }
  }, [prepareFiles])

  /* ── Upload ── */
  const handleUpload = () => {
    const files = fileInputRef.current?._selectedFiles
    if (!files?.length) return

    uploadFiles(files, (uploaded) => {
      if (uploaded.length > 0) {
        onUploaded?.()
        setTimeout(() => {
          handleClose()
        }, 1400)
      }
    })
  }

  /* ── Close + reset ── */
  const handleClose = () => {
    if (uploading) return
    previews.forEach(p => URL.revokeObjectURL(p.url))
    setPreviews([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current._selectedFiles = null
    }
    reset()
    onClose()
  }

  const allDone   = progress.length > 0 && progress.every(p => p.status === 'done')
  const hasErrors = progress.some(p => p.status === 'error')
  const hasFiles  = previews.length > 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Sheet / Modal */}
      <div className="
        relative z-10 w-full sm:max-w-md
        bg-cream-50 rounded-t-3xl sm:rounded-3xl
        shadow-2xl shadow-stone-900/20
        animate-fade-up
        max-h-[92svh] overflow-y-auto
        flex flex-col
      ">

        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-stone-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3">
          <div>
            <h2 className="font-display text-2xl text-stone-800">Compartir fotos</h2>
            <p className="font-serif text-sm text-stone-500 mt-0.5">Tus fotos quedarán para siempre</p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-cream-200 text-stone-600 hover:bg-cream-300 transition-colors disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-cream-200" />

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Drop zone */}
          {!uploading && !allDone && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center gap-3
                border-2 border-dashed rounded-2xl p-8 cursor-pointer
                transition-all duration-200
                ${dragOver
                  ? 'border-gold-400 bg-cream-100'
                  : 'border-cream-300 hover:border-gold-300 hover:bg-cream-50'
                }
              `}
            >
              {/* Camera icon */}
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center text-2xl
                transition-all duration-200
                ${dragOver ? 'bg-gold-300/30 scale-110' : 'bg-cream-200'}
              `}>
                📷
              </div>
              <div className="text-center">
                <p className="font-sans text-sm font-medium text-stone-700">
                  {dragOver ? 'Suelta aquí' : 'Toca para seleccionar fotos'}
                </p>
                <p className="font-sans text-xs text-stone-400 mt-1">
                  JPG, PNG, HEIC · Máx. {MAX_SIZE_MB} MB c/u
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture={false}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Previews */}
          {hasFiles && !uploading && !allDone && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-cream-200">
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-1.5">
                    <p className="text-white text-[9px] truncate">{p.size} MB</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress during upload */}
          {uploading && (
            <div className="flex flex-col gap-2.5 py-2">
              <p className="font-sans text-sm text-stone-600 text-center mb-1">
                Subiendo {progress.filter(p => p.status === 'done').length} de {progress.length}…
              </p>
              {progress.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <StatusIcon status={p.status} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-sans text-xs text-stone-600 truncate max-w-[160px]">{p.name}</p>
                      <p className="font-sans text-xs text-stone-400 capitalize">{statusLabel(p.status)}</p>
                    </div>
                    <div className="h-1 rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p.status === 'done'      ? 'w-full bg-green-400' :
                          p.status === 'uploading' ? 'w-3/4 bg-gold-400 animate-pulse' :
                          p.status === 'error'     ? 'w-full bg-red-400' :
                          'w-0 bg-cream-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Success state */}
          {allDone && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl animate-fade-up">
                🎉
              </div>
              <p className="font-display text-xl text-stone-800">¡Listo!</p>
              <p className="font-serif text-sm text-stone-500 text-center">
                {progress.filter(p => p.status === 'done').length} foto{progress.filter(p => p.status === 'done').length !== 1 ? 's' : ''} añadida{progress.filter(p => p.status === 'done').length !== 1 ? 's' : ''} al álbum.
              </p>
            </div>
          )}

          {/* Error note */}
          {hasErrors && !uploading && (
            <p className="font-sans text-xs text-red-500 text-center">
              Algunas fotos no pudieron subirse. Verifica tu conexión.
            </p>
          )}
        </div>

        {/* Footer CTA */}
        {!allDone && (
          <div className="px-6 pb-8 pt-2">
            <button
              onClick={hasFiles && !uploading ? handleUpload : () => fileInputRef.current?.click()}
              disabled={uploading}
              className={`
                w-full py-4 rounded-2xl font-sans text-sm tracking-widest uppercase
                transition-all duration-300 active:scale-[0.98]
                ${uploading
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : hasFiles
                  ? 'bg-stone-800 text-cream-50 hover:bg-stone-750 shadow-lg shadow-stone-900/15'
                  : 'bg-cream-200 text-stone-600 hover:bg-cream-300'
                }
              `}
            >
              {uploading
                ? '✦ Subiendo…'
                : hasFiles
                ? `✦ Subir ${previews.length} foto${previews.length !== 1 ? 's' : ''}`
                : '✦ Seleccionar fotos'
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ── */
function StatusIcon({ status }) {
  if (status === 'done')      return <span className="text-green-500 text-base">✓</span>
  if (status === 'error')     return <span className="text-red-500 text-base">✕</span>
  if (status === 'uploading') return <span className="text-gold-500 text-base animate-spin inline-block">◌</span>
  return <span className="text-stone-300 text-base">○</span>
}

function statusLabel(s) {
  return { pending: 'En espera', uploading: 'Subiendo', done: 'Listo', error: 'Error' }[s] ?? s
}
