import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ArtistSection from './components/ArtistSection';
import PlayerBar from './components/PlayerBar';
import { artists, songsByArtist } from './data/songs';
import styles from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = artists
    .map((artist) => ({
      artist,
      songs: songsByArtist[artist].filter(
        (song) =>
          song.title.toLowerCase().includes(normalizedQuery) ||
          song.artist.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((section) => section.songs.length > 0);

  return (
    <PlayerProvider>
      <div className={styles.app}>
        <Sidebar />
        <main className={styles.main}>
          <header className={styles.header}>
            <SearchBar value={query} onChange={setQuery} />
          </header>

          <section className={styles.content}>
            <h2 className={styles.title}>Tus canciones y artistas</h2>

            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <ArtistSection key={section.artist} artist={section.artist} songs={section.songs} />
              ))
            ) : (
              <p className={styles.empty}>
                No se encontraron resultados para “{query}”.
              </p>
            )}
          </section>
        </main>

        <PlayerBar />
      </div>
    </PlayerProvider>
  );
}
