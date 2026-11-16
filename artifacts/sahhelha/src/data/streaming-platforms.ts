export type PosterArt =
  | "night"
  | "gothic"
  | "games"
  | "forest"
  | "fire"
  | "palace"
  | "arabic"
  | "neon"
  | "city";

export const STREAMING_PLATFORMS = [
  {
    slug: "netflix",
    name: "Netflix",
    mark: "N",
    tone: "service-netflix",
    detail: "Series, films and familiar favorites",
    titles: [
      { title: "Stranger Things", genre: "Sci-fi · Mystery", art: "night", background: "radial-gradient(ellipse at 50% 30%, #733348 0%, transparent 40%), linear-gradient(155deg, #35111f, #10101b 72%)" },
      { title: "Wednesday", genre: "Mystery · Comedy", art: "gothic", background: "radial-gradient(ellipse at 50% 32%, #64517c 0%, transparent 38%), linear-gradient(150deg, #211a35, #090b14 75%)" },
      { title: "Squid Game", genre: "Thriller · Drama", art: "games", background: "radial-gradient(circle at 50% 35%, #bd4a5d 0%, transparent 38%), linear-gradient(145deg, #501326, #15101b 78%)" },
      { title: "The Night Agent", genre: "Action · Thriller", art: "city", background: "radial-gradient(ellipse at 55% 35%, #315479 0%, transparent 40%), linear-gradient(150deg, #10263b, #080c15 76%)" },
    ],
  },
  {
    slug: "hbo-max",
    name: "HBO Max",
    mark: "H",
    tone: "service-hbo",
    detail: "Prestige stories and new discoveries",
    titles: [
      { title: "The Last of Us", genre: "Drama · Survival", art: "forest", background: "radial-gradient(ellipse at 50% 32%, #70875b 0%, transparent 42%), linear-gradient(150deg, #1d3328, #0a1112 76%)" },
      { title: "House of the Dragon", genre: "Fantasy · Drama", art: "fire", background: "radial-gradient(ellipse at 52% 30%, #c66638 0%, transparent 38%), linear-gradient(145deg, #4b2018, #100d13 76%)" },
      { title: "Euphoria", genre: "Drama", art: "neon", background: "radial-gradient(ellipse at 55% 30%, #7e56a2 0%, transparent 40%), linear-gradient(150deg, #211a43, #0c0c17 78%)" },
      { title: "The Penguin", genre: "Crime · Drama", art: "city", background: "radial-gradient(ellipse at 50% 35%, #586b79 0%, transparent 40%), linear-gradient(150deg, #1d2a35, #090d13 76%)" },
    ],
  },
  {
    slug: "osn",
    name: "OSN",
    mark: "O",
    tone: "service-osn",
    detail: "A mix of international entertainment",
    titles: [
      { title: "The White Lotus", genre: "Drama · Satire", art: "palace", background: "radial-gradient(ellipse at 50% 34%, #d2ac6b 0%, transparent 38%), linear-gradient(150deg, #315055, #101a20 78%)" },
      { title: "Succession", genre: "Drama", art: "palace", background: "radial-gradient(ellipse at 50% 32%, #8a7184 0%, transparent 38%), linear-gradient(150deg, #352b43, #0d1018 78%)" },
      { title: "Chernobyl", genre: "History · Drama", art: "city", background: "radial-gradient(ellipse at 50% 34%, #8a8b75 0%, transparent 38%), linear-gradient(150deg, #344039, #101313 78%)" },
      { title: "The Penguin", genre: "Crime · Drama", art: "night", background: "radial-gradient(ellipse at 50% 32%, #71514d 0%, transparent 38%), linear-gradient(150deg, #311b20, #0b0e15 78%)" },
    ],
  },
  {
    slug: "shahid",
    name: "Shahid",
    mark: "S",
    tone: "service-shahid",
    detail: "Arabic originals and much more",
    titles: [
      { title: "Al Thaman", genre: "Arabic · Drama", art: "arabic", background: "radial-gradient(ellipse at 50% 38%, #c78b5b 0%, transparent 40%), linear-gradient(150deg, #5b2b28, #171018 78%)" },
      { title: "Al Aseouf", genre: "Gulf · Period drama", art: "arabic", background: "radial-gradient(ellipse at 50% 34%, #d8b16b 0%, transparent 38%), linear-gradient(150deg, #795333, #1b1713 78%)" },
      { title: "Sikka Safar", genre: "Arabic · Comedy", art: "neon", background: "radial-gradient(ellipse at 50% 32%, #b17961 0%, transparent 38%), linear-gradient(150deg, #4c2b39, #14121a 78%)" },
      { title: "Rashash", genre: "Crime · Drama", art: "city", background: "radial-gradient(ellipse at 50% 33%, #92724d 0%, transparent 38%), linear-gradient(150deg, #3a3022, #111313 78%)" },
    ],
  },
  {
    slug: "hulu",
    name: "Hulu",
    mark: "h",
    tone: "service-hulu",
    detail: "A fresh range of shows and films",
    titles: [
      { title: "The Bear", genre: "Comedy · Drama", art: "neon", background: "radial-gradient(ellipse at 50% 32%, #c77842 0%, transparent 38%), linear-gradient(150deg, #51301d, #14100e 78%)" },
      { title: "Only Murders in the Building", genre: "Comedy · Mystery", art: "palace", background: "radial-gradient(ellipse at 50% 32%, #b4a36b 0%, transparent 38%), linear-gradient(150deg, #315144, #101714 78%)" },
      { title: "The Handmaid’s Tale", genre: "Drama · Thriller", art: "gothic", background: "radial-gradient(ellipse at 50% 30%, #ab4e4b 0%, transparent 38%), linear-gradient(150deg, #491d27, #120d13 78%)" },
      { title: "Shōgun", genre: "Historical · Drama", art: "fire", background: "radial-gradient(ellipse at 50% 31%, #bd7653 0%, transparent 38%), linear-gradient(150deg, #4b2525, #121015 78%)" },
    ],
  },
] as const;

export type StreamingPlatform = (typeof STREAMING_PLATFORMS)[number];
