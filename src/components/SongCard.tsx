import { usePlayer } from '../context/PlayerContext';
import EqualizerBars from './EqualizerBars';
import type { Song } from '../types/song';
import styles from './SongCard.module.css';

interface SongCardProps {
  song: Song;
  sectionSongs: Song[];
}

export default function SongCard({ song, sectionSongs }: SongCardProps) {
  const { currentSong, isPlaying, playSong } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  return (
    <button
      type="button"
      className={`${styles.card} ${isCurrent ? styles.playing : ''}`}
      onClick={() => playSong(song, sectionSongs)}
      aria-pressed={isCurrent}
      title={`Reproducir ${song.title}`}
    >
      <div className={styles.coverWrap}>
        <img
          className={styles.cover}
          src={song.coverUrl}
          alt={`Portada de ${song.title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {isCurrentPlaying && <EqualizerBars className={styles.bars} />}
      </div>
      <p className={styles.title}>{song.title}</p>
      <small className={styles.artist}>{song.artist}</small>
    </button>
  );
}
