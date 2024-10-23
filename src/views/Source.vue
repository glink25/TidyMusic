<script lang="ts" setup>
import { ref } from "vue";
import { CommonTag } from "@/utils/music";
import useLoading from "@/ui/loading";
import { toasts } from "@/composables/useToast";
import { useSources } from "@/composables/useSources";

const props = defineProps<{
  input: Partial<CommonTag>;
  exit: (v: any) => void;
}>();

const { domRef: loadingRef, controller: loading } = useLoading();
const { selectedSource } = useSources();

const searchResults = ref<any[]>();
const load = async () => {
  loading.show();
  try {
    const source = selectedSource.value.source;
    const results = await source.findList(props.input);
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
    <div class="h-8 p-2">Search Results:</div>
    <div class="flex-1 min-w-[300px] w-[80vw] max-w[500px] flex flex-col overflow-y-auto">
      <div v-for="(result, index) in searchResults" :key="index" class="flex p-2">
        <div class="flex flex-1 gap-2">
          <img :src="result.cover" width="48" height="48" />
          <div class="flex flex-col gpa-2">
            <div class="text-sm font-semibold">{{ result.title }}</div>
            <div class="flex flex-col text-xs text-black text-opacity-80">
              <div>artist: {{ result.artist }}</div>
              <div>album: {{ result.album }}</div>
            </div>
          </div>
        </div>
        <div>
          <button class="button" @click="toApply(result)">Use this</button>
        </div>
      </div>
    </div>
  </div>
  <!-- <LoadingWrapper /> -->
</template>
