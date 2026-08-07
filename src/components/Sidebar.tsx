import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
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
  isOpen: boolean;
  onClose: () => void;
  player?: ReactNode;
}

export default function Sidebar({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  player,
}: SidebarProps) {
  const { playRandom, randomMode } = usePlayer();
  const { isInstalled, install } = useInstallPrompt();
  const [showGuide, setShowGuide] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragXRef = useRef(0);
  const closingRef = useRef(false);

  dragXRef.current = dragX;

  const navigate = (view: View) => {
    onNavigate(view);
    onClose();
  };

  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const drag = { startX: 0, startY: 0, active: false };

    const onTouchStart = (event: TouchEvent) => {
      if (closingRef.current) return;
      const touch = event.touches[0];
      drag.startX = touch.clientX;
      drag.startY = touch.clientY;
      drag.active = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (closingRef.current) return;
      const touch = event.touches[0];
      const dx = touch.clientX - drag.startX;
      const dy = touch.clientY - drag.startY;
      if (!drag.active) {
        if (dx < 0 && -dx > 20 && -dx > Math.abs(dy) * 1.2) {
          drag.active = true;
        } else {
          return;
        }
      }
      event.preventDefault();
      setDragging(true);
      setDragX(Math.max(-280, Math.min(0, dx)));
    };

    const closeSidebar = () => {
      if (closingRef.current) return;
      const width = sidebarRef.current?.getBoundingClientRect().width ?? 280;
      closingRef.current = true;
      setDragging(false);
      setDragX(-width);
      window.setTimeout(() => {
        closingRef.current = false;
        onClose();
      }, 280);
    };

    const onTouchEnd = () => {
      if (closingRef.current) return;
      if (drag.active && dragXRef.current < -100) {
        closeSidebar();
      } else {
        setDragging(false);
        setDragX(0);
      }
      drag.active = false;
    };

    sidebar.addEventListener('touchstart', onTouchStart, { passive: true });
    sidebar.addEventListener('touchmove', onTouchMove, { passive: false });
    sidebar.addEventListener('touchend', onTouchEnd, { passive: true });
    sidebar.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      sidebar.removeEventListener('touchstart', onTouchStart);
      sidebar.removeEventListener('touchmove', onTouchMove);
      sidebar.removeEventListener('touchend', onTouchEnd);
      sidebar.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setDragX(0);
      setDragging(false);
    }
  }, [isOpen]);

  return (
    <nav
      ref={sidebarRef}
      className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      style={{
        transform: dragging || dragX !== 0 ? `translateX(${dragX}px)` : undefined,
        transition: dragging ? 'none' : undefined,
      }}
      aria-label="Navegación principal"
    >
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
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

      {!isInstalled && (
        <>
          <button
            type="button"
            className={styles.installBtn}
            onClick={async () => {
              const prompted = await install();
              onClose();
              setShowGuide(!prompted);
            }}
          >
            <span className={styles.icon} aria-hidden="true">📲</span>
            <span className={styles.label}>Descargar app</span>
          </button>

          {showGuide && (
            <div className={styles.installGuide}>
              <button
                type="button"
                className={styles.guideClose}
                onClick={() => setShowGuide(false)}
                aria-label="Cerrar ayuda"
              >
                ✕
              </button>
              <p className={styles.guideTitle}>No se pudo abrir el diálogo de instalación.</p>
              <ul className={styles.guideList}>
                <li>
                  <strong>Chrome / Edge:</strong> usá el icono de instalación en la barra de
                  direcciones (o ⋮ → «Instalar app»).
                </li>
                <li>
                  <strong>iOS (Safari):</strong> botón Compartir → «Agregar a pantalla de
                  inicio».
                </li>
                <li>
                  Debe estar abierto en <strong>localhost</strong> o una URL <strong>https</strong>.
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      {player}
    </nav>
  );
}
