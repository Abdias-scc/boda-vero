import { useEffect, useCallback } from 'react'

/**
 * Lightbox fullscreen con descarga y navegación prev/next.
 */
export default function Lightbox({ photo, photos, onClose, onNavigate }) {
  const currentIdx = photos.findIndex(p => p.id === photo?.id)

  const goPrev = useCallback(() => {
    if (currentIdx > 0) onNavigate(photos[currentIdx - 1])
  }, [currentIdx, photos, onNavigate])

  const goNext = useCallback(() => {
    if (currentIdx < photos.length - 1) onNavigate(photos[currentIdx + 1])
  }, [currentIdx, photos, onNavigate])

  /* Keyboard navigation */
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   goPrev()
      if (e.key === 'ArrowRight')  goNext()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose, goPrev, goNext])

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleDownload = async () => {
    try {
      const resp = await fetch(photo.url)
      const blob = await resp.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = photo.name || 'foto-boda.jpg'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(photo.url, '_blank')
    }
  }

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-stone-900/95 animate-fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="
            flex items-center gap-2 text-cream-300/70 hover:text-cream-100
            font-sans text-sm transition-colors duration-200
          "
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          <span className="hidden sm:inline">Volver</span>
        </button>

        <p className="font-sans text-xs text-cream-400/50 tracking-widest">
          {currentIdx + 1} / {photos.length}
        </p>

        <button
          onClick={handleDownload}
          className="
            flex items-center gap-2 bg-white/10 hover:bg-white/20
            text-cream-100 font-sans text-sm px-4 py-2 rounded-full
            transition-all duration-200 active:scale-95
          "
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v10M7 15l5 5 5-5"/>
            <path d="M5 20h14"/>
          </svg>
          <span className="hidden sm:inline">Descargar</span>
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center relative min-h-0">

        {/* Prev */}
        {currentIdx > 0 && (
          <button
            onClick={e => { e.stopPropagation(); goPrev() }}
            className="
              absolute left-3 z-10
              w-11 h-11 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center text-cream-100
              transition-all duration-200 active:scale-90
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Photo */}
        <div className="max-h-full max-w-full px-14 py-4 flex items-center" onClick={e => e.stopPropagation()}>
          <img
            key={photo.id}
            src={photo.url}
            alt="Foto de boda"
            className="
              max-h-[80svh] max-w-full object-contain
              rounded-xl shadow-2xl shadow-black/40
              animate-fade-in
            "
          />
        </div>

        {/* Next */}
        {currentIdx < photos.length - 1 && (
          <button
            onClick={e => { e.stopPropagation(); goNext() }}
            className="
              absolute right-3 z-10
              w-11 h-11 rounded-full bg-white/10 hover:bg-white/20
              flex items-center justify-center text-cream-100
              transition-all duration-200 active:scale-90
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Bottom swipe hint (mobile) */}
      <div className="flex justify-center py-4 gap-1.5 flex-shrink-0">
        {photos.slice(Math.max(0, currentIdx - 3), Math.min(photos.length, currentIdx + 4)).map((p, i) => (
          <button
            key={p.id}
            onClick={e => { e.stopPropagation(); onNavigate(p) }}
            className={`
              rounded-full transition-all duration-200
              ${p.id === photo.id
                ? 'w-4 h-1.5 bg-cream-100'
                : 'w-1.5 h-1.5 bg-cream-600/50 hover:bg-cream-400'
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}
