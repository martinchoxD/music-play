import type { NewsItem, NewsTag } from '../data/news';
import { formatNewsDate, timeAgo } from '../utils/newsTime';
import styles from './NewsCard.module.css';

const TAG_LABELS: Record<NewsTag, string> = {
  update: 'Nueva Actualización',
  dev: 'Desarrollo Interno',
  info: 'Aviso Oficial',
};

const CARD_STYLES: Record<NewsTag, string> = {
  update: styles.cardUpdate,
  dev: styles.cardDev,
  info: styles.cardInfo,
};

const TAG_STYLES: Record<NewsTag, string> = {
  update: styles.tagUpdate,
  dev: styles.tagDev,
  info: styles.tagInfo,
};

interface NewsCardProps {
  item: NewsItem;
  now: Date;
}

export default function NewsCard({ item, now }: NewsCardProps) {
  return (
    <article className={`${styles.card} ${CARD_STYLES[item.tag]}`}>
      <header className={styles.header}>
        <span className={`${styles.tag} ${TAG_STYLES[item.tag]}`}>{TAG_LABELS[item.tag]}</span>
        <span className={styles.timer}>{timeAgo(item.publishedAt, now)}</span>
      </header>

      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.text}>{item.description}</p>

      <footer className={styles.footer}>
        <span>Publicado el {formatNewsDate(item.publishedAt)}</span>
      </footer>
    </article>
  );
}
