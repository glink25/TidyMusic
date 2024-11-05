import { CommonTag } from "@/utils/music";

export type FindSongReturned = Record<string, unknown> & {
  song: Partial<CommonTag>;
  file?: { duration?: number };
  more?: boolean;
};
export type FindSongParams = { tags: Partial<CommonTag>; file: { name: string; duration?: number } };

export type SourceBuilder = (fetcher: typeof fetch) => {
  findLyrics?: (tag: FindSongParams) => Promise<Lyric[]>;
  findSongs: (tag: FindSongParams) => Promise<FindSongReturned[]>;
  getMoreDetail?: (info: FindSongReturned) => Promise<Partial<CommonTag>>;
  title: string;
};

export type LyricSourceBuilder = (...args: Parameters<SourceBuilder>) => Required<ReturnType<SourceBuilder>>;

export type Lyric = { lyric: string };
