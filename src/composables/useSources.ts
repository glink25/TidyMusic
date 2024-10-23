import { INTERNAL_SOURCES } from "@/sources";
import { computed, ref } from "vue";

export const useSources = (() => {
  const sources = ref(
    INTERNAL_SOURCES.map((v, i) => {
      const source = v();
      return { id: `${i}`, source, title: source.title };
    })
  );
  const selectedSourceId = ref(sources.value[0].id);
  const selectedSource = computed(() => sources.value.find((v) => v.id === selectedSourceId.value)!);
  const setSelectedSource = (id: any) => {
    console.log(id, sources);
    if (sources.value.every((v) => v.id !== id)) {
      console.warn("source id not exist");
      return;
    }
    selectedSourceId.value = id;
  };

  const lyricSources = computed(() => sources.value.filter((v) => v.source.findLyrics));
  const selectedLyricSourceId = ref(lyricSources.value[0].id);
  const selectedLyricSource = computed(() => lyricSources.value.find((v) => v.id === selectedLyricSourceId.value)!);
  const setSelectedLyricSource = (id: any) => {
    if (lyricSources.value.every((v) => v.id !== id)) {
      console.warn("lyric source id not exist");
      return;
    }
    selectedLyricSourceId.value = id;
  };
  return () => ({
    sources,
    selectedSource,
    setSelectedSource,

    lyricSources,
    selectedLyricSource,
    setSelectedLyricSource,
  });
})();
