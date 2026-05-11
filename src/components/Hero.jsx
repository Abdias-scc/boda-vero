import { useRef } from 'react'

/**
 * Hero minimalista de boda con animación de entrada escalonada.
 * El botón CTA hace scroll suave hacia la sección de galería/subida.
 */
export default function Hero({ onUploadClick }) {
  return (
    <section className="relative min-h-[92svh] flex flex-col items-center justify-center overflow-hidden bg-cream-50 px-6 pt-16 pb-10">

      {/* Fondo decorativo sutil */}
      <DecorativeBackground />

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">

        {/* Ornamento superior */}
        <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <OrnamentDivider />
        </div>

        {/* Año / etiqueta */}
        <p
          className="mt-6 font-sans text-xs tracking-[0.3em] uppercase text-cream-500 animate-fade-up opacity-0"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          Nuestra Boda · 2026
        </p>

        {/* Título principal */}
        <h1
          className="mt-4 font-display text-[clamp(2.6rem,10vw,4.5rem)] leading-[1.1] text-stone-800 animate-fade-up opacity-0"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          Rafael y<br />
          <em className="italic text-gold-500">Verónica</em>
        </h1>

        {/* Línea decorativa */}
        <div
          className="mt-6 w-14 h-px bg-gold-400 animate-fade-up opacity-0"
          style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
        />

        {/* Subtexto */}
        <p
          className="mt-6 font-serif text-[1.1rem] leading-relaxed text-stone-600 font-light max-w-xs animate-fade-up opacity-0"
          style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
        >
          Comparte tus fotos y revive cada momento especial de este día único.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-xs animate-fade-up opacity-0"
          style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
        >
          <button
            onClick={onUploadClick}
            className="
              flex-1 group relative overflow-hidden
              bg-stone-800 text-cream-50 font-sans text-sm tracking-widest uppercase
              py-4 px-6 rounded-full
              transition-all duration-300
              hover:bg-stone-750 active:scale-95
              shadow-lg shadow-stone-900/10
            "
          >
            <span className="relative z-10">✦ Subir fotos</span>
            <span className="absolute inset-0 bg-gradient-to-r from-stone-700 to-stone-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <a
            href="#gallery"
            className="
              flex-1 font-sans text-sm tracking-widest uppercase
              py-4 px-6 rounded-full border border-stone-300 text-stone-700
              text-center transition-all duration-300
              hover:border-stone-500 hover:bg-cream-100 active:scale-95
            "
          >
            Ver galería
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float opacity-60"
      >
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke="#a09585" strokeWidth="1.5"/>
          <circle cx="10" cy="10" r="3" fill="#a09585">
            <animate attributeName="cy" values="10;18;10" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
    </section>
  )
}

/* ── Ornamento SVG ── */
function OrnamentDivider() {
  return (
    <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="12" x2="48" y2="12" stroke="#c9a07a" strokeWidth="0.75"/>
      <circle cx="60" cy="12" r="4" fill="none" stroke="#c9a07a" strokeWidth="1"/>
      <circle cx="60" cy="12" r="1.5" fill="#c9a07a"/>
      <circle cx="52" cy="12" r="1.5" fill="#c9a07a"/>
      <circle cx="68" cy="12" r="1.5" fill="#c9a07a"/>
      <line x1="72" y1="12" x2="120" y2="12" stroke="#c9a07a" strokeWidth="0.75"/>
    </svg>
  )
}

/* ── Fondo decorativo ── */
function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Gradiente radial sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#f5ede0_0%,transparent_70%)]" />

      {/* Círculos decorativos difusos */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-cream-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-cream-300/30 blur-3xl" />

      {/* Patrón de puntos muy sutil */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#3a3530"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
    </div>
  )
}
