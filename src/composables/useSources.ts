import { INTERNAL_SOURCES } from "@/sources";
import { LyricSourceBuilder } from "@/sources/helper";
import { computed, ref } from "vue";
import { useSettings } from "./useStorage";
import { fetch } from "@tauri-apps/plugin-http";
import { warn } from "@/utils/log";

const wrappedFetch: typeof fetch = (...args) => fetch(...args);

export const useSources = (() => {
  const sources = ref(
    INTERNAL_SOURCES.map((v, i) => {
      const source = v(wrappedFetch);
      return { id: `${i}`, source, title: source.title };
    })
  );
  const { defaultSourceId: selectedSourceId, defaultLyricSourceId: selectedLyricSourceId } = useSettings();
  const selectedSource = computed(() => sources.value.find((v) => v.id === selectedSourceId.value)!);
  const setSelectedSource = (id: any) => {
    if (sources.value.every((v) => v.id !== id)) {
      warn("source id not exist");
      return;
    }
    selectedSourceId.value = id;
  };

  const lyricSources = computed(
    () =>
      sources.value.filter((v) => v.source.findLyrics) as unknown as ((typeof sources)["value"][number] & {
        source: ReturnType<LyricSourceBuilder>;
      })[]
  );
  const selectedLyricSource = computed(() => lyricSources.value.find((v) => v.id === selectedLyricSourceId.value)!);
  const setSelectedLyricSource = (id: any) => {
    if (lyricSources.value.every((v) => v.id !== id)) {
      warn("lyric source id not exist");
      return;
    }
    selectedLyricSourceId.value = id;
  };

  // make sure selectSource is valid
  if (sources.value.every((v) => v.id !== selectedSourceId.value)) {
    setSelectedSource(sources.value[0].id);
  }
  if (sources.value.every((v) => v.id !== selectedLyricSourceId.value)) {
    setSelectedLyricSource(lyricSources.value[0].id);
  }
  return () => ({
    sources,
    selectedSource,
    setSelectedSource,

    lyricSources,
    selectedLyricSource,
    setSelectedLyricSource,
  });
})();
