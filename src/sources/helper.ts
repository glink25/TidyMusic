import { CommonTag } from "@/utils/music";

export type FindSongReturned = Record<string, any> & { song: Partial<CommonTag>; more?: boolean };

export type SourceBuilder = (fetcher: typeof fetch) => {
  findLyrics?: (tag: Partial<CommonTag>) => Promise<Lyric[]>;
  findSongs: (tag: Partial<CommonTag>) => Promise<FindSongReturned[]>;
  getMoreDetail?: (info: FindSongReturned) => Promise<Partial<CommonTag>>;
  title: string;
};

export type LyricSourceBuilder = (...args: Parameters<SourceBuilder>) => Required<ReturnType<SourceBuilder>>;

export type Lyric = { lyric: string };
