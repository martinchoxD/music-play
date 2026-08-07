import styles from './EqualizerBars.module.css';

interface EqualizerBarsProps {
  className?: string;
}

export default function EqualizerBars({ className }: EqualizerBarsProps) {
  return (
    <div className={`${styles.bars} ${className ?? ''}`} aria-hidden="true">
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </div>
  );
}
