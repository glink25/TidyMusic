import { ID3Writer } from "browser-id3-writer";
import { IAudioMetadata, parseBuffer, ITag } from "music-metadata";
import { CommonTags, CommonTag } from "@/utils/music";

export type MusicTags = {
  title: string;
  artist: string;
  album: string;
};

export type EditableMusicTags = Awaited<ReturnType<typeof transformTags>>;

const transformTags = (meta: IAudioMetadata) => {
  return Promise.all(
    CommonTags.map(async (e) => {
      return {
        ...e,
        value: await e.getValue(meta),
      };
    })
  );
};

export default class Song {
  constructor(public path: string, public name: string, private file: () => Promise<Uint8Array>) {}

  private innerFile: Uint8Array | undefined = undefined;
  private async getFile() {
    if (this.innerFile !== undefined) {
      return this.innerFile;
    }
    this.innerFile = await this.file();
    return this.innerFile;
  }

  private innerMeta: IAudioMetadata | undefined = undefined;
  private async getMeta() {
    if (this.innerMeta !== undefined) {
      return this.innerMeta;
    }
    const file = await this.getFile();
    this.innerMeta = await parseBuffer(file);
    return this.innerMeta;
  }

  private innerTags: Awaited<ReturnType<typeof transformTags>> | undefined = undefined;
  async getTags() {
    if (this.innerTags !== undefined) {
      return this.innerTags;
    }
    const meta = await this.getMeta();
    const v = await transformTags(meta);
    this.innerTags = v;
    return v;
  }

  async update(v: Partial<CommonTag>) {
    const file = await this.getFile();
    const meta = await this.getMeta();
    const tags = await this.getTags();
    const writer = new ID3Writer(file);
    // 兼容id-writer和music-metadata的格式转换
    const originalNatives: ITag[] = [...(Object.values(meta.native)[0] ?? [])].map((v) => {
      if (v.id === "TCON" || v.id === "TCOM") {
        return {
          ...v,
          value: [v.value].flat(),
        };
      }
      return v;
    });
    console.log("originalNatives", originalNatives);
    const filteredNatives = originalNatives.filter((v) => validFrameNames.includes(v.id));
    const canSafeUpdate = filteredNatives.length === originalNatives.length;
    const diffs = originalNatives.filter((v) => filteredNatives.every((x) => x.id !== v.id));
    const next = async () => {
      for await (const item of Object.entries(v)) {
        const [label, value] = item;
        const tag = tags?.find((c) => c.label === label);
        const result = await tag?.setValue(value, writer, tag.value);
        if (!result) {
          continue;
        }
        const existedIndex = filteredNatives.findIndex((t) => t?.id === result?.id);
        if (existedIndex !== -1) {
          filteredNatives[existedIndex] = result;
        } else {
          filteredNatives.push(result);
        }
      }
      filteredNatives.forEach((itag) => {
        if (!itag || itag.value === undefined) return;
        writer.setFrame(itag.id as any, itag.value as any);
      });

      const buffer = writer.addTag();
      this.clearCache();
      this.file = async () => new Uint8Array(buffer);
      return buffer;
    };
    return [canSafeUpdate, next, diffs] as const;
  }

  private clearCache() {
    this.innerFile = undefined;
    this.innerMeta = undefined;
    this.innerTags = undefined;
  }
}

const validFrameNames = [
  "TPE1",
  "TCOM",
  "TCON", // song artists, composers, genres
  "TLAN",
  "TIT1",
  "TIT2",
  "TIT3",
  "TALB",
  "TPE2",
  "TPE3",
  "TPE4",
  "TRCK",
  "TPOS",
  "TMED",
  "TPUB",
  "TCOP",
  "TKEY",
  "TEXT",
  "TDAT",
  "TSRC", // various string frames
  "TBPM",
  "TLEN",
  "TYER", // beats per minute, duration, year
  "USLT", // unsynchronised lyrics
  "APIC", // song cover
  "TXXX", // user defined text information
  "WCOM",
  "WCOP",
  "WOAF",
  "WOAR",
  "WOAS",
  "WORS",
  "WPAY",
  "WPUB", // URL link frames
  "COMM", // comments
  "PRIV", // private frame
  "IPLS", // involved people
  "SYLT", // synchronised lyrics
];
