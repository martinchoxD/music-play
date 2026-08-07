import ArtistSection from './ArtistSection';
import { artists, songsByArtist } from '../data/songs';
import styles from './HomeView.module.css';

interface HomeViewProps {
  query: string;
  onGoToArtist: (artist: string) => void;
}

export default function HomeView({ query, onGoToArtist }: HomeViewProps) {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = artists
    .map((artist) => ({
      artist,
      songs: songsByArtist[artist].filter(
        (song) =>
          song.title.toLowerCase().includes(normalizedQuery) ||
          song.artist.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((section) => section.songs.length > 0);

  return (
    <>
      <h2 className={styles.title}>Tus canciones y artistas</h2>

      {filteredSections.length > 0 ? (
        filteredSections.map((section) => (
          <ArtistSection
            key={section.artist}
            artist={section.artist}
            songs={section.songs}
            onGoToArtist={onGoToArtist}
          />
        ))
      ) : (
        <p className={styles.empty}>No se encontraron resultados para “{query}”.</p>
      )}
    </>
  );
}
