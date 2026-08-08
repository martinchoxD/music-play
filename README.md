# MusicPlay 🎧

Reproductor de música web inspirado en Spotify, construido con **React**, **TypeScript** y **Vite**. Listado de canciones por artista, búsqueda en tiempo real, cola de reproducción por sección, modo aleatorio y reproductor fijo en la parte inferior.

> 🔗 Demo en vivo: [https://music-play-mq.vercel.app/](https://music-play-mq.vercel.app/)

---

## ✨ Características

- **Reproducción continua por artista**: al elegir una canción, se encola la sección completa (siguiente/anterior/auto-siguiente).
- **Modo aleatorio**: reproduce canciones al azar de todo el catálogo desde la barra lateral.
- **Búsqueda con sugerencias**: dropdown con las canciones que coinciden (título o artista) sin alterar el catálogo; al elegir una se reproduce con su cola.
- **Navegación por vistas**: Inicio, Playlists, Noticias, Artistas y perfil de artista, gestionadas desde la barra lateral.
- **Playlists propias**: creá tus playlists, agregá/quitá canciones, renombrá y eliminá. Se guardan en el `localStorage` del navegador (cada usuario conserva las suyas).
- **Centro de novedades**: noticias del proyecto con etiquetas (update/dev/info) y fecha relativa ("hace Xd Xh").
- **Perfil de artista**: portada, oyentes, bio y tabla de canciones del artista con reproducción por sección.
- **Navegación por artistas**: accesos rápidos en la barra lateral con scroll suave y click al artista para abrir su perfil.
- **Media Session**: controles de reproducción desde el sistema (pantalla de bloqueo, auriculares).
- **Barra de progreso interactiva** con tiempos de la canción.
- **Reproductor expandible**: tocá la zona de la canción para abrirlo a pantalla completa con portada animada, progreso y controles; minimizalo con el chevron.
- **Diseño responsive**: sidebar tipo drawer con menú hamburguesa integrado al header en móviles (≤768px), tablas con scroll horizontal y reproductor adaptado (progreso superior, controles grandes).
- **Accesibilidad**: elementos con `aria-label`, `aria-pressed` y navegación por teclado en botones.
- **Indicador visual** de la canción en reproducción (barras ecualizadoras animadas).

## 🛠️ Stack

| Tecnología | Uso |
| --- | --- |
| [React 19](https://react.dev/) | Librería de UI |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Vite 6](https://vite.dev/) | Bundler y dev server |
| [CSS Modules](https://github.com/css-modules/css-modules) | Estilos por componente, responsive |

## 📁 Estructura del proyecto

```
music/
├── public/
│   └── favicon.svg          # Ícono del sitio
├── src/
│   ├── components/          # Sidebar, PlayerBar, SongCard, HomeView, PlaylistsView, etc.
│   │   └── *.module.css     # Estilos por componente (responsive)
│   ├── context/
│   │   └── PlayerContext.tsx  # Estado global del reproductor
│   ├── data/
│   │   ├── songs.ts         # Catálogo de canciones
│   │   ├── artists.ts       # Info de artistas (bio, oyentes, portada)
│   │   └── news.ts          # Noticias del proyecto
│   ├── hooks/
│   │   ├── useAudioPlayer.ts  # Lógica de reproducción (cola, random, seek, Media Session)
│   │   └── useLocalStorage.ts # Persistencia en localStorage (playlists)
│   ├── types/
│   │   ├── song.ts          # Tipos del dominio
│   │   ├── playlist.ts      # Tipo Playlist (id, nombre, canciones)
│   │   └── view.ts          # Vistas de la app (inicio, playlists, noticias, artistas, detalle)
│   ├── utils/
│   │   ├── formatTime.ts
│   │   └── newsTime.ts      # Fechas relativas y formateo de noticias
│   ├── App.tsx              # Navegación entre vistas
│   ├── config.ts            # URL base del audio
│   └── main.tsx
├── index.html
└── package.json
```

## 🚀 Puesta en marcha

Requisito: **Node.js 18+**.

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Previsualizar el build
npm run preview

# Verificación de tipos
npm run typecheck
```

## 🔊 Configuración del audio

Las canciones quedan **fuera del repositorio** por peso y derechos de autor. Tenés dos opciones:

**Opción A — archivos locales (solo desarrollo):**

1. Creá la carpeta `public/audio/`.
2. Copiá allí los archivos `.mp3` (con los nombres indicados en `src/data/songs.ts`).
3. Listo. `src/config.ts` ya apunta a `/audio`.

**Opción B — Cloudinary (recomendado para producción):**

1. Creá una cuenta gratuita en [cloudinary.com](https://cloudinary.com).
2. Subí los `.mp3` con el script `uploadFiles.js`. Definí primero las variables de entorno (nunca se comitean):

```bash
# Windows (PowerShell)
$env:CLOUDINARY_CLOUD_NAME = "tu_cloud_name"
$env:CLOUDINARY_API_KEY = "tu_api_key"
$env:CLOUDINARY_API_SECRET = "tu_api_secret"
node uploadFiles.js
```

3. El script sube cada archivo con `public_id` = nombre y carpeta `mis_audios`. La app ya apunta a tu cuenta en `src/config.ts`:

```ts
export const audioBaseUrl = 'https://res.cloudinary.com/<TU_CLOUD_NAME>/video/upload/mis_audios';
```

> Las URLs de entrega son públicas y no requieren credenciales en la app.
> **Importante:** Cloudinary puede guardar algunos `.mp3` como contenedor `.mp4`; en `src/data/songs.ts` la extensión de `audioFile` debe coincidir (p. ej. `dramaturgy.mp4`).
> La carpeta `public/audio/` está en `.gitignore`, así que nunca se sube a GitHub.

## ▲ Deploy en Vercel

1. Subí el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importá el repo.
3. Vercel detecta **Vite** automáticamente (framework preset: *Vite*). No hace falta configuración.
4. Deploy. En *Settings → Domains* podés asignarle un dominio personalizado.

> Recordá configurar el audio (opción B) para que la demo funcione en producción.

## 📲 Instalación como app (PWA)

MusicPlay es una **Progressive Web App**: se puede instalar en el escritorio o en el teléfono y abrirse en su propia ventana, sin la barra del navegador.

- **Windows/Chrome/Edge**: al visitar el sitio, en la barra lateral aparece el botón **"📲 Descargar app"** (o el ícono de instalación en la barra de direcciones). Se crea un acceso directo en el escritorio y un tile en el menú Inicio.
- **Android**: en Chrome → menú → *Instalar aplicación*.
- **iOS (Safari)**: botón *Compartir* → *Agregar a pantalla de inicio*.
- **Funciona offline**: el service worker cachea la app (los audios se siguen sirviendo desde Cloudinary cuando hay conexión).

El manifest, los iconos y el service worker se generan automáticamente en el build (`vite-plugin-pwa`). Los iconos viven en `public/icons/`.

## 📝 Notas

- Las carátulas se cargan desde las URL provistas originalmente; se pueden cambiar fácilmente en `src/data/songs.ts`.
- Las canciones pertenecen a sus respectivos autores (Eve, natori, Ado, YOASOBI). Este proyecto es con fines de portafolio.

## 📄 Licencia

Código: MIT. Audio y carátulas: propiedad de sus autores.
