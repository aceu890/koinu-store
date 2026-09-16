export type LibrarySticker = {
  id: string;
  src: string;
  thumb: string;
  label: string;
  width: number;
  height: number;
};

export type StickerPack = {
  id: string;
  name: string;
  stickers: LibrarySticker[];
};

function stickers(
  pack: string,
  items: {
    id: string;
    file: string;
    thumb: string;
    label: string;
    width: number;
    height: number;
  }[],
): LibrarySticker[] {
  return items.map((item) => ({
    id: item.id,
    src: `/Stickers/${pack}/${encodeURIComponent(item.file)}`,
    thumb: `/Stickers/${pack}/thumbs/${item.thumb}`,
    label: item.label,
    width: item.width,
    height: item.height,
  }));
}

export const STICKER_PACKS: StickerPack[] = [
  {
    id: "anime",
    name: "Anime",
    stickers: stickers("anime", [
      {
        id: "one-piece",
        file: "One Piece.png",
        thumb: "one-piece.webp",
        label: "One Piece",
        width: 1248,
        height: 2160,
      },
      {
        id: "anime-00",
        file: "pngwing.com.png",
        thumb: "anime-00.webp",
        label: "Anime",
        width: 767,
        height: 1041,
      },
      {
        id: "anime-01",
        file: "pngwing.com (1).png",
        thumb: "anime-01.webp",
        label: "Anime 1",
        width: 1808,
        height: 2809,
      },
      {
        id: "anime-02",
        file: "pngwing.com (2).png",
        thumb: "anime-02.webp",
        label: "Anime 2",
        width: 1300,
        height: 1482,
      },
      {
        id: "anime-03",
        file: "pngwing.com (3).png",
        thumb: "anime-03.webp",
        label: "Anime 3",
        width: 1000,
        height: 880,
      },
      {
        id: "anime-04",
        file: "pngwing.com (4).png",
        thumb: "anime-04.webp",
        label: "Anime 4",
        width: 1024,
        height: 1843,
      },
      {
        id: "anime-05",
        file: "pngwing.com (5).png",
        thumb: "anime-05.webp",
        label: "Anime 5",
        width: 745,
        height: 1053,
      },
      {
        id: "anime-06",
        file: "pngwing.com (6).png",
        thumb: "anime-06.webp",
        label: "Anime 6",
        width: 664,
        height: 1204,
      },
      {
        id: "anime-07",
        file: "pngwing.com (7).png",
        thumb: "anime-07.webp",
        label: "Anime 7",
        width: 2000,
        height: 617,
      },
      {
        id: "anime-08",
        file: "pngwing.com (8).png",
        thumb: "anime-08.webp",
        label: "Anime 8",
        width: 1170,
        height: 1600,
      },
      {
        id: "anime-09",
        file: "pngwing.com (9).png",
        thumb: "anime-09.webp",
        label: "Anime 9",
        width: 923,
        height: 865,
      },
      {
        id: "anime-10",
        file: "pngwing.com (10).png",
        thumb: "anime-10.webp",
        label: "Anime 10",
        width: 482,
        height: 750,
      },
      {
        id: "anime-11",
        file: "pngwing.com (11).png",
        thumb: "anime-11.webp",
        label: "Anime 11",
        width: 530,
        height: 600,
      },
      {
        id: "anime-12",
        file: "pngwing.com (12).png",
        thumb: "anime-12.webp",
        label: "Anime 12",
        width: 1254,
        height: 1254,
      },
      {
        id: "anime-13",
        file: "pngwing.com (13).png",
        thumb: "anime-13.webp",
        label: "Anime 13",
        width: 675,
        height: 1280,
      },
      {
        id: "anime-14",
        file: "pngwing.com (14).png",
        thumb: "anime-14.webp",
        label: "Anime 14",
        width: 2940,
        height: 3676,
      },
      {
        id: "anime-15",
        file: "pngwing.com (15).png",
        thumb: "anime-15.webp",
        label: "Anime 15",
        width: 580,
        height: 725,
      },
      {
        id: "anime-16",
        file: "pngwing.com (16).png",
        thumb: "anime-16.webp",
        label: "Anime 16",
        width: 821,
        height: 698,
      },
      {
        id: "anime-17",
        file: "pngwing.com (17).png",
        thumb: "anime-17.webp",
        label: "Anime 17",
        width: 720,
        height: 1010,
      },
      {
        id: "anime-18",
        file: "pngwing.com (18).png",
        thumb: "anime-18.webp",
        label: "Anime 18",
        width: 900,
        height: 900,
      },
      {
        id: "anime-19",
        file: "pngwing.com (19).png",
        thumb: "anime-19.webp",
        label: "Anime 19",
        width: 1600,
        height: 1600,
      },
      {
        id: "anime-20",
        file: "pngwing.com (20).png",
        thumb: "anime-20.webp",
        label: "Anime 20",
        width: 700,
        height: 964,
      },
      {
        id: "anime-21",
        file: "pngwing.com (21).png",
        thumb: "anime-21.webp",
        label: "Anime 21",
        width: 385,
        height: 755,
      },
      {
        id: "anime-22",
        file: "pngwing.com (22).png",
        thumb: "anime-22.webp",
        label: "Anime 22",
        width: 565,
        height: 551,
      },
    ]),
  },
  {
    id: "peliculas",
    name: "Películas",
    stickers: stickers("peliculas", [
      {
        id: "peliculas-00",
        file: "pngwing.com.png",
        thumb: "peliculas-00.webp",
        label: "Películas",
        width: 896,
        height: 1000,
      },
      {
        id: "peliculas-01",
        file: "pngwing.com (1).png",
        thumb: "peliculas-01.webp",
        label: "Películas 1",
        width: 607,
        height: 800,
      },
      {
        id: "peliculas-02",
        file: "pngwing.com (2).png",
        thumb: "peliculas-02.webp",
        label: "Películas 2",
        width: 636,
        height: 1000,
      },
      {
        id: "peliculas-03",
        file: "pngwing.com (3).png",
        thumb: "peliculas-03.webp",
        label: "Películas 3",
        width: 1024,
        height: 804,
      },
      {
        id: "peliculas-04",
        file: "pngwing.com (4).png",
        thumb: "peliculas-04.webp",
        label: "Películas 4",
        width: 838,
        height: 879,
      },
      {
        id: "peliculas-05",
        file: "pngwing.com (5).png",
        thumb: "peliculas-05.webp",
        label: "Películas 5",
        width: 1024,
        height: 633,
      },
      {
        id: "peliculas-06",
        file: "pngwing.com (6).png",
        thumb: "peliculas-06.webp",
        label: "Películas 6",
        width: 521,
        height: 769,
      },
      {
        id: "peliculas-07",
        file: "pngwing.com (7).png",
        thumb: "peliculas-07.webp",
        label: "Películas 7",
        width: 800,
        height: 722,
      },
    ]),
  },
  {
    id: "infantil",
    name: "Infantil",
    stickers: stickers("infantil", [
      {
        id: "infantil-00",
        file: "pngwing.com.png",
        thumb: "infantil-00.webp",
        label: "Infantil",
        width: 571,
        height: 640,
      },
      {
        id: "infantil-01",
        file: "pngwing.com (1).png",
        thumb: "infantil-01.webp",
        label: "Infantil 1",
        width: 1751,
        height: 1740,
      },
      {
        id: "infantil-02",
        file: "pngwing.com (2).png",
        thumb: "infantil-02.webp",
        label: "Infantil 2",
        width: 2177,
        height: 3000,
      },
      {
        id: "infantil-03",
        file: "pngwing.com (3).png",
        thumb: "infantil-03.webp",
        label: "Infantil 3",
        width: 500,
        height: 750,
      },
      {
        id: "infantil-04",
        file: "pngwing.com (4).png",
        thumb: "infantil-04.webp",
        label: "Infantil 4",
        width: 1222,
        height: 900,
      },
      {
        id: "infantil-05",
        file: "pngwing.com (5).png",
        thumb: "infantil-05.webp",
        label: "Infantil 5",
        width: 1016,
        height: 1200,
      },
      {
        id: "infantil-23",
        file: "pngwing.com (23).png",
        thumb: "infantil-23.webp",
        label: "Infantil 23",
        width: 2048,
        height: 1740,
      },
    ]),
  },
];

export const STICKER_DRAG_TYPE = "application/x-koinu-sticker";

export function getLibrarySticker(id: string) {
  for (const pack of STICKER_PACKS) {
    const found = pack.stickers.find((sticker) => sticker.id === id);
    if (found) return found;
  }
  return null;
}
