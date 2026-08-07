import ArtistSection from './ArtistSection';
import { artists, songsByArtist } from '../data/songs';
import styles from './HomeView.module.css';

interface HomeViewProps {
  onGoToArtist: (artist: string) => void;
}

export default function HomeView({ onGoToArtist }: HomeViewProps) {
  return (
    <>
      <h2 className={styles.title}>Tus canciones y artistas</h2>

      {artists.map((artist) => (
        <ArtistSection
          key={artist}
          artist={artist}
          songs={songsByArtist[artist]}
          onGoToArtist={onGoToArtist}
        />
      ))}
    </>
  );
}
