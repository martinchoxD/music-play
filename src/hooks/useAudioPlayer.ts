import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Song } from '../types/song';

/**
 * Hook central de reproducción de audio.
 *
 * Gestiona el elemento <audio>, la canción actual, la cola de reproducción
 * (las canciones de la sección donde se hizo clic) y el modo aleatorio.
 */
export function useAudioPlayer(allSongs: Song[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Song[]>([]);
  const queueIndexRef = useRef(-1);
  const randomModeRef = useRef(false);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [randomMode, setRandomMode] = useState(false);

  randomModeRef.current = randomMode;

  const playSongInternal = useCallback((song: Song, section: Song[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    queueRef.current = section;
    queueIndexRef.current = section.findIndex((item) => item.id === song.id);
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);

    audio.src = song.audioUrl;
    void audio.play().catch(() => setIsPlaying(false));
  }, []);

  const playSong = useCallback(
    (song: Song, section: Song[]) => {
      playSongInternal(song, section);
    },
    [playSongInternal],
  );

  const playRandom = useCallback(() => {
    if (allSongs.length === 0) return;
    setRandomMode(true);
    const randomSong = allSongs[Math.floor(Math.random() * allSongs.length)];
    playSongInternal(randomSong, allSongs);
  }, [allSongs, playSongInternal]);

  const next = useCallback(() => {
    if (randomModeRef.current) {
      playRandom();
      return;
    }
    const queue = queueRef.current;
    if (queue.length === 0) return;
    const currentIndex = queueIndexRef.current;
    const nextSong = currentIndex >= queue.length - 1 ? queue[0] : queue[currentIndex + 1];
    playSongInternal(nextSong, queue);
  }, [playRandom, playSongInternal]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (randomModeRef.current) {
      playRandom();
      return;
    }
    const queue = queueRef.current;
    if (queue.length === 0) return;
    const currentIndex = queueIndexRef.current;
    const prevSong = currentIndex <= 0 ? queue[queue.length - 1] : queue[currentIndex - 1];
    playSongInternal(prevSong, queue);
  }, [playRandom, playSongInternal]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [currentSong]);

  const seek = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(ratio) || ratio < 0 || ratio > 1) return;
      const target = ratio * (duration || 0);
      audio.currentTime = target;
    },
    [duration],
  );

  const closePlayer = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setRandomMode(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => next();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [next]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        artwork: [{ src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }],
      });
    } else {
      navigator.mediaSession.metadata = null;
    }
  }, [currentSong]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler | null]> = [
      ['play', togglePlay],
      ['pause', togglePlay],
      ['previoustrack', prev],
      ['nexttrack', next],
    ];

    for (const [action, handler] of handlers) {
      navigator.mediaSession.setActionHandler(action, handler);
    }

    return () => {
      for (const [action] of handlers) {
        navigator.mediaSession.setActionHandler(action, null);
      }
    };
  }, [togglePlay, prev, next]);

  return useMemo(
    () => ({
      audioRef,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      randomMode,
      playSong,
      playRandom,
      togglePlay,
      next,
      prev,
      seek,
      closePlayer,
    }),
    [
      audioRef,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      randomMode,
      playSong,
      playRandom,
      togglePlay,
      next,
      prev,
      seek,
      closePlayer,
    ],
  );
}

export type AudioPlayer = ReturnType<typeof useAudioPlayer>;
