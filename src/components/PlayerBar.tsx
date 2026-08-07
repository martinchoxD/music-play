import { usePlayer } from '../context/PlayerContext';
import { CloseIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from './icons';
import { formatTime } from '../utils/formatTime';
import styles from './PlayerBar.module.css';

interface PlayerBarProps {
  onGoToArtist: (artist: string) => void;
}

export default function PlayerBar({ onGoToArtist }: PlayerBarProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    seek,
    closePlayer,
  } = usePlayer();

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seek(ratio);
  };

  return (
    <div className={styles.player}>
      <div className={styles.info}>
        <img
          className={styles.cover}
          src={currentSong.coverUrl}
          alt={`Portada de ${currentSong.title}`}
          referrerPolicy="no-referrer"
        />
        <div className={styles.meta}>
          <p className={styles.title}>{currentSong.title}</p>
          <button
            type="button"
            className={styles.artistBtn}
            onClick={() => onGoToArtist(currentSong.artist)}
            title={`Ver perfil de ${currentSong.artist}`}
          >
            {currentSong.artist}
          </button>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={closePlayer}
          aria-label="Cerrar reproductor"
        >
          <CloseIcon />
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button type="button" className={styles.iconBtn} onClick={prev} aria-label="Anterior">
            <PrevIcon />
          </button>
          <button
            type="button"
            className={styles.playBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className={styles.iconBtn} onClick={next} aria-label="Siguiente">
            <NextIcon />
          </button>
        </div>

        <div className={styles.progressRow}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <div
            className={styles.progress}
            onClick={handleSeek}
            role="progressbar"
            aria-label="Progreso de la canción"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
