import { useCallback, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { artists, songsByArtist } from '../data/songs';
import {
  ChevronUpIcon,
  CloseIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  ShuffleIcon,
} from './icons';
import { formatTime } from '../utils/formatTime';
import styles from './PlayerBar.module.css';

interface PlayerBarProps {
  onGoToArtist: (artist: string) => void;
  onExpand: () => void;
  embedded?: boolean;
}

export default function PlayerBar({ onGoToArtist, onExpand, embedded = false }: PlayerBarProps) {
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
    playSong,
  } = usePlayer();

  const switchArtist = useCallback(
    (direction: 1 | -1) => {
      if (!currentSong) return;
      const currentIndex = artists.indexOf(currentSong.artist);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + artists.length) % artists.length;
      const nextArtist = artists[nextIndex];
      const list = songsByArtist[nextArtist];
      if (list && list.length > 0) {
        playSong(list[0], list);
      }
    },
    [currentSong, playSong],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const typing =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable;
      if (typing || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
        return;
      }

      if (tag === 'BUTTON' || tag === 'A' || target?.getAttribute('role') === 'button') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          prev();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'ArrowUp':
          switchArtist(-1);
          break;
        case 'ArrowDown':
          switchArtist(1);
          break;
        case 'e':
        case 'E':
          onExpand();
          break;
        case 'c':
        case 'C':
          closePlayer();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePlay, next, prev, closePlayer, onExpand, switchArtist]);

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    seek((event.clientX - rect.left) / rect.width);
  };

  return (
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
        onClick={onExpand}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onExpand();
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
          onClick={onExpand}
          aria-label="Expandir reproductor"
        >
          <ChevronUpIcon size={16} />
        </button>
      </div>
    </section>
  );
}
