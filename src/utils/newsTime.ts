export function timeAgo(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return 'Publicándose pronto';

  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Justo ahora';

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 1) return `Hace ${diffMins} min`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 1) return `Hace ${diffHours}h ${diffMins % 60}m`;

  return `Hace ${diffDays}d ${diffHours % 24}h`;
}

export function formatNewsDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} a las ${hours}:${minutes} hs`;
}
