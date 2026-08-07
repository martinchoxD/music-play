export type NewsTag = 'update' | 'dev' | 'info';

export interface NewsItem {
  id: string;
  tag: NewsTag;
  title: string;
  description: string;
  publishedAt: Date;
}

const at = (day: number, month: number, year: number, hours: number, minutes: number) =>
  new Date(year, month - 1, day, hours, minutes, 0);

export const newsItems: NewsItem[] = [
  {
    id: 'reproductor-expandido-beta',
    tag: 'dev',
    title: 'Desarrollo interno: reproductor expandido en Beta',
    description:
      'Estamos probando una nueva versión del reproductor que se puede agrandar tocando la portada o el botón de expandir. En modo expandido vas a poder ver las canciones siguientes de la cola, las relacionadas del mismo artista y, en el futuro, la letra de cada canción. Por ahora está en fase beta: el panel se desliza desde la derecha en PC y ocupa la pantalla en Android, y seguimos puliendo los detalles antes de lanzarlo oficialmente.',
    publishedAt: at(7, 8, 2026, 15, 45),
  },
  {
    id: 'actualizacion-reproductor-artistas',
    tag: 'update',
    title: 'Nuevo reproductor y mejoras en perfiles de artistas',
    description:
      'El reproductor ahora vive integrado en la barra lateral, con la portada en su formato original y los controles de siempre. Además, en los perfiles de artista en Android las canciones se muestran en filas compactas con desplazamiento horizontal, para recorrer el catálogo sin tanto scroll.',
    publishedAt: at(7, 8, 2026, 13, 50),
  },
  {
    id: 'playlists-personales',
    tag: 'update',
    title: '¡Playlists personales ya disponibles!',
    description:
      'Ahora cada usuario puede crear sus propias playlists directamente en la aplicación. Podés agregar y quitar canciones del catálogo, renombrarlas y eliminarlas. Todo se guarda automáticamente en tu navegador (localStorage), así que cada persona arma y conserva su propia colección.',
    publishedAt: at(6, 8, 2026, 14, 30),
  },
  {
    id: 'artistas-disponible',
    tag: 'update',
    title: '¡Función de Artistas ya disponible!',
    description:
      'Hemos añadido oficialmente el entorno del catálogo y los perfiles de los artistas al ecosistema de la aplicación. Ahora puedes explorar sus canciones populares y acceder rápidamente a sus perfiles completos interactuando directamente con la interfaz.',
    publishedAt: at(24, 5, 2026, 18, 0),
  },
  {
    id: 'refactorizacion',
    tag: 'dev',
    title: 'Refactorización y vistas modulares',
    description:
      'Se ha completado el diseño estructural de las secciones de "Playlists" y perfiles detallados de "Artistas". Estamos refinando las bases de datos para garantizar una navegación fluida y una organización óptima del contenido.',
    publishedAt: at(22, 5, 2026, 22, 20),
  },
  {
    id: 'estado-catalogo',
    tag: 'info',
    title: 'Estado del catálogo y control de calidad',
    description:
      'Con el fin de garantizar una experiencia de usuario estable y libre de errores (bugs), se ha determinado congelar temporalmente la incorporación de nuevos artistas y pistas musicales. La prioridad absoluta actual es el despliegue técnico del código base y la optimización del reproductor antes de expandir nuestro repertorio.',
    publishedAt: at(22, 5, 2026, 22, 20),
  },
];
