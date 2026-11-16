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
      { title: "Stiletto", genre: "Arabic · Drama", art: "gothic", background: "radial-gradient(ellipse at 50% 32%, #b1798f 0%, transparent 38%), linear-gradient(150deg, #442338, #14121a 78%)" },
      { title: "Salon Zahra", genre: "Arabic · Comedy", art: "neon", background: "radial-gradient(ellipse at 50% 32%, #b17961 0%, transparent 38%), linear-gradient(150deg, #4c2b39, #14121a 78%)" },
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

export const POSTER_IMAGES: Record<string, { imageUrl: string; sourceUrl: string }> = {
  "Stranger Things": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/595/1489169.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/2993/stranger-things",
  },
  Wednesday: {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/586/1466410.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/53647/wednesday",
  },
  "Squid Game": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/576/1440521.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/43687/squid-game",
  },
  "The Night Agent": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/614/1536331.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/56512/the-night-agent",
  },
  "The Last of Us": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/563/1409008.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/46562/the-last-of-us",
  },
  "House of the Dragon": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/627/1568449.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/44778/house-of-the-dragon",
  },
  Euphoria: {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/621/1552657.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/28826/euphoria",
  },
  "The Penguin": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/536/1340329.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/60920/the-penguin",
  },
  "The White Lotus": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/557/1393876.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/51394/the-white-lotus",
  },
  Succession: {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/453/1134275.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/23470/succession",
  },
  Chernobyl: {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/193/482599.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/30770/chernobyl",
  },
  "Al Thaman": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/445/1114669.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/66852/al-thaman",
  },
  Stiletto: {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/420/1052424.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/63913/stiletto",
  },
  "Salon Zahra": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/411/1029457.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/62387/salon-zahra",
  },
  Rashash: {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/419/1048889.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/63658/rashash",
  },
  "The Bear": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/629/1574642.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/54198/the-bear",
  },
  "Only Murders in the Building": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/586/1466415.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/48830/only-murders-in-the-building",
  },
  "The Handmaid’s Tale": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/562/1406667.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/16579/the-handmaids-tale",
  },
  "Shōgun": {
    imageUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/506/1265637.jpg",
    sourceUrl: "https://www.tvmaze.com/shows/37336/shogun",
  },
};
