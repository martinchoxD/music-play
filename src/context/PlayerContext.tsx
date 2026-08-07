import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { songs as allSongs } from '../data/songs';
import { useAudioPlayer, type AudioPlayer } from '../hooks/useAudioPlayer';

const PlayerContext = createContext<AudioPlayer | null>(null);

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const player = useAudioPlayer(allSongs);

  const value = useMemo(() => player, [player]);

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={value.audioRef} className="sr-only" preload="metadata" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): AudioPlayer {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe usarse dentro de <PlayerProvider>.');
  }
  return context;
}
