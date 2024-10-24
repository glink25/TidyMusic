import { createAppleMusicSource } from "./apple-music-cn";
import { SourceBuilder } from "./helper";
import { createNeteaseSource } from "./netease";

export const INTERNAL_SOURCES: SourceBuilder[] = [createNeteaseSource, createAppleMusicSource];
