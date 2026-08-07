import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { ChevronDownIcon, ChevronUpIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from './icons';
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

  return (
    <>
      <div
        className={`${styles.expanded} ${expanded ? styles.expandedOpen : ''}`}
        aria-hidden={!expanded}
      >
        <div
          className={styles.expandedBg}
          style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
        />
        <button
          type="button"
          className={styles.expandedClose}
          onClick={() => setExpanded(false)}
          aria-label="Minimizar reproductor"
        >
          <ChevronDownIcon size={22} />
        </button>

        <img
          className={`${styles.expandedCover} ${isPlaying ? styles.expandedCoverPlaying : ''}`}
          src={currentSong.coverUrl}
          alt={`Portada de ${currentSong.title}`}
          referrerPolicy="no-referrer"
        />

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
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.expandedTimes}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.expandedButtons}>
          <button type="button" className={styles.expandedIconBtn} onClick={prev} aria-label="Anterior">
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
          <button type="button" className={styles.expandedIconBtn} onClick={next} aria-label="Siguiente">
            <NextIcon size={30} />
          </button>
        </div>
      </div>

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

        <button
          type="button"
          className={styles.info}
          onClick={() => setExpanded(true)}
          aria-label="Expandir reproductor"
        >
          <img
            className={styles.cover}
            src={currentSong.coverUrl}
            alt={`Portada de ${currentSong.title}`}
            referrerPolicy="no-referrer"
          />
          <div className={styles.meta}>
            <p className={styles.title}>{currentSong.title}</p>
            <p className={styles.artist}>{currentSong.artist}</p>
          </div>
          <ChevronUpIcon size={18} className={styles.infoChevron} />
        </button>

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
    </>
  );
}
