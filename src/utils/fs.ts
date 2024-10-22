import { convertFileSrc } from "@tauri-apps/api/core";
import { BaseDirectory, join } from "@tauri-apps/api/path";
import { DirEntry, readDir, readFile, writeFile } from "@tauri-apps/plugin-fs";
import { open } from "@tauri-apps/plugin-dialog";

export type OpenedFile = {
  fullpath: string;
  data: () => Promise<Uint8Array>;
} & DirEntry;

const recursiveReadDir = async (dir: string, handler: (file: OpenedFile) => Promise<any>): Promise<any> => {
  const entries = await readDir(dir, { baseDir: BaseDirectory.AppLocalData });
  // console.log("readdir:", dir, entries);
  return await Promise.allSettled(
    entries.map(async (entry) => {
      const fullpath = await join(dir, entry.name);
      if (entry.isDirectory) {
        return await recursiveReadDir(fullpath, handler);
      }
      if (entry.isFile) {
        // console.log("readfile:", fullpath);
        return await handler({
          ...entry,
          fullpath,
          data: () => readFile(fullpath),
        });
      }
    })
  );
};

export const recursiveOpen = async (handler: (file: OpenedFile) => Promise<any>) => {
  const folder = await open({ directory: true });
  if (!folder) return;
  return await recursiveReadDir(folder, handler).catch((err) => console.error(err));
};

export const saveFile = async (path: string, buffer: any) => {
  return await writeFile(path, buffer);
};

export const saveFileToDownloadFolder = async (name: string, buffer: any) => {
  return await writeFile(name, buffer, { baseDir: BaseDirectory.Download });
};

export const pickFile = async <M extends boolean>({ multiple, accept }: { multiple: M; accept: string[] }) => {
  const files = await open({
    multiple: multiple,
    filters: [{ name: "file", extensions: accept }],
  });
  if (!files) {
    throw new Error("no file select");
  }
  // return await Promise.all([files].flat().map((f) => readFile(f)));
  return [files].flat().map((v) => convertFileSrc(v));
};
