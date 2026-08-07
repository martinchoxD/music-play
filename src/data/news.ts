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
