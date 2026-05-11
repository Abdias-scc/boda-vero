import { useState, useRef, useCallback } from 'react'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import UploadModal from './components/UploadModal'
import FloatingUploadButton from './components/FloatingUploadButton'
import ConfigBanner from './components/ConfigBanner'
import { usePhotos } from './hooks/usePhotos'

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const galleryRef = useRef(null)

  const { photos, loading, error, refresh } = usePhotos()

  /* Scroll hacia la galería cuando se hace click en el hero CTA */
  const handleUploadClick = useCallback(() => {
    setUploadOpen(true)
  }, [])

  /* Cuando termina la subida, refrescar galería y hacer scroll */
  const handleUploaded = useCallback(() => {
    refresh()
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 500)
  }, [refresh])

  return (
    <div className="min-h-screen bg-cream-50 selection:bg-gold-300/40">
      {/* Dev helper */}
      <ConfigBanner />

      {/* Hero */}
      <Hero onUploadClick={handleUploadClick} />

      {/* Gallery */}
      <div ref={galleryRef}>
        <Gallery
          photos={photos}
          loading={loading}
          error={error}
          onRefresh={refresh}
        />
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-cream-400/50 py-8 px-6 text-center">
        <p className="font-serif text-sm italic">
          Con amor, guardados para siempre ✦
        </p>
      </footer>

      {/* Floating action button */}
      <FloatingUploadButton onClick={handleUploadClick} />

      {/* Upload modal / bottom sheet */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
    </div>
  )
}
