<script lang="ts" setup>
import { ref } from "vue";
import { CommonTag } from "@/utils/music";
import useLoading from "@/ui/loading";
import { toasts } from "@/composables/useToast";
import { useSources } from "@/composables/useSources";
import { FindSongReturned } from "@/sources/helper";
import { usePopcon } from "@/ui/popcon";
import MoreDetail from "@/views/MoreDetail.vue";

const props = defineProps<{
  input: Partial<CommonTag>;
  exit: (v: Partial<CommonTag>) => void;
}>();

const { domRef: loadingRef, controller: loading, visible: isLoading } = useLoading();
const { selectedSource } = useSources();

const searchResults = ref<FindSongReturned[]>();
const load = async () => {
  loading.show();
  try {
    const source = selectedSource.value.source;
    const results = await source.findSongs(props.input);
    searchResults.value = results;
  } catch (error) {
    toasts.error(`${error}`);
  } finally {
    loading.dismiss();
  }
};
load();

const toApply = (result: FindSongReturned) => {
  props.exit(result.song);
};

const [showMoreDetail, MoreDetailPop] = usePopcon<Partial<CommonTag>, FindSongReturned>();
const toSeeMore = async (result: FindSongReturned) => {
  const detail = await showMoreDetail(result);
  if (detail === undefined) {
    return;
  }
  props.exit(detail);
};
</script>
<template>
  <div ref="loadingRef" class="overflow-hidden h-full flex flex-col">
    <div class="h-8 p-2">{{ $t("search-results") }}</div>
    <div class="flex-1 min-w-[300px] w-[80vw] max-w[500px] flex flex-col overflow-y-auto">
      <template v-if="searchResults?.length">
        <div v-for="(result, index) in searchResults" :key="index" class="flex p-2">
          <div class="flex flex-1 gap-2">
            <img :src="result.song.cover" width="48" height="48" />
            <div class="flex flex-col gpa-2">
              <div class="text-sm font-semibold">{{ result.song.title }}</div>
              <div class="flex flex-col text-xs text-text text-opacity-80">
                <div>{{ $t("artist-result-song-artist", [result.song.artist]) }}</div>
                <div>{{ $t("album-result-song-album", [result.song.album]) }}</div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <button v-if="selectedSource.source.getMoreDetail" class="button" @click="toSeeMore(result)">
              {{ $t("more") }}
            </button>
            <button class="button" data-type="primary" @click="toApply(result)">
              {{ $t("apply") }}
            </button>
          </div>
        </div>
      </template>
      <div v-else-if="!isLoading" class="w-full h-full flex justify-center items-center">
        {{ $t("no-results") }}
      </div>
    </div>
    <MoreDetailPop>
      <template #default="binded">
        <MoreDetail :input="binded.input" :exit="binded.exit" />
      </template>
    </MoreDetailPop>
  </div>
</template>
