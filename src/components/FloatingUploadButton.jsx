/**
 * Botón flotante de subida (FAB) visible en toda la app.
 */
export default function FloatingUploadButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Subir fotos"
      className="
        fixed bottom-7 right-5 z-40
        flex items-center gap-2.5
        bg-stone-800 text-cream-50
        px-5 py-3.5 rounded-full
        shadow-2xl shadow-stone-900/30
        hover:bg-stone-700 active:scale-95
        transition-all duration-200
        font-sans text-sm tracking-wide
        group
      "
    >
      {/* Camera icon */}
      <svg
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="flex-shrink-0"
      >
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      <span>Subir foto</span>
    </button>
  )
}
