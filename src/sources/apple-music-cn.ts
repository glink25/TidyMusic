import { CommonTag } from "@/utils/music";
import { SourceBuilder } from "./helper";

const search = async (fetcher: typeof fetch, s: string) => {
  // const amu = `https://music.apple.com/cn/search?term=${encodeURIComponent(s)}`;
  const itu = `https://itunes.apple.com/search?country=cn&term=${encodeURIComponent(s)}`;
  const resp = await fetcher(itu, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9",
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "u=0, i",
      "sec-ch-ua": '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  // const resp = await fetch(`https://music.163.com/api/search/pc?offset=0&limit=10&type=1&s=${encodeURIComponent(s)}`)
  const json: any = await resp.json();
  console.log("search json:", json);
  return json.results?.map((song: any) => ({
    song: {
      title: song.trackName,
      artist: song.artistName,
      album: song.collectionName,
      cover: song.artworkUrl100,
      lyric: "",
      genre: song.primaryGenreName,
      comment: `itunesId:${song.trackId}`,
    },
  }));
};

export const createAppleMusicSource: SourceBuilder = (fetcher) => {
  const findSongs = async (params: Partial<CommonTag>) => {
    const { title, artist } = params;
    if (title === undefined && artist === undefined) {
      return [];
    }
    const results = await search(fetcher, [title, artist].join("+"));
    console.log(results, "results");
    return results;
  };

  return {
    findSongs,
    title: "apple music cn",
  };
};
