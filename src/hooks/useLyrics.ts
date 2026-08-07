import { useEffect, useMemo, useState } from 'react';
import type { Song } from '../types/song';
import { lyricsBySong, parseLrc, type LyricLine } from '../data/lyrics';
import { lyricOffsetsBySong } from '../data/lyricOffsets';

export type LyricsStatus = 'loading' | 'ready' | 'none';

interface LyricsResult {
  lines: LyricLine[] | null;
  plain: string | null;
  status: LyricsStatus;
}

const CACHE_PREFIX = 'musicplay:lyrics:';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  synced: string | null;
  plain: string | null;
}

function readCache(id: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + id);
    if (!raw) return null;
    const data = JSON.parse(raw) as CacheEntry & { fetchedAt?: number };
    if (
      !data ||
      typeof data.fetchedAt !== 'number' ||
      Date.now() - data.fetchedAt > CACHE_TTL_MS
    ) {
      return null;
    }
    return { synced: data.synced ?? null, plain: data.plain ?? null };
  } catch {
    return null;
  }
}

function writeCache(id: string, entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_PREFIX + id, JSON.stringify({ ...entry, fetchedAt: Date.now() }));
  } catch {
    return;
  }
}

interface LrcLibResult {
  artistName: string;
  syncedLyrics: string | null;
  plainLyrics: string | null;
}

function shiftLines(lines: LyricLine[], offset: number): LyricLine[] {
  if (!offset) return lines;
  return lines.map((line) => ({
    time: Math.max(0, line.time + offset),
    text: line.text,
  }));
}

export function useLyrics(song: Song | null, duration: number): LyricsResult {
  const [result, setResult] = useState<LyricsResult>(() => {
    const bundled = song ? lyricsBySong[song.id] : undefined;
    if (bundled && bundled.length > 0) {
      const offset = song ? lyricOffsetsBySong[song.id] ?? 0 : 0;
      return { lines: shiftLines(bundled, offset), plain: null, status: 'ready' };
    }
    return { lines: null, plain: null, status: 'loading' };
  });

  useEffect(() => {
    if (!song) {
      setResult({ lines: null, plain: null, status: 'none' });
      return;
    }

    const offset = lyricOffsetsBySong[song.id] ?? 0;
    const bundled = lyricsBySong[song.id];
    if (bundled && bundled.length > 0) {
      setResult({ lines: shiftLines(bundled, offset), plain: null, status: 'ready' });
      return;
    }

    const cached = readCache(song.id);
    if (cached) {
      const lines = cached.synced ? shiftLines(parseLrc(cached.synced), offset) : null;
      setResult({
        lines,
        plain: cached.plain,
        status: lines || cached.plain ? 'ready' : 'none',
      });
      return;
    }

    let cancelled = false;
    setResult((prev) => ({ ...prev, status: 'loading' }));

    const url = new URL('https://lrclib.net/api/search');
    url.searchParams.set('track_name', song.title);
    url.searchParams.set('artist_name', song.artist);
    if (duration > 0) {
      url.searchParams.set('duration', String(Math.round(duration)));
    }

    fetch(url.toString())
      .then((response) => {
        if (!response.ok) throw new Error('Lyrics request failed');
        return response.json() as Promise<LrcLibResult[]>;
      })
      .then((results) => {
        if (cancelled) return;
        const matches = results.filter((item) => item.artistName === song.artist);
        const pool = matches.length > 0 ? matches : results;
        const syncedItem = pool.find((item) => item.syncedLyrics);
        const synced = syncedItem?.syncedLyrics ?? null;
        const plain = synced
          ? syncedItem?.plainLyrics ?? null
          : pool[0]?.plainLyrics ?? null;
        writeCache(song.id, { synced, plain });
        const lines = synced ? shiftLines(parseLrc(synced), offset) : null;
        setResult({ lines, plain, status: lines || plain ? 'ready' : 'none' });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ lines: null, plain: null, status: 'none' });
      });

    return () => {
      cancelled = true;
    };
  }, [song, duration]);

  return useMemo(() => result, [result]);
}
