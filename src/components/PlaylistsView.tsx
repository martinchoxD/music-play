import { useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PlaylistDetail from './PlaylistDetail';
import { songs } from '../data/songs';
import type { Playlist } from '../types/playlist';
import type { Song } from '../types/song';
import styles from './PlaylistsView.module.css';

interface PlaylistsViewProps {
  onGoToArtist: (artist: string) => void;
}

const STORAGE_KEY = 'musicplay:playlists';

function createPlaylistId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `pl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function PlaylistsView({ onGoToArtist }: PlaylistsViewProps) {
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>(STORAGE_KEY, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const songsById = useMemo(() => new Map(songs.map((song) => [song.id, song])), []);

  const selected = playlists.find((playlist) => playlist.id === selectedId) ?? null;

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Escribí un nombre para la playlist.');
      return;
    }
    const playlist: Playlist = {
      id: createPlaylistId(),
      name: trimmed,
      songIds: [],
      createdAt: Date.now(),
    };
    setPlaylists((prev) => [playlist, ...prev]);
    setSelectedId(playlist.id);
    setName('');
    setError('');
  };

  const renamePlaylist = (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const addSong = (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p,
      ),
    );
  };

  const removeSong = (playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
          : p,
      ),
    );
  };

  if (selected) {
    return (
      <PlaylistDetail
        playlist={selected}
        songsById={songsById}
        onRename={renamePlaylist}
        onDelete={deletePlaylist}
        onBack={() => setSelectedId(null)}
        onAddSong={addSong}
        onRemoveSong={removeSong}
        onGoToArtist={onGoToArtist}
      />
    );
  }

  const songCountText = (count: number) =>
    `${count} ${count === 1 ? 'canción' : 'canciones'}`;

  return (
    <div>
      <h2 className={styles.title}>Mis Playlists</h2>

      <form className={styles.createForm} onSubmit={handleCreate}>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError('');
          }}
          placeholder="Nombre de la nueva playlist"
          aria-label="Nombre de la nueva playlist"
        />
        <button type="submit" className={styles.createBtn}>
          + Crear playlist
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}

      {playlists.length === 0 ? (
        <p className={styles.empty}>
          Todavía no tenés playlists. Creá una arriba y agregá tus canciones favoritas.
        </p>
      ) : (
        <div className={styles.grid}>
          {playlists.map((playlist) => {
            const cover = playlist.songIds
              .map((id) => songsById.get(id))
              .find((song): song is Song => Boolean(song));

            return (
              <div key={playlist.id} className={styles.card}>
                <button
                  type="button"
                  className={styles.coverBtn}
                  onClick={() => setSelectedId(playlist.id)}
                  aria-label={`Abrir playlist ${playlist.name}`}
                >
                  {cover ? (
                    <img
                      className={styles.cover}
                      src={cover.coverUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}>
                      <span aria-hidden="true">🎶</span>
                    </div>
                  )}
                  <span className={styles.playBadge} aria-hidden="true">
                    ▶
                  </span>
                </button>
                <p className={styles.cardName}>{playlist.name}</p>
                <p className={styles.cardMeta}>{songCountText(playlist.songIds.length)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
