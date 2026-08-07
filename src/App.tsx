import { useEffect, useRef, useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import HomeView from './components/HomeView';
import NewsView from './components/NewsView';
import ArtistsView from './components/ArtistsView';
import ArtistDetailView from './components/ArtistDetailView';
import PlaylistsView from './components/PlaylistsView';
import PlayerBar from './components/PlayerBar';
import ExpandedPlayer from './components/ExpandedPlayer';
import { useMediaQuery } from './hooks/useMediaQuery';
import type { View } from './types/view';
import styles from './App.module.css';

export default function App() {
  const [view, setView] = useState<View>('inicio');
  const [selectedArtist, setSelectedArtist] = useState('Eve');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const appRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMobile) return;
    const app = appRef.current;
    if (!app) return;

    let startX = 0;
    let startY = 0;
    let leftActive = false;
    let rightActive = false;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      leftActive = false;
      rightActive = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (!leftActive && !rightActive) {
        if (startX <= 24 && dx > 30 && dx > Math.abs(dy) * 1.2) {
          leftActive = true;
        } else if (
          startX >= window.innerWidth - 24 &&
          dx < -30 &&
          -dx > Math.abs(dy) * 1.2
        ) {
          rightActive = true;
        } else {
          return;
        }
      }
      event.preventDefault();
    };

    const onTouchEnd = () => {
      if (leftActive) {
        setSidebarOpen(true);
      }
      if (rightActive) {
        setPlayerExpanded(true);
      }
      leftActive = false;
      rightActive = false;
    };

    app.addEventListener('touchstart', onTouchStart, { passive: true });
    app.addEventListener('touchmove', onTouchMove, { passive: false });
    app.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      app.removeEventListener('touchstart', onTouchStart);
      app.removeEventListener('touchmove', onTouchMove);
      app.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile]);

  const goToArtist = (artist: string) => {
    setSelectedArtist(artist);
    setView('artista-detalle');
  };

  const showPlayerInSidebar = !isMobile || sidebarOpen;

  return (
    <PlayerProvider>
      <div className={styles.app} ref={appRef}>
        <Sidebar
          currentView={view}
          onNavigate={setView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          player={
            showPlayerInSidebar ? (
              <PlayerBar
                onGoToArtist={goToArtist}
                onExpand={() => setPlayerExpanded(true)}
                embedded
              />
            ) : undefined
          }
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
            <SearchBar onGoToArtist={goToArtist} />
          </header>

          <div className={styles.content}>
            {view === 'inicio' && <HomeView onGoToArtist={goToArtist} />}
            {view === 'noticias' && <NewsView />}
            {view === 'artistas' && <ArtistsView onGoToArtist={goToArtist} />}
            {view === 'artista-detalle' && <ArtistDetailView artist={selectedArtist} />}
            {view === 'playlists' && <PlaylistsView onGoToArtist={goToArtist} />}
          </div>
        </main>

        {isMobile && !sidebarOpen && (
          <PlayerBar
            onGoToArtist={goToArtist}
            onExpand={() => setPlayerExpanded(true)}
          />
        )}

        {playerExpanded && (
          <ExpandedPlayer
            onClose={() => setPlayerExpanded(false)}
            onGoToArtist={goToArtist}
          />
        )}
      </div>
    </PlayerProvider>
  );
}
