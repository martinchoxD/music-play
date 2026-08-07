import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import HomeView from './components/HomeView';
import NewsView from './components/NewsView';
import ArtistsView from './components/ArtistsView';
import ArtistDetailView from './components/ArtistDetailView';
import PlaylistsView from './components/PlaylistsView';
import PlayerBar from './components/PlayerBar';
import type { View } from './types/view';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState<View>('inicio');
  const [selectedArtist, setSelectedArtist] = useState('Eve');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goToArtist = (artist: string) => {
    setSelectedArtist(artist);
    setView('artista-detalle');
  };

  return (
    <PlayerProvider>
      <div className={styles.app}>
        <Sidebar
          currentView={view}
          onNavigate={setView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={styles.main}>
          <header className={styles.header}>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <span />
              <span />
              <span />
            </button>
            <SearchBar />
          </header>

          <div className={styles.content}>
            {view === 'inicio' && <HomeView onGoToArtist={goToArtist} />}
            {view === 'noticias' && <NewsView />}
            {view === 'artistas' && <ArtistsView onGoToArtist={goToArtist} />}
            {view === 'artista-detalle' && <ArtistDetailView artist={selectedArtist} />}
            {view === 'playlists' && <PlaylistsView onGoToArtist={goToArtist} />}
          </div>
        </main>

        <PlayerBar onGoToArtist={goToArtist} />
      </div>
    </PlayerProvider>
  );
}
