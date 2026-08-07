import { artists, songsByArtist } from '../data/songs';
import { artistsInfo } from '../data/artists';
import styles from './ArtistsView.module.css';

interface ArtistsViewProps {
  onGoToArtist: (artist: string) => void;
}

export default function ArtistsView({ onGoToArtist }: ArtistsViewProps) {
  return (
    <div>
      <h2 className={styles.title}>Artistas Registrados</h2>
      <div className={styles.grid}>
        {artists.map((artist) => {
          const info = artistsInfo[artist];
          if (!info) return null;
          return (
            <div key={artist} className={styles.card}>
              <img
                className={styles.img}
                src={info.img}
                alt={artist}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <h3 className={styles.name}>{artist}</h3>
              <p className={styles.listeners}>
                {info.listeners} · {songsByArtist[artist].length} canciones
              </p>
              <button
                type="button"
                className={styles.btn}
                onClick={() => onGoToArtist(artist)}
              >
                Más aquí
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
