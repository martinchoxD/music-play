export interface LyricLine {
  time: number;
  text: string;
}

export function parseLrc(raw: string): LyricLine[] {
  let offsetMs = 0;
  const offsetMatch = raw.match(/\[offset:\s*([+-]?\d+)\s*\]/);
  if (offsetMatch) {
    offsetMs = parseInt(offsetMatch[1], 10);
  }

  const lines: LyricLine[] = [];
  for (const rawLine of raw.split('\n')) {
    const matches = Array.from(rawLine.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g));
    const text = rawLine.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim();
    if (!text) continue;
    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const fraction = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) / 1000 : 0;
      lines.push({ time: minutes * 60 + seconds + fraction + offsetMs / 1000, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export const lyricsBySong: Record<string, LyricLine[]> = {};
