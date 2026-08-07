import { SearchIcon, CloseIcon } from './icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.box}>
      <SearchIcon className={styles.icon} />
      <input
        className={styles.input}
        type="text"
        placeholder="Buscar artista o canción..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Buscar artista o canción"
      />
      {value.length > 0 && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
}
