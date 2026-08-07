import SongCard from './SongCard';
import type { Song } from '../types/song';
import styles from './ArtistSection.module.css';

interface ArtistSectionProps {
  artist: string;
  songs: Song[];
  onGoToArtist: (artist: string) => void;
}

export default function ArtistSection({ artist, songs, onGoToArtist }: ArtistSectionProps) {
  const sectionId = `artista-${artist.toLowerCase()}`;

  return (
    <section id={sectionId} className={styles.section} aria-label={`Canciones de ${artist}`}>
      <button
        type="button"
        className={styles.artistTitle}
        onClick={() => onGoToArtist(artist)}
      >
        {artist}
      </button>
      <div className={styles.row}>
        {songs.map((song) => (
          <SongCard key={song.id} song={song} sectionSongs={songs} />
        ))}
      </div>
    </section>
  );
}
