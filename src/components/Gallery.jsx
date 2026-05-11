import { useState, useMemo } from 'react'
import PhotoCard, { PhotoSkeleton } from './PhotoCard'
import Lightbox from './Lightbox'

const COLUMNS_MOBILE  = 2
const COLUMNS_DESKTOP = 3
const SKELETON_COUNT  = 8

/**
 * Galería Masonry real: distribuye las fotos en columnas
 * de manera uniforme sin depender de librerías externas.
 */
function MasonryGrid({ photos, onPhotoClick }) {
  const [cols] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 640
      ? COLUMNS_DESKTOP
      : COLUMNS_MOBILE
  )

  const columns = useMemo(() => {
    const result = Array.from({ length: cols }, () => [])
    photos.forEach((photo, i) => result[i % cols].push(photo))
    return result
  }, [photos, cols])

  return (
    <div className={`grid gap-3 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col">
          {col.map(photo => (
            <PhotoCard key={photo.id} photo={photo} onClick={onPhotoClick} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Gallery({ photos, loading, error, onRefresh }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  /* ── Empty / Error / Loading ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 px-6">
        <div className="text-4xl">⚠️</div>
        <p className="font-serif text-stone-500 text-center">{error}</p>
        <button
          onClick={onRefresh}
          className="font-sans text-sm tracking-widest uppercase bg-stone-800 text-cream-50 px-6 py-3 rounded-full hover:bg-stone-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <section id="gallery" className="w-full bg-cream-100 min-h-screen">

      {/* Section header */}
      <div className="max-w-2xl mx-auto px-4 pt-14 pb-8 text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-cream-500 mb-3">
          Recuerdos compartidos
        </p>
        <h2 className="font-display text-[clamp(1.8rem,6vw,2.8rem)] text-stone-800">
          El álbum de Nuestra Boda
        </h2>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-cream-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          <div className="h-px w-12 bg-cream-400" />
        </div>
        {!loading && photos.length > 0 && (
          <p className="mt-4 font-serif text-sm text-stone-400">
            {photos.length} momento{photos.length !== 1 ? 's' : ''} capturado{photos.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-2xl mx-auto px-3 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PhotoSkeleton key={i} />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <EmptyState />
        ) : (
          <MasonryGrid photos={photos} onPhotoClick={setSelectedPhoto} />
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
        />
      )}
    </section>
  )
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="
        w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center
        text-3xl animate-float
      ">
        🌸
      </div>
      <div className="text-center">
        <p className="font-display text-xl text-stone-700">Aún no hay fotos</p>
        <p className="font-serif text-sm text-stone-400 mt-2">
          ¡Sé el primero en compartir un recuerdo!
        </p>
      </div>
    </div>
  )
}
