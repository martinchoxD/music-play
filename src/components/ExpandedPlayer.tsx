import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Song } from '../types/song';
import { usePlayer } from '../context/PlayerContext';
import { songsByArtist } from '../data/songs';
import { useLyrics } from '../hooks/useLyrics';
import { useRomaji } from '../hooks/useRomaji';
import type { LyricLine } from '../data/lyrics';
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

interface LyricsViewProps {
  lines: LyricLine[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

function LyricsView({ lines, audioRef }: LyricsViewProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const lastIndexRef = useRef(-1);
  const activeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const audio = audioRef.current;
      const time = audio ? audio.currentTime : 0;
      let index = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].time <= time) {
          index = i;
        } else {
          break;
        }
      }
      if (index !== lastIndexRef.current) {
        lastIndexRef.current = index;
        setActiveIndex(index);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [lines, audioRef]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeIndex]);

  return (
    <div className={styles.lyrics}>
      {lines.map((line, index) => (
        <p
          key={index}
          ref={index === activeIndex ? activeRef : undefined}
          className={`${styles.lyricLine} ${
            index === activeIndex
              ? styles.lyricActive
              : index < activeIndex
                ? styles.lyricPast
                : ''
          }`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}

export default function ExpandedPlayer({ onClose, onGoToArtist }: ExpandedPlayerProps) {
  const {
    audioRef,
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
  const lyrics = useLyrics(currentSong, duration);
  const romaji = useRomaji(currentSong, lyrics.lines, lyrics.plain);
  const [tab, setTab] = useState<TabId>('siguientes');
  const [lyricMode, setLyricMode] = useState<'japanese' | 'romaji'>('japanese');
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragXRef = useRef(0);
  const closingRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  dragXRef.current = dragX;

  const beginClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setDragging(false);
    setDragX(window.innerWidth);
    window.setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const drag = { startX: 0, startY: 0, active: false, fromContent: false };

    const onTouchStart = (event: TouchEvent) => {
      if (closingRef.current) return;
      const touch = event.touches[0];
      drag.startX = touch.clientX;
      drag.startY = touch.clientY;
      drag.active = false;
      drag.fromContent = contentRef.current?.contains(event.target as Node) ?? false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (closingRef.current) return;
      const touch = event.touches[0];
      const dx = touch.clientX - drag.startX;
      const dy = touch.clientY - drag.startY;
      if (!drag.active) {
        if (dx > 0 && dx > 30 && dx > Math.abs(dy) * 1.2 && !drag.fromContent) {
          drag.active = true;
        } else {
          return;
        }
      }
      event.preventDefault();
      setDragging(true);
      setDragX(Math.max(0, dx));
    };

    const onTouchEnd = () => {
      if (closingRef.current) return;
      if (drag.active && dragXRef.current > 100) {
        beginClose();
      } else {
        setDragging(false);
        setDragX(0);
      }
      drag.active = false;
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });
    panel.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
      panel.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [beginClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

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

  const displayLines = useMemo<LyricLine[] | null>(() => {
    if (!lyrics.lines || lyrics.lines.length === 0) return null;
    if (
      lyricMode === 'romaji' &&
      romaji.lines &&
      romaji.lines.length === lyrics.lines.length
    ) {
      return lyrics.lines.map((line, index) => ({
        time: line.time,
        text: romaji.lines![index],
      }));
    }
    return lyrics.lines;
  }, [lyrics.lines, lyricMode, romaji.lines]);

  const renderRomajiToggle = () => (
    <div className={styles.lyricsTools}>
      <div className={styles.segmented} role="group" aria-label="Idioma de la letra">
        <button
          type="button"
          className={`${styles.segOption} ${lyricMode === 'japanese' ? styles.segActive : ''}`}
          onClick={() => setLyricMode('japanese')}
          aria-pressed={lyricMode === 'japanese'}
        >
          日本語
        </button>
        <button
          type="button"
          className={`${styles.segOption} ${lyricMode === 'romaji' ? styles.segActive : ''}`}
          onClick={() => setLyricMode('romaji')}
          aria-pressed={lyricMode === 'romaji'}
        >
          Romaji
        </button>
      </div>
    </div>
  );

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
      <div
        className={styles.panel}
        ref={panelRef}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: dragging ? 'none' : 'transform 0.25s ease',
        }}
      >
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

        <div className={styles.content} ref={contentRef}>
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

          {tab === 'letra' &&
            (lyrics.status === 'loading' ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Buscando letra…</p>
                <p>Consultando el servicio de letras sincronizadas.</p>
              </div>
            ) : lyrics.lines && lyrics.lines.length > 0 ? (
              <>
                {romaji.status === 'ready' && renderRomajiToggle()}
                <LyricsView lines={displayLines ?? lyrics.lines} audioRef={audioRef} />
              </>
            ) : lyrics.plain ? (
              <>
                {romaji.status === 'ready' && renderRomajiToggle()}
                <pre className={styles.plainLyrics}>
                  {lyricMode === 'romaji' && romaji.plain ? romaji.plain : lyrics.plain}
                </pre>
              </>
            ) : (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Letra próximamente</p>
                <p>La letra de esta canción aún no está disponible en la versión beta.</p>
              </div>
            ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
