import SongCard from './SongCard';
import type { Song } from '../types/song';
import styles from './ArtistSection.module.css';

interface ArtistSectionProps {
  artist: string;
  songs: Song[];
}

export default function ArtistSection({ artist, songs }: ArtistSectionProps) {
  const sectionId = `artista-${artist.toLowerCase()}`;

  return (
    <section id={sectionId} className={styles.section} aria-label={`Canciones de ${artist}`}>
      <h3 className={styles.artistTitle}>{artist}</h3>
      <div className={styles.row}>
        {songs.map((song) => (
          <SongCard key={song.id} song={song} sectionSongs={songs} />
        ))}
      </div>
    </section>
  );
}
