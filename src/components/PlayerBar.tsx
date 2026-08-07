import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import EqualizerBars from './EqualizerBars';
import {
  ChevronDownIcon,
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
}

export default function PlayerBar({ onGoToArtist }: PlayerBarProps) {
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
    const ratio = (event.clientX - rect.left) / rect.width;
    seek(ratio);
  };

  const goToArtistFromPlayer = (artist: string) => {
    setExpanded(false);
    onGoToArtist(artist);
  };

  const handleClose = () => {
    setExpanded(false);
    closePlayer();
  };

  return (
    <>
      {/* Reproductor expandido (pantalla completa) */}
      <div
        className={`${styles.expanded} ${expanded ? styles.expandedOpen : ''}`}
        aria-hidden={!expanded}
      >
        <div
          className={styles.expandedBg}
          style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
        />

        <div className={styles.expandedTop}>
          <button
            type="button"
            className={styles.expandedAction}
            onClick={handleClose}
            aria-label="Cerrar reproductor"
          >
            <CloseIcon size={20} />
          </button>
          <span className={styles.expandedTopLabel}>Reproduciendo</span>
          <button
            type="button"
            className={styles.expandedAction}
            onClick={() => setExpanded(false)}
            aria-label="Minimizar reproductor"
          >
            <ChevronDownIcon size={22} />
          </button>
        </div>

        <div className={styles.expandedCoverWrap}>
          <img
            className={`${styles.expandedCover} ${isPlaying ? styles.expandedCoverPlaying : ''}`}
            src={currentSong.coverUrl}
            alt={`Portada de ${currentSong.title}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && <EqualizerBars className={styles.expandedCoverBars} />}
        </div>

        <div className={styles.expandedMeta}>
          <p className={styles.expandedTitle}>{currentSong.title}</p>
          <button
            type="button"
            className={styles.expandedArtist}
            onClick={() => goToArtistFromPlayer(currentSong.artist)}
          >
            {currentSong.artist}
          </button>
        </div>

        <div className={styles.expandedProgress}>
          <div
            className={styles.progress}
            onClick={handleSeek}
            role="progressbar"
            aria-label="Progreso de la canción"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className={styles.fill} style={{ width: `${progress}%` }}>
              <span className={styles.thumb} />
            </div>
          </div>
          <div className={styles.expandedTimes}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.expandedButtons}>
          <button
            type="button"
            className={`${styles.expandedIconBtn} ${randomMode ? styles.expandedIconActive : ''}`}
            onClick={toggleRandomMode}
            aria-label="Reproducción aleatoria"
            aria-pressed={randomMode}
          >
            <ShuffleIcon size={26} />
          </button>
          <button
            type="button"
            className={styles.expandedIconBtn}
            onClick={prev}
            aria-label="Anterior"
          >
            <PrevIcon size={30} />
          </button>
          <button
            type="button"
            className={styles.expandedPlay}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <PauseIcon size={34} /> : <PlayIcon size={34} />}
          </button>
          <button
            type="button"
            className={styles.expandedIconBtn}
            onClick={next}
            aria-label="Siguiente"
          >
            <NextIcon size={30} />
          </button>
          <span className={styles.expandedGhost} aria-hidden="true" />
        </div>
      </div>

      {/* Barra compacta */}
      <div className={styles.player}>
        <div
          className={styles.progressTop}
          onClick={handleSeek}
          role="progressbar"
          aria-label="Progreso de la canción"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.left}>
          <button
            type="button"
            className={styles.info}
            onClick={() => setExpanded(true)}
            aria-label="Expandir reproductor"
          >
            <span className={styles.coverWrap}>
              <img
                className={styles.cover}
                src={currentSong.coverUrl}
                alt={`Portada de ${currentSong.title}`}
                referrerPolicy="no-referrer"
              />
              {isPlaying && <EqualizerBars className={styles.coverBars} />}
            </span>
            <span className={styles.meta}>
              <span className={styles.title}>{currentSong.title}</span>
              <span className={styles.artist}>{currentSong.artist}</span>
            </span>
            <ChevronUpIcon size={18} className={styles.infoChevron} />
          </button>

          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            aria-label="Cerrar reproductor"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.iconBtn} ${randomMode ? styles.iconActive : ''}`}
              onClick={toggleRandomMode}
              aria-label="Reproducción aleatoria"
              aria-pressed={randomMode}
            >
              <ShuffleIcon size={18} />
            </button>
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
              <div className={styles.fill} style={{ width: `${progress}%` }}>
                <span className={styles.thumb} />
              </div>
            </div>
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
