import { useState } from 'react'

/**
 * Tarjeta individual de foto con lazy loading,
 * skeleton mientras carga y transición suave.
 */
export default function PhotoCard({ photo, onClick }) {
  const [loaded,  setLoaded]  = useState(false)
  const [error,   setError]   = useState(false)

  return (
    <div
      className="
        group relative w-full cursor-pointer
        rounded-2xl overflow-hidden bg-cream-200
        shadow-sm hover:shadow-xl hover:shadow-stone-900/10
        transition-all duration-400 ease-out
        hover:-translate-y-0.5
        break-inside-avoid mb-3
      "
      onClick={() => !error && onClick(photo)}
    >
      {/* Skeleton */}
      {!loaded && !error && (
        <div
          className="absolute inset-0 bg-shimmer-gradient animate-shimmer"
          style={{ backgroundSize: '800px 100%' }}
        />
      )}

      {/* Imagen */}
      {!error ? (
        <img
          src={photo.url}
          alt="Foto de boda"
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`
            w-full h-auto block
            transition-all duration-500
            group-hover:scale-[1.02]
            ${loaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
      ) : (
        <div className="flex items-center justify-center aspect-square text-stone-300">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      )}

      {/* Hover overlay con botón ver */}
      {loaded && !error && (
        <div className="
          absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          flex items-end justify-end p-3
        ">
          <div className="
            bg-white/90 backdrop-blur-sm rounded-full
            p-2 shadow-sm
            translate-y-2 group-hover:translate-y-0
            opacity-0 group-hover:opacity-100
            transition-all duration-300
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a3530" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Tarjeta skeleton para el estado de carga inicial.
 */
export function PhotoSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden break-inside-avoid mb-3">
      <div
        className="w-full bg-shimmer-gradient animate-shimmer"
        style={{
          backgroundSize: '800px 100%',
          height: `${Math.floor(Math.random() * 80 + 140)}px`,
        }}
      />
    </div>
  )
}
