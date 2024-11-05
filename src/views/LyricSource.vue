<script lang="ts" setup>
import { ref } from "vue";
import { toasts } from "@/composables/useToast";
import { useSources } from "@/composables/useSources";
import { useLoading } from "@/composables/useGlobalLoading";
import { FindSongParams } from "@/sources/helper";

const props = defineProps<{
  input: FindSongParams;
  exit: (v: any) => void;
}>();

const { domRef: loadingRef, controller: loading } = useLoading();
const { selectedLyricSource } = useSources();
const searchResults = ref<any[]>();
const load = async () => {
  loading.show();
  try {
    const source = selectedLyricSource.value.source;
    const results = await source.findLyrics(props.input);
    searchResults.value = results;
  } catch (error) {
    toasts.error(`${error}`);
  } finally {
    loading.dismiss();
  }
};
load();

const toApply = (result: any) => {
  props.exit(result);
};
</script>
<template>
  <div ref="loadingRef" class="overflow-hidden h-full flex flex-col">
    <div class="h-8 p-2">{{ $t("search-results") }}</div>
    <div class="flex-1 min-w-[300px] w-[80vw] max-w[500px] flex flex-col overflow-y-auto">
      <template v-for="(result, index) in searchResults" :key="index">
        <div class="flex p-2 gap-2 items-center">
          <div class="flex-1 h-20 rounded border p-1 overflow-y-auto whitespace-pre">
            {{ result.lyric }}
          </div>
          <div class="flex-shrink-0 text-xs">
            <button data-type="primary" class="button" @click="toApply(result)">{{ $t("apply") }}</button>
          </div>
        </div>
        <hr />
      </template>
    </div>
  </div>
  <!-- <LoadingWrapper /> -->
</template>
