import { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePlayer } from '../context/PlayerContext';
import {
  ChevronUpIcon,
  CloseIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  ShuffleIcon,
} from './icons';
import ExpandedPlayer from './ExpandedPlayer';
import { formatTime } from '../utils/formatTime';
import styles from './PlayerBar.module.css';

interface PlayerBarProps {
  onGoToArtist: (artist: string) => void;
  embedded?: boolean;
}

export default function PlayerBar({ onGoToArtist, embedded = false }: PlayerBarProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    randomMode,
    togglePlay,
    toggleRandomMode,
    next,
    prev,
    seek,
    closePlayer,
  } = usePlayer();
  const [expanded, setExpanded] = useState(false);

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    seek((event.clientX - rect.left) / rect.width);
  };

  return (
    <>
      <section
        className={`${styles.player} ${embedded ? styles.embedded : ''}`}
        aria-label="Reproductor"
      >
      <button
        type="button"
        className={styles.close}
        onClick={closePlayer}
        aria-label="Cerrar reproductor"
      >
        <CloseIcon size={12} />
      </button>

      <img
        className={styles.cover}
        src={currentSong.coverUrl}
        alt={`Portada de ${currentSong.title}`}
        referrerPolicy="no-referrer"
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setExpanded(true);
          }
        }}
        aria-label="Expandir reproductor"
      />

      <div className={styles.meta}>
        <p className={styles.title}>{currentSong.title}</p>
        <button
          type="button"
          className={styles.artist}
          onClick={() => onGoToArtist(currentSong.artist)}
        >
          {currentSong.artist}
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

      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.iconBtn} ${randomMode ? styles.iconActive : ''}`}
          onClick={toggleRandomMode}
          aria-label="Reproducción aleatoria"
          aria-pressed={randomMode}
        >
          <ShuffleIcon size={15} />
        </button>
        <button type="button" className={styles.iconBtn} onClick={prev} aria-label="Anterior">
          <PrevIcon size={18} />
        </button>
        <button
          type="button"
          className={styles.playBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        </button>
        <button type="button" className={styles.iconBtn} onClick={next} aria-label="Siguiente">
          <NextIcon size={18} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setExpanded(true)}
          aria-label="Expandir reproductor"
        >
          <ChevronUpIcon size={16} />
        </button>
      </div>
      </section>

      {expanded &&
        createPortal(
          <ExpandedPlayer
            onClose={() => setExpanded(false)}
            onGoToArtist={onGoToArtist}
          />,
          document.body,
        )}
    </>
  );
}
