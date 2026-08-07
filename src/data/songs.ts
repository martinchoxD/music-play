import type { Song } from '../types/song';
import { audioBaseUrl } from '../config';

interface SongSeed {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioFile: string;
}

const seeds: SongSeed[] = [
  // Eve
  {
    id: 'eve-kaikai-kitan',
    title: 'Kaikai Kitan',
    artist: 'Eve',
    coverUrl: 'https://pbs.twimg.com/media/GTTjqGragAAH76i.jpg',
    audioFile: 'kaikai-kitan.mp3',
  },
  {
    id: 'eve-dramaturgy',
    title: 'Dramaturgy',
    artist: 'Eve',
    coverUrl: 'https://i.ytimg.com/vi/jJzw1h5CR-I/maxresdefault.jpg',
    audioFile: 'dramaturgy.mp4',
  },
  {
    id: 'eve-inochi-no-tabekata',
    title: 'Inochi no Tabekata',
    artist: 'Eve',
    coverUrl:
      'https://i.ytimg.com/vi/U7L-3VXAkSA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAE_qkFO8uSHdA8NnhPWMNry6hUgg',
    audioFile: 'inochi.mp3',
  },
  {
    id: 'eve-kokoroyohou',
    title: 'Kokoroyohou',
    artist: 'Eve',
    coverUrl: 'https://i.ytimg.com/vi/dJf4wCdLU18/maxresdefault.jpg',
    audioFile: 'kokoro.mp3',
  },
  {
    id: 'eve-tokyo-ghetto',
    title: 'Tokyo Ghetto',
    artist: 'Eve',
    coverUrl: 'https://e.snmc.io/i/1200/s/d489776d29027598cde3d17f9474f9c4/9879683',
    audioFile: 'tokyo.mp4',
  },
  {
    id: 'eve-last-dance',
    title: 'Last Dance',
    artist: 'Eve',
    coverUrl: 'https://i.ytimg.com/vi/CLdeykXCZX4/maxresdefault.jpg',
    audioFile: 'lastdance.mp3',
  },
  {
    id: 'eve-nonsense-bungaku',
    title: 'Nonsense Bungaku',
    artist: 'Eve',
    coverUrl: 'https://i.ytimg.com/vi/OskXF3s0UT8/maxresdefault.jpg',
    audioFile: 'nonsense.mp3',
  },
  {
    id: 'eve-anoko-secret',
    title: 'Anoko Secret',
    artist: 'Eve',
    coverUrl: 'https://i.ytimg.com/vi/sgdPlDG1-8k/maxresdefault.jpg',
    audioFile: 'anoko.mp3',
  },
  {
    id: 'eve-insomnia',
    title: 'Insomnia',
    artist: 'Eve',
    coverUrl: 'https://www.billboard-japan.com/scale/news/00000138/138536/800x_image.jpg',
    audioFile: 'insomnia.mp3',
  },
  {
    id: 'eve-dont-replay',
    title: "Don't replay",
    artist: 'Eve',
    coverUrl:
      'https://static.wikia.nocookie.net/kara-no-kioku-eve/images/e/ec/Taikutsu_thumb.png/revision/latest?cb=20220619022453',
    audioFile: 'dontreplay.mp3',
  },

  // natori
  {
    id: 'natori-overdose',
    title: 'Overdose',
    artist: 'natori',
    coverUrl: 'https://i.ytimg.com/vi/H08YWE4CIFQ/maxresdefault.jpg',
    audioFile: 'overdose.mp4',
  },
  {
    id: 'natori-cult',
    title: 'Cult',
    artist: 'natori',
    coverUrl:
      'https://i.ytimg.com/vi/GQrppVgwz5o/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD7ERinsn5J6me2L6U6A2sLIwPtrg',
    audioFile: 'cult.mp3',
  },
  {
    id: 'natori-propose',
    title: 'Propose',
    artist: 'natori',
    coverUrl:
      'https://i.ytimg.com/vi/VDdLF1YubI0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDR-Qae0mi3TYyInRWfExUNEPcTYA',
    audioFile: 'propose.mp4',
  },
  {
    id: 'natori-serenade',
    title: 'Serenade',
    artist: 'natori',
    coverUrl: 'https://i.ytimg.com/vi/Gyo2yaH9E4k/mqdefault.jpg',
    audioFile: 'serenade.mp4',
  },
  {
    id: 'natori-dressing-room',
    title: 'DRESSING ROOM',
    artist: 'natori',
    coverUrl:
      'https://www.yure.me/_next/image?url=https%3A%2F%2Fypkefxbgavxybyzluxan.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fimages%2Ftranslation%2F1740838162111-acbdxj.jpeg&w=3840&q=75',
    audioFile: 'dressing.mp3',
  },
  {
    id: 'natori-absolute-zero',
    title: 'Absolute Zero',
    artist: 'natori',
    coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ3VfMYCi0rPd-JFHLO6Q-_rkw-lsg5l30tA&s',
    audioFile: 'zero.mp3',
  },
  {
    id: 'natori-friday-night',
    title: 'Friday Night',
    artist: 'natori',
    coverUrl: 'https://i.ytimg.com/vi/UmyhuVj9tf8/maxresdefault.jpg',
    audioFile: 'friday.mp3',
  },
  {
    id: 'natori-melodrama',
    title: 'Melodrama',
    artist: 'natori',
    coverUrl:
      'https://i.ytimg.com/vi/Ao29RaMxH98/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBb4o0Cm28cpW7qrykjlSLkyCUcYQ',
    audioFile: 'melodrama.mp3',
  },
  {
    id: 'natori-osmanthus',
    title: 'Osmanthus',
    artist: 'natori',
    coverUrl:
      'https://i.ytimg.com/vi/1pI242Hsi5U/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAGLeId0ywjocBaDf5DtMb-hrsX8Q',
    audioFile: 'osmanthus.mp3',
  },
  {
    id: 'natori-in-my-head',
    title: 'IN_MY_HEAD',
    artist: 'natori',
    coverUrl: 'https://i.ytimg.com/vi/49tyOkJ0uLs/maxresdefault.jpg',
    audioFile: 'head.mp3',
  },

  // Ado
  {
    id: 'ado-usseewa',
    title: 'Usseewa',
    artist: 'Ado',
    coverUrl: 'https://i.ytimg.com/vi/Qp3b-RXtz4w/maxresdefault.jpg',
    audioFile: 'usseewa.mp4',
  },
  {
    id: 'ado-show',
    title: 'Show',
    artist: 'Ado',
    coverUrl: 'https://i.ytimg.com/vi/pgXpM4l_MwI/maxresdefault.jpg',
    audioFile: 'show.mp4',
  },
  {
    id: 'ado-gira-gira',
    title: 'Gira Gira',
    artist: 'Ado',
    coverUrl: 'https://i.ytimg.com/vi/sOiMD45QGLs/maxresdefault.jpg',
    audioFile: 'giragira.mp4',
  },
  {
    id: 'ado-new-genesis',
    title: 'New Genesis',
    artist: 'Ado',
    coverUrl: 'https://thebiaslist.com/wp-content/uploads/2022/07/ado-uta-new-genesis.jpg?w=640',
    audioFile: 'genesis.mp3',
  },
  {
    id: 'ado-odo',
    title: 'Odo',
    artist: 'Ado',
    coverUrl: 'https://i.ytimg.com/vi/YnSW8ian29w/maxresdefault.jpg',
    audioFile: 'odo.mp4',
  },
  {
    id: 'ado-mirror',
    title: 'MIRROR',
    artist: 'Ado',
    coverUrl: 'https://i.ytimg.com/vi/zsBBWBEZkFQ/maxresdefault.jpg',
    audioFile: 'mirror.mp4',
  },
  {
    id: 'ado-rockstar',
    title: 'Rockstar',
    artist: 'Ado',
    coverUrl:
      'https://i.ytimg.com/vi/hRJpiCZlLX8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDbxJ-k-Dl0czDPIUJtTSVLIXSCfw',
    audioFile: 'rockstar.mp4',
  },
  {
    id: 'ado-magic',
    title: 'MAGIC',
    artist: 'Ado',
    coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMobYAGq0sT1aKQJMJESu-qQ3LKFTD5JYoWA&s',
    audioFile: 'magic.mp3',
  },
  {
    id: 'ado-rule',
    title: 'Rule',
    artist: 'Ado',
    coverUrl: 'https://i.ytimg.com/vi/0Z_YqhYHhpg/maxresdefault.jpg',
    audioFile: 'rule.mp4',
  },
  {
    id: 'ado-sakura-biyori',
    title: 'Sakura Biyori',
    artist: 'Ado',
    coverUrl:
      'https://i.ytimg.com/vi/nIWZfhpnq6M/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCktiruuPfC1UML-EMbMeORZg_fzA',
    audioFile: 'sakura.mp3',
  },

  // YOASOBI
  {
    id: 'yoasobi-yoru-ni-kakeru',
    title: 'Yoru ni Kakeru',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/x8VYWazR5mE/maxresdefault.jpg',
    audioFile: 'yoru.mp3',
  },
  {
    id: 'yoasobi-yuusha',
    title: 'Yuusha',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/Zbscn1_XiVA/maxresdefault.jpg',
    audioFile: 'yuusha.mp4',
  },
  {
    id: 'yoasobi-idol',
    title: 'Idol',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/ZRtdQ81jPUQ/maxresdefault.jpg',
    audioFile: 'idol.mp3',
  },
  {
    id: 'yoasobi-tabun',
    title: 'Tabun',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/vydqrVOINDE/maxresdefault.jpg',
    audioFile: 'tabun.mp3',
  },
  {
    id: 'yoasobi-ano-yume-o-nazotte',
    title: 'Ano Yume o Nazotte',
    artist: 'YOASOBI',
    coverUrl: 'https://img.youtube.com/vi/sAuEeM_6zpk/0.jpg',
    audioFile: 'anoyume.mp4',
  },
  {
    id: 'yoasobi-love-letter',
    title: 'Love Letter',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/mnta9Pp2LqA/maxresdefault.jpg',
    audioFile: 'loveletter.mp3',
  },
  {
    id: 'yoasobi-watch-me',
    title: 'Watch Me!',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/evtoG-4dLM4/maxresdefault.jpg',
    audioFile: 'watchme.mp3',
  },
  {
    id: 'yoasobi-gunjou',
    title: 'Gunjou',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/Y4nEEZwckuU/maxresdefault.jpg',
    audioFile: 'gunjou.mp3',
  },
  {
    id: 'yoasobi-sangenshoku',
    title: 'Sangenshoku',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/vMAMBqMjtr4/maxresdefault.jpg',
    audioFile: 'sangenshoku.mp3',
  },
  {
    id: 'yoasobi-tsubame',
    title: 'Tsubame',
    artist: 'YOASOBI',
    coverUrl: 'https://i.ytimg.com/vi/qDL3zhB8-MM/maxresdefault.jpg',
    audioFile: 'tsubame.mp3',
  },
];

export const songs: Song[] = seeds.map(({ audioFile, ...rest }) => ({
  ...rest,
  audioUrl: `${audioBaseUrl}/${audioFile}`,
}));

export const artists: string[] = ['Eve', 'natori', 'Ado', 'YOASOBI'];

export const songsByArtist: Record<string, Song[]> = artists.reduce<Record<string, Song[]>>(
  (acc, artist) => {
    acc[artist] = songs.filter((song) => song.artist === artist);
    return acc;
  },
  {},
);
