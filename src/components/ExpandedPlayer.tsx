import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Song } from '../types/song';
import { usePlayer } from '../context/PlayerContext';
import { songsByArtist } from '../data/songs';
import { formatTime } from '../utils/formatTime';
import {
  CloseIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  ShuffleIcon,
} from './icons';
import styles from './ExpandedPlayer.module.css';

interface ExpandedPlayerProps {
  onClose: () => void;
  onGoToArtist: (artist: string) => void;
}

type TabId = 'siguientes' | 'relacionados' | 'letra';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'siguientes', label: 'Siguientes' },
  { id: 'relacionados', label: 'Relacionados' },
  { id: 'letra', label: 'Letra' },
];

export default function ExpandedPlayer({ onClose, onGoToArtist }: ExpandedPlayerProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    randomMode,
    queue,
    queueIndex,
    togglePlay,
    toggleRandomMode,
    next,
    prev,
    seek,
    playSong,
  } = usePlayer();
  const [tab, setTab] = useState<TabId>('siguientes');

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const upcoming = queue.slice(queueIndex + 1);
  const related =
    songsByArtist[currentSong.artist]?.filter((song) => song.id !== currentSong.id) ?? [];

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    seek((event.clientX - rect.left) / rect.width);
  };

  const playFromList = (song: Song, list: Song[]) => playSong(song, list);

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Reproductor expandido"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <span className={styles.heading}>
            Reproductor <span className={styles.badge}>Beta</span>
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Minimizar reproductor"
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className={styles.coverWrap}>
          <img
            className={styles.cover}
            src={currentSong.coverUrl}
            alt={`Portada de ${currentSong.title}`}
            referrerPolicy="no-referrer"
          />
        </div>

        <div className={styles.meta}>
          <h2 className={styles.title}>{currentSong.title}</h2>
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
            <ShuffleIcon size={16} />
          </button>
          <button type="button" className={styles.iconBtn} onClick={prev} aria-label="Anterior">
            <PrevIcon size={22} />
          </button>
          <button
            type="button"
            className={styles.playBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
          <button type="button" className={styles.iconBtn} onClick={next} aria-label="Siguiente">
            <NextIcon size={22} />
          </button>
          <span className={styles.ghost} aria-hidden="true" />
        </div>

        <nav className={styles.tabs} aria-label="Secciones del reproductor">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.tab} ${tab === item.id ? styles.tabActive : ''}`}
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          {tab === 'siguientes' &&
            (upcoming.length > 0 ? (
              <ul className={styles.songList}>
                {upcoming.map((song, index) => (
                  <li key={song.id}>
                    <button
                      type="button"
                      className={styles.songRow}
                      onClick={() => playFromList(song, queue)}
                    >
                      <span className={styles.songIndex}>{queueIndex + index + 2}</span>
                      <img
                        className={styles.songCover}
                        src={song.coverUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <span className={styles.songMeta}>
                        <span className={styles.songTitle}>{song.title}</span>
                        <span className={styles.songArtist}>{song.artist}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No hay más canciones en la cola.</p>
            ))}

          {tab === 'relacionados' &&
            (related.length > 0 ? (
              <ul className={styles.songList}>
                {related.map((song) => (
                  <li key={song.id}>
                    <button
                      type="button"
                      className={styles.songRow}
                      onClick={() => playFromList(song, related)}
                    >
                      <img
                        className={styles.songCover}
                        src={song.coverUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <span className={styles.songMeta}>
                        <span className={styles.songTitle}>{song.title}</span>
                        <span className={styles.songArtist}>{song.artist}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No hay canciones relacionadas.</p>
            ))}

          {tab === 'letra' && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Letra próximamente</p>
              <p>La letra de esta canción aún no está disponible en la versión beta.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
