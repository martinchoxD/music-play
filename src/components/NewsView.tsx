import { useEffect, useState } from 'react';
import { newsItems } from '../data/news';
import NewsCard from './NewsCard';
import styles from './NewsView.module.css';

export default function NewsView() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h2 className={styles.title}>Centro de Novedades</h2>
      <div className={styles.container}>
        {newsItems.map((item) => (
          <NewsCard key={item.id} item={item} now={now} />
        ))}
      </div>
    </div>
  );
}
