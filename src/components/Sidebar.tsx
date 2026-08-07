import { useState } from 'react';
import type { View } from '../types/view';
import { usePlayer } from '../context/PlayerContext';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  view?: View;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: '🏠', view: 'inicio' },
  { id: 'playlists', label: 'Playlists', icon: '🎶', view: 'playlists' },
  { id: 'noticias', label: 'Noticias', icon: '📰', view: 'noticias' },
  { id: 'artistas', label: 'Artistas', icon: '🎙️', view: 'artistas' },
];

const NAV_ID_FOR_VIEW: Record<View, string> = {
  inicio: 'inicio',
  playlists: 'playlists',
  noticias: 'noticias',
  artistas: 'artistas',
  'artista-detalle': 'artistas',
};

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { playRandom, randomMode } = usePlayer();
  const { canInstall, install } = useInstallPrompt();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (view: View) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.mobileMenuBtn} ${isOpen ? styles.hidden : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} aria-label="Navegación principal">
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        >
          ✕
        </button>

        <div className={styles.logo}>MusicPlay</div>

        <ul className={styles.nav}>
          {NAV_ITEMS.map((item) =>
            item.view ? (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.navItem} ${NAV_ID_FOR_VIEW[currentView] === item.id ? styles.active : ''}`}
                  onClick={() => navigate(item.view!)}
                  aria-current={NAV_ID_FOR_VIEW[currentView] === item.id ? 'page' : undefined}
                >
                  <span className={styles.icon} aria-hidden="true">{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </button>
              </li>
            ) : (
              <li key={item.id}>
                <span className={styles.navItemDisabled} title="Próximamente">
                  <span className={styles.icon} aria-hidden="true">{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </span>
              </li>
            ),
          )}
          <li>
            <button
              type="button"
              className={`${styles.navItem} ${randomMode ? styles.active : ''}`}
              onClick={playRandom}
              aria-pressed={randomMode}
            >
              <span className={styles.icon} aria-hidden="true">🎲</span>
              <span className={styles.label}>Aleatorio</span>
            </button>
          </li>
        </ul>

        {canInstall && (
          <button
            type="button"
            className={styles.installBtn}
            onClick={() => {
              void install();
              setIsOpen(false);
            }}
          >
            <span className={styles.icon} aria-hidden="true">📲</span>
            <span className={styles.label}>Descargar app</span>
          </button>
        )}
      </nav>
    </>
  );
}
