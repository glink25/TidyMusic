import { IAudioMetadata, ITag, selectCover } from "music-metadata";
import { fetchFileWithMimeType } from "@/utils/file";
import { ID3Writer } from "browser-id3-writer";

export enum MusicTagFormat {
  text,
  cover,
  lyric,
  // genre,
}

export const CommonTags = [
  {
    label: "title",
    format: MusicTagFormat.text,
    getValue: async (tag: IAudioMetadata) => tag.common.title,
    setValue: async (value: string | undefined, writer: ID3Writer, curValue: any): Promise<ITag | undefined> => {
      return {
        id: "TIT2",
        value,
      };
    },
  },
  {
    label: "artist",
    format: MusicTagFormat.text,
    getValue: async (tag: IAudioMetadata) => tag.common.artist,
    setValue: async (value: string | undefined, writer: ID3Writer, curValue: any): Promise<ITag | undefined> => {
      return {
        id: "TPE1",
        value: [value],
      };
    },
  },
  {
    label: "album",
    format: MusicTagFormat.text,
    getValue: async (tag: IAudioMetadata) => tag.common.album,
    setValue: async (value: string | undefined, writer: ID3Writer, curValue: any): Promise<ITag | undefined> => {
      return {
        id: "TALB",
        value,
      };
    },
  },
  {
    label: "comment",
    format: MusicTagFormat.text,
    getValue: async (tag: IAudioMetadata) => tag.common.comment?.[0]?.text,
    setValue: async (value: string | undefined, writer: ID3Writer, curValue: any): Promise<ITag | undefined> => {
      if (value === undefined) {
        return {
          id: "COMM",
          value,
        };
      }
      return {
        id: "COMM",
        value: {
          description: "",
          text: value,
        },
      };
    },
  },
  {
    label: "cover",
    format: MusicTagFormat.cover,
    getValue: async (tag: IAudioMetadata) => {
      const cover = selectCover(tag.common.picture);
      if (!cover) return;
      const data = cover.data;
      if (!data) {
        return;
      }
      const blob = new Blob([new Uint8Array(data)], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      return url;
    },
    setValue: async (value: string | undefined, writer: ID3Writer, curValue: any): Promise<ITag | undefined> => {
      if (value === undefined) {
        return {
          id: "APIC",
          value: undefined,
        };
      }
      const { content } = await fetchFileWithMimeType(value ?? curValue);
      if (value.startsWith("blob:") && value !== curValue) {
        URL.revokeObjectURL(value);
      }
      // const mime = originMime.includes('jpg') ? 'image/jpeg' :originMime
      return {
        id: "APIC",
        value: {
          description: "",
          type: 3,
          data: content,
        },
      };
    },
  },
  {
    label: "lyric",
    format: MusicTagFormat.lyric,
    getValue: async (tag: IAudioMetadata) => tag.common.lyrics?.[0].text,
    setValue: async (value: string | undefined, writer: ID3Writer, curValue: any): Promise<ITag | undefined> => {
      if (value === undefined) {
        return {
          id: "USLT",
          value: undefined,
        };
      }
      return {
        id: "USLT",
        value: {
          description: "",
          language: "",
          lyrics: value,
        },
      };
    },
  },
  // {
  //   label: "genre",
  //   format: MusicTagFormat.genre,
  //   getValue: async(tag: MP3TagTags, _meta: () => Promise<IAudioMetadata>) => tag.v2?.TCON,
  // },
  // {
  //   label: "years",
  //   format: MusicTagFormat.text,
  //   getValue: async(tag: MP3TagTags, _meta: () => Promise<IAudioMetadata>) => tag.v2?.TALB,
  // },
] as const;

export type CommonTagLabel = (typeof CommonTags)[number]["label"];

type Item = (typeof CommonTags)[number];

export type CommonTagValue<K extends CommonTagLabel> = Awaited<ReturnType<Extract<Item, { label: K }>["getValue"]>>;

export type CommonTag = { [k in CommonTagLabel]: CommonTagValue<k> };

export const CommonTagLabels = CommonTags.map((t) => t.label) as CommonTagLabel[];

export const isMusic = (name: string) => [".mp3", ".acc"].some((ext) => name.toLowerCase().endsWith(ext));
