import { computed, ref } from "vue";
import { CommmonTags, CommonTag } from "../utils/music";
import { IAudioMetadata, ITag, orderTags, parseBuffer } from "music-metadata";
import { fetchFileWithMimeType, updateMetadata } from "../utils/file";
import { ID3Writer } from "browser-id3-writer";

export type MusicTags = {
  title: string;
  artist: string;
  album: string;
};

export type EditableMusicTags = Awaited<ReturnType<typeof transformTags>>;

// export type EditableMusic = {
//   path: string;
//   name: string;
//   tags: () => Promise<EditableMusicTags>;
//   update: (v: Partial<CommonTag>) => Promise<any>;
// };

const transformTags = (meta: IAudioMetadata) => {
  return Promise.all(
    CommmonTags.map(async (e) => {
      return {
        ...e,
        value: await e.getValue(meta),
      };
    })
  );
};

export class EditableMusic{
  static async create(file: Uint8Array, path: string, name: string){
    const meta = await parseBuffer(file);
    return new EditableMusic(file,path,name,meta)
  }
  constructor(private file: Uint8Array, public path: string, public name: string,private meta:IAudioMetadata){

  }

  private innerTags:Awaited<ReturnType<typeof transformTags>> | undefined = undefined
  async tags() {
    if(this.innerTags!==undefined){
      return this.innerTags
    }
    const v = await transformTags(this.meta);
    this.innerTags = v;
    return v;
  }

  async update (v: Partial<CommonTag>)  {
    console.log("start update...")
    const writer = new ID3Writer(this.file);
    const natives: ITag[] = [...(Object.values(this.meta.native)[0] ?? [])];
    for await (const item of Object.entries(v)) {
      const [label, value] = item;
      const tag = this.innerTags?.find((c) => c.label === label);
      const result = await tag?.setValue(value, writer, tag.value);
      if (!result) {
        break;
      }
      const exsitedIndex = natives.findIndex((t) => t?.id === result?.id);
      if (exsitedIndex !== -1) {
        natives[exsitedIndex] = result;
      } else {
        natives.push(result);
      }
    }
    natives.forEach((itag) => {
      if (!itag) return;
      writer.setFrame(itag.id as any, itag.value as any);
    });

    const buffer = writer.addTag();

    this.file = new Uint8Array(buffer)
    this.meta = await parseBuffer(this.file)
    return buffer;
  }
}

export const useMusicList = (() => {
  // const parseMusice = async (file: Uint8Array, path: string, name: string) => {
  //   const meta = await parseBuffer(file);
  //   let innerV: Awaited<ReturnType<typeof transformTags>> | undefined = undefined;
  //   const getTransformedTags = async () => {
  //     const v = await transformTags(meta);
  //     console.log(v, "tags", meta);
  //     innerV = v;
  //     return v;
  //   };
  //   return {
  //     path: path,
  //     name: name,
  //     tags: getTransformedTags,
  //     update: async (v: Partial<CommonTag>) => {
  //       console.log("start update...")
  //       const writer = new ID3Writer(file);
  //       const natives: ITag[] = [...(Object.values(meta.native)[0] ?? [])];
  //       for await (const item of Object.entries(v)) {
  //         const [label, value] = item;
  //         const tag = innerV?.find((c) => c.label === label);
  //         console.log('tag sss:',tag?.label,JSON.stringify(natives))
  //         const result = await tag?.setValue(value, writer, tag.value);
  //         console.log('tag ressss',result)
  //         if (!result) {
  //           break;
  //         }
  //         const exsitedIndex = natives.findIndex((t) => t?.id === result?.id);
  //         if (exsitedIndex !== -1) {
  //           natives[exsitedIndex] = result;
  //         } else {
  //           natives.push(result);
  //         }
  //       }
  //       // await Promise.all(
  //       //   Object.entries(v).map(([label, value]) => {
  //       //     const tag = innerV?.find((c) => c.label === label);
  //       //     console.log("changed:",tag?.label,value,tag?.value)
  //       //     return tag?.setValue(value, writer, tag.value);
  //       //   })
  //       // );
  //       console.log("xxxx");
  //       natives.forEach((itag) => {
  //         if (!itag) return;
  //         writer.setFrame(itag.id as any, itag.value as any);
  //       });
  //       console.log("hi");

  //       const buffer = writer.addTag();
  //       console.log("after buffer", buffer);
  //       return buffer;
  //     },
  //   };
  // };
  const addMusic = async (file: Uint8Array, path: string, name: string) => {
    const index = list.value.findIndex((f) => f.path === path);
    const item = await EditableMusic.create(file, path, name);
    if (index !== -1) {
      list.value[index] = item;
      return;
    }
    list.value.push(item);
  };

  const list = ref([] as EditableMusic[]);

  const selectedKey = ref<string>();
  const toSelect = (key: string) => {
    selectedKey.value = key;
  };
  const selected = computed(() => list.value.find((v) => v.path === selectedKey.value) as EditableMusic|undefined);

  return () => ({
    list,
    addMusic,
    selected,
    toSelect,
  });
})();
