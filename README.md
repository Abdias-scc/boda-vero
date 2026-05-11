# 💍 Álbum Colaborativo de Boda

Aplicación web mobile-first para que los invitados compartan fotos en tiempo real, sin login ni cuentas.

---

## ✨ Características

- 📱 **Mobile First** — Diseñado para teléfonos, perfecto en iPhone y Android
- 📷 **Subida múltiple** — Selecciona varias fotos a la vez desde el carrete
- 🖼 **Galería Masonry** — Grid tipo Pinterest con lazy loading y skeleton
- 🔍 **Lightbox fullscreen** — Navega y descarga fotos con un toque
- ⚡ **Sin backend** — 100% frontend + Supabase Storage
- 🔒 **Sin login** — Los invitados entran directo por QR

---

## 🛠 Stack

| Capa         | Tecnología               |
|--------------|--------------------------|
| Frontend     | React 18 + Vite          |
| Estilos      | TailwindCSS 3            |
| Almacenamiento | Supabase Storage        |
| Hosting      | Vercel                   |
| Animaciones  | Framer Motion / CSS      |

---

## 🚀 Configuración paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/wedding-album.git
cd wedding-album
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → New project
2. Guarda la **URL** y la **anon key** (Settings → API)

### 3. Crear el bucket de Storage

En el dashboard de Supabase:

1. Ve a **Storage** → **New bucket**
2. Nombre: `wedding-photos`
3. Marca **Public bucket** ✅
4. Guarda

### 4. Configurar políticas RLS del bucket

En **Storage → Policies**, agrega estas dos políticas para el bucket `wedding-photos`:

**Política SELECT (leer fotos):**
```sql
-- Nombre: Allow public read
-- Operación: SELECT
-- Target roles: public (anon)
(bucket_id = 'wedding-photos')
```

**Política INSERT (subir fotos):**
```sql
-- Nombre: Allow public upload
-- Operación: INSERT
-- Target roles: public (anon)
(bucket_id = 'wedding-photos')
```

> ℹ️ Puedes hacerlo desde el dashboard visual de Supabase → Storage → Policies → New Policy → Custom policy.

### 5. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_SUPABASE_BUCKET=wedding-photos
```

### 6. Ejecutar en local

```bash
npm run dev
# → http://localhost:5173
```

---

## 📦 Deploy en Vercel

### Opción A: desde el dashboard

1. Sube el proyecto a GitHub
2. En [vercel.com](https://vercel.com) → New Project → importa el repo
3. En **Environment Variables** agrega las 3 variables de `.env.local`
4. Deploy ✅

### Opción B: desde CLI

```bash
npm i -g vercel
vercel
# Sigue el wizard, agrega las env vars cuando te las pida
```

---

## 📲 Generar el QR

Una vez desplegado, toma la URL de Vercel (ej. `https://tu-boda.vercel.app`) y genera un QR:

- [qr-code-generator.com](https://www.qr-code-generator.com)
- [qrcode-monkey.com](https://www.qrcode-monkey.com)
- O desde cualquier app de QR

Imprime el QR en las mesas, programas o pantallas del evento.

---

## 🗂 Estructura del proyecto

```
wedding-album/
├── src/
│   ├── components/
│   │   ├── Hero.jsx              # Sección principal con CTA
│   │   ├── Gallery.jsx           # Galería masonry
│   │   ├── PhotoCard.jsx         # Tarjeta individual + skeleton
│   │   ├── Lightbox.jsx          # Modal fullscreen + descarga
│   │   ├── UploadModal.jsx       # Bottom sheet de subida
│   │   ├── FloatingUploadButton.jsx  # FAB flotante
│   │   └── ConfigBanner.jsx      # Helper de configuración
│   ├── hooks/
│   │   ├── usePhotos.js          # Listar fotos de Supabase
│   │   └── useUpload.js          # Subir fotos a Supabase
│   ├── lib/
│   │   └── supabase.js           # Cliente Supabase
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

---

## 🎨 Personalización

### Cambiar los textos

Edita `src/components/Hero.jsx`:
- `"Nuestros Recuerdos"` → nombre del evento
- `"Álbum Colaborativo · 2025"` → fecha real
- Subtexto de bienvenida

### Cambiar colores

En `tailwind.config.js`, sección `colors`:
- `cream` → tonos del fondo
- `gold` → acentos dorados
- `stone` → textos oscuros

### Cambiar tipografías

En `index.html` y `tailwind.config.js`, ajusta los links de Google Fonts y la config `fontFamily`.

---

## 🔒 Seguridad

Esta app es pública por diseño (álbum de boda). Si necesitas restricciones:

- **Limitar tamaño de archivos**: configura en Supabase Storage → bucket settings → File size limit
- **Restringir tipos de archivo**: en `useUpload.js` y el `input[accept]` del modal
- **Desactivar subida después del evento**: en Supabase, cambia la política INSERT a `false`

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| No carga fotos | Verifica que el bucket sea público y las policies de SELECT estén activas |
| No puede subir | Verifica la policy de INSERT para `anon` |
| Variables no detectadas | Reinicia `npm run dev` tras editar `.env.local` |
| Error CORS | En Supabase → Settings → API → CORS, agrega tu dominio de Vercel |

---

Hecho con ❤️ para un día especial.
