import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { artists, songs } from '../data/songs';
import { artistsInfo } from '../data/artists';
import { SearchIcon, CloseIcon } from './icons';
import type { Song } from '../types/song';
import styles from './SearchBar.module.css';

const MAX_SONGS = 8;
const MAX_ARTISTS = 4;

interface SearchBarProps {
  onGoToArtist: (artist: string) => void;
}

export default function SearchBar({ onGoToArtist }: SearchBarProps) {
  const { playSong } = usePlayer();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const songResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(normalizedQuery) ||
          song.artist.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, MAX_SONGS);
  }, [normalizedQuery]);

  const artistResults = useMemo(() => {
    if (!normalizedQuery) return [];
    const matched = new Set<string>();
    for (const song of songResults) {
      matched.add(song.artist);
    }
    for (const artist of artists) {
      if (artist.toLowerCase().includes(normalizedQuery)) {
        matched.add(artist);
      }
    }
    return artists.filter((artist) => matched.has(artist)).slice(0, MAX_ARTISTS);
  }, [normalizedQuery, songResults]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const handleSelect = (song: Song) => {
    playSong(song, songResults.length > 0 ? songResults : songs);
    setQuery('');
    setOpen(false);
  };

  const handleGoToArtist = (artist: string) => {
    setQuery('');
    setOpen(false);
    onGoToArtist(artist);
  };

  const showDropdown = open && normalizedQuery.length > 0;

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.box}>
        <SearchIcon className={styles.icon} />
        <input
          className={styles.input}
          type="text"
          placeholder="Buscar artistas o canciones"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpen(false);
          }}
          aria-label="Buscar artista o canción"
        />
        {query.length > 0 && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            aria-label="Limpiar búsqueda"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul className={styles.dropdown} role="listbox" aria-label="Resultados de búsqueda">
          {artistResults.length > 0 && (
            <>
              <li className={styles.groupLabel}>Artistas</li>
              {artistResults.map((artist) => {
                const info = artistsInfo[artist];
                return (
                  <li key={`artist-${artist}`}>
                    <button
                      type="button"
                      className={styles.result}
                      onClick={() => handleGoToArtist(artist)}
                      role="option"
                    >
                      <img
                        className={`${styles.resultImg} ${styles.artistImg}`}
                        src={info?.img}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <span className={styles.resultMeta}>
                        <span className={styles.resultTitle}>{artist}</span>
                        <span className={styles.resultArtist}>{info?.listeners}</span>
                      </span>
                      <span className={styles.resultPlay} aria-hidden="true">
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </>
          )}
          {songResults.length > 0 && (
            <>
              <li className={styles.groupLabel}>Canciones</li>
              {songResults.map((song) => (
                <li key={song.id}>
                  <button
                    type="button"
                    className={styles.result}
                    onClick={() => handleSelect(song)}
                    role="option"
                  >
                    <img
                      className={styles.resultImg}
                      src={song.coverUrl}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className={styles.resultMeta}>
                      <span className={styles.resultTitle}>{song.title}</span>
                      <span className={styles.resultArtist}>{song.artist}</span>
                    </span>
                    <span className={styles.resultPlay} aria-hidden="true">
                      ▶
                    </span>
                  </button>
                </li>
              ))}
            </>
          )}
          {artistResults.length === 0 && songResults.length === 0 && (
            <li className={styles.noResults}>No se encontraron resultados para “{query}”.</li>
          )}
        </ul>
      )}
    </div>
  );
}
