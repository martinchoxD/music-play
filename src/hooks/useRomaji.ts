import { useEffect, useMemo, useState } from 'react';
import type { Song } from '../types/song';
import type { LyricLine } from '../data/lyrics';

export type RomajiStatus = 'loading' | 'ready' | 'none';

export interface RomajiResult {
  lines: string[] | null;
  plain: string | null;
  status: RomajiStatus;
}

const CACHE_PREFIX = 'musicplay:romaji:';
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const SEPARATOR = ' / ';
const CHUNK_MAX_LINES = 40;

interface CacheEntry {
  lines: string[];
  fetchedAt?: number;
}

function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function readCache(key: string): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const data = JSON.parse(raw) as CacheEntry;
    if (
      !data ||
      !Array.isArray(data.lines) ||
      typeof data.fetchedAt !== 'number' ||
      Date.now() - data.fetchedAt > CACHE_TTL_MS
    ) {
      return null;
    }
    return data.lines;
  } catch {
    return null;
  }
}

function writeCache(key: string, lines: string[]) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ lines, fetchedAt: Date.now() }));
  } catch {
    return;
  }
}

function extractRomaji(data: unknown): string | null {
  if (!Array.isArray(data)) return null;
  const first = data[0];
  if (!Array.isArray(first)) return null;
  const block = first[0];
  if (!Array.isArray(block)) return null;
  const romaji = block[3];
  return typeof romaji === 'string' && romaji.length > 0 ? romaji : null;
}

async function fetchRomajiLines(text: string): Promise<string[] | null> {
  const sourceLines = text.split('\n');
  const result: string[] = [];
  for (let i = 0; i < sourceLines.length; i += CHUNK_MAX_LINES) {
    const chunk = sourceLines.slice(i, i + CHUNK_MAX_LINES);
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', 'ja');
    url.searchParams.set('tl', 'en');
    url.searchParams.set('dt', 'rm');
    url.searchParams.set('q', chunk.join(SEPARATOR));
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const romaji = extractRomaji(await response.json());
    if (romaji === null) return null;
    result.push(...romaji.split('/').map((part) => part.trim()));
  }
  return result;
}

export function useRomaji(
  song: Song | null,
  lines: LyricLine[] | null,
  plain: string | null,
): RomajiResult {
  const text = useMemo(() => {
    if (!song) return '';
    if (lines && lines.length > 0) return lines.map((line) => line.text).join('\n');
    if (plain) return plain.replace(/\r\n/g, '\n');
    return '';
  }, [song, lines, plain]);

  const cacheKey = useMemo(() => {
    if (!song || !text) return null;
    return `${song.id}:${simpleHash(text)}`;
  }, [song, text]);

  const [result, setResult] = useState<RomajiResult>(() => {
    if (!song || !text || !cacheKey) return { lines: null, plain: null, status: 'none' };
    const cached = readCache(cacheKey);
    if (cached) {
      const hadLines = lines && lines.length > 0;
      return {
        lines: hadLines ? cached : null,
        plain: hadLines ? null : cached.join('\n'),
        status: 'ready',
      };
    }
    return { lines: null, plain: null, status: 'loading' };
  });

  useEffect(() => {
    if (!song || !text || !cacheKey) {
      setResult({ lines: null, plain: null, status: 'none' });
      return;
    }
    const hadLines = lines && lines.length > 0;
    const cached = readCache(cacheKey);
    if (cached) {
      setResult({
        lines: hadLines ? cached : null,
        plain: hadLines ? null : cached.join('\n'),
        status: 'ready',
      });
      return;
    }
    let cancelled = false;
    setResult({ lines: null, plain: null, status: 'loading' });
    fetchRomajiLines(text)
      .then((romajiLines) => {
        if (cancelled) return;
        if (!romajiLines || (hadLines && romajiLines.length !== lines?.length)) {
          setResult({ lines: null, plain: null, status: 'none' });
          return;
        }
        writeCache(cacheKey, romajiLines);
        setResult({
          lines: hadLines ? romajiLines : null,
          plain: hadLines ? null : romajiLines.join('\n'),
          status: 'ready',
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ lines: null, plain: null, status: 'none' });
      });
    return () => {
      cancelled = true;
    };
  }, [song, text, cacheKey, lines, plain]);

  return result;
}
