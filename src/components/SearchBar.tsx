import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { songs } from '../data/songs';
import { SearchIcon, CloseIcon } from './icons';
import type { Song } from '../types/song';
import styles from './SearchBar.module.css';

const MAX_RESULTS = 8;

export default function SearchBar() {
  const { playSong } = usePlayer();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(normalizedQuery) ||
          song.artist.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, MAX_RESULTS);
  }, [normalizedQuery]);

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
    playSong(song, results.length > 0 ? results : songs);
    setQuery('');
    setOpen(false);
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
          {results.length > 0 ? (
            results.map((song) => (
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
            ))
          ) : (
            <li className={styles.noResults}>No se encontraron canciones para “{query}”.</li>
          )}
        </ul>
      )}
    </div>
  );
}
