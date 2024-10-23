import { createAppleMusicSource } from "./apple-music-cn";
import { createNeteaseSource } from "./netease";

export const INTERNAL_SOURCES = [createNeteaseSource, createAppleMusicSource];
