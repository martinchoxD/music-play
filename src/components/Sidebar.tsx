import type { ComponentType } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { HomeIcon, MusicIcon, ShuffleIcon, type IconProps } from './icons';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<IconProps>;
  target: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: HomeIcon, target: 'top' },
  { id: 'eve', label: 'Eve', icon: MusicIcon, target: 'artista-eve' },
  { id: 'natori', label: 'natori', icon: MusicIcon, target: 'artista-natori' },
  { id: 'ado', label: 'Ado', icon: MusicIcon, target: 'artista-ado' },
  { id: 'yoasobi', label: 'YOASOBI', icon: MusicIcon, target: 'artista-yoasobi' },
];

export default function Sidebar() {
  const { playRandom, randomMode } = usePlayer();

  const scrollTo = (target: string) => {
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.sidebar} aria-label="Navegación principal">
      <div className={styles.logo}>MusicPlay</div>

      <ul className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={styles.navItem}
              onClick={() => scrollTo(item.target)}
            >
              <item.icon />
              <span className={styles.label}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.navItem} ${randomMode ? styles.active : ''}`}
          onClick={playRandom}
          aria-pressed={randomMode}
        >
          <ShuffleIcon />
          <span className={styles.label}>Aleatorio</span>
        </button>
      </div>
    </nav>
  );
}
