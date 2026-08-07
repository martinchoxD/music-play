import { usePlayer } from '../context/PlayerContext';
import EqualizerBars from './EqualizerBars';
import { artistsInfo } from '../data/artists';
import { songsByArtist } from '../data/songs';
import styles from './ArtistDetailView.module.css';

interface ArtistDetailViewProps {
  artist: string;
}

export default function ArtistDetailView({ artist }: ArtistDetailViewProps) {
  const { currentSong, isPlaying, playSong } = usePlayer();
  const info = artistsInfo[artist];
  const songs = songsByArtist[artist] ?? [];

  if (!info) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>
        <img
          className={styles.profileImg}
          src={info.img}
          alt={`Foto de ${artist}`}
          referrerPolicy="no-referrer"
        />
        <div className={styles.info}>
          <p className={styles.listeners}>{info.listeners}</p>
          <h1 className={styles.name}>{artist}</h1>
          <p className={styles.bio}>{info.bio}</p>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Canciones Populares</h3>

      <div className={styles.songListWrap}>
        <table className={styles.songList}>
          <tbody>
            {songs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              const isCurrentPlaying = isCurrent && isPlaying;

              return (
                <tr
                  key={song.id}
                  className={isCurrent ? styles.playing : ''}
                  onClick={() => playSong(song, songs)}
                  title={`Reproducir ${song.title}`}
                >
                  <td className={styles.trackImg}>
                    <div className={styles.trackImgContainer}>
                      {isCurrentPlaying && <EqualizerBars className={styles.trackBars} />}
                      <img
                        src={song.coverUrl}
                        alt={`Portada de ${song.title}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </td>
                  <td className={styles.trackTitle}>{song.title}</td>
                  <td className={styles.trackArtist}>{artist}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
