import { useMemo, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import EqualizerBars from './EqualizerBars';
import { songs } from '../data/songs';
import type { Playlist } from '../types/playlist';
import type { Song } from '../types/song';
import styles from './PlaylistDetail.module.css';

interface PlaylistDetailProps {
  playlist: Playlist;
  songsById: Map<string, Song>;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onAddSong: (playlistId: string, songId: string) => void;
  onRemoveSong: (playlistId: string, songId: string) => void;
  onGoToArtist: (artist: string) => void;
}

export default function PlaylistDetail({
  playlist,
  songsById,
  onRename,
  onDelete,
  onBack,
  onAddSong,
  onRemoveSong,
  onGoToArtist,
}: PlaylistDetailProps) {
  const { currentSong, isPlaying, playSong } = usePlayer();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(playlist.name);

  const playlistSongs = useMemo(
    () =>
      playlist.songIds
        .map((id) => songsById.get(id))
        .filter((song): song is Song => Boolean(song)),
    [playlist.songIds, songsById],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const candidates = useMemo(
    () =>
      songs.filter(
        (song) =>
          !playlist.songIds.includes(song.id) &&
          (song.title.toLowerCase().includes(normalizedQuery) ||
            song.artist.toLowerCase().includes(normalizedQuery)),
      ),
    [playlist.songIds, normalizedQuery],
  );

  const commitRename = () => {
    const trimmed = draftName.trim();
    if (trimmed) {
      onRename(playlist.id, trimmed);
    } else {
      setDraftName(playlist.name);
    }
    setEditing(false);
  };

  const cover = playlistSongs[0];
  const countText = `${playlistSongs.length} ${
    playlistSongs.length === 1 ? 'canción' : 'canciones'
  }`;

  return (
    <div>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        ← Mis playlists
      </button>

      <div className={styles.header}>
        {cover ? (
          <img
            className={styles.cover}
            src={cover.coverUrl}
            alt={`Portada de la playlist ${playlist.name}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span aria-hidden="true">🎶</span>
          </div>
        )}

        <div className={styles.headerInfo}>
          <p className={styles.tag}>PLAYLIST · LOCAL</p>
          {editing ? (
            <input
              className={styles.nameInput}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitRename();
                if (event.key === 'Escape') {
                  setDraftName(playlist.name);
                  setEditing(false);
                }
              }}
              autoFocus
              aria-label="Nombre de la playlist"
            />
          ) : (
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{playlist.name}</h1>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => {
                  setDraftName(playlist.name);
                  setEditing(true);
                }}
                aria-label="Editar nombre"
                title="Editar nombre"
              >
                ✏️
              </button>
            </div>
          )}
          <p className={styles.meta}>{countText}</p>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete(playlist.id)}
          >
            Eliminar playlist
          </button>
        </div>
      </div>

      {playlistSongs.length > 0 ? (
        <div className={styles.songListWrap}>
          <table className={styles.songList}>
            <tbody>
              {playlistSongs.map((song) => {
                const isCurrent = currentSong?.id === song.id;
                const isCurrentPlaying = isCurrent && isPlaying;

                return (
                  <tr
                    key={song.id}
                    className={isCurrent ? styles.playing : ''}
                    onClick={() => playSong(song, playlistSongs)}
                    title={`Reproducir ${song.title}`}
                  >
                    <td className={styles.trackImg}>
                      <div className={styles.trackImgContainer}>
                        {isCurrentPlaying && <EqualizerBars className={styles.trackBars} />}
                        <img
                          src={song.coverUrl}
                          alt={`Portada de ${song.title}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>
                    <td className={styles.trackTitle}>{song.title}</td>
                    <td className={styles.trackArtist}>
                      <button
                        type="button"
                        className={styles.artistLink}
                        onClick={(event) => {
                          event.stopPropagation();
                          onGoToArtist(song.artist);
                        }}
                      >
                        {song.artist}
                      </button>
                    </td>
                    <td className={styles.trackActions}>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemoveSong(playlist.id, song.id);
                        }}
                        aria-label={`Quitar ${song.title}`}
                        title="Quitar de la playlist"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.empty}>
          Esta playlist está vacía. Agregá canciones desde el buscador de abajo.
        </p>
      )}

      <section className={styles.addSection}>
        <h3 className={styles.addTitle}>Agregar canciones</h3>
        <input
          className={styles.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título o artista..."
          aria-label="Buscar canciones para agregar"
        />
        <div className={styles.candidateList}>
          {candidates.length > 0 ? (
            candidates.map((song) => (
              <div key={song.id} className={styles.candidate}>
                <img
                  className={styles.candidateImg}
                  src={song.coverUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className={styles.candidateInfo}>
                  <p className={styles.candidateTitle}>{song.title}</p>
                  <p className={styles.candidateArtist}>{song.artist}</p>
                </div>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => onAddSong(playlist.id, song.id)}
                >
                  + Agregar
                </button>
              </div>
            ))
          ) : (
            <p className={styles.noCandidates}>
              {normalizedQuery
                ? 'Sin resultados.'
                : 'Ya agregaste todas las canciones.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
