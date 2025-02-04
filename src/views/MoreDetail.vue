<script lang="ts" setup>
import { useLoading } from "@/composables/useGlobalLoading";
import { useSources } from "@/composables/useSources";
import { toasts } from "@/composables/useToast";
import { FindSongReturned } from "@/sources/helper";
import { CommonTag } from "@/utils/music";
import { ref } from "vue";

const props = defineProps<{
  input: FindSongReturned;
  exit: (v: Partial<CommonTag> | undefined) => void;
}>();

const { controller: loading, domRef, visible: isLoading } = useLoading();
const { selectedSource } = useSources();

const detail = ref<Partial<CommonTag>>();
const load = async () => {
  loading.show();
  try {
    const source = selectedSource.value.source;
    const results = await source.getMoreDetail?.(props.input);
    detail.value = results;
  } catch (error) {
    toasts.error(`${error}`);
  } finally {
    loading.dismiss();
  }
};
load();

const toCancel = () => {
  props.exit(undefined);
};
const toApply = () => {
  props.exit(detail.value);
};
</script>
<template>
  <div ref="domRef" class="w-[240px] overflow-hidden p-2 flex flex-col gap-2">
    <div class="h-8 flex items-center">{{ $t("detail") }}</div>
    <div v-if="detail" class="flex flex-col items-center gap-2">
      <img v-if="detail.cover" :src="detail.cover" alt="" class="w-[120px] h-[120px]" />
      <div class="flex flex-col items-center">
        <div class="text-xs pb-1">{{ $t("title:") }}</div>
        <div class="text-sm rounded px-2 py-1 sinked">
          {{ detail.title }}
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="text-xs pb-1">{{ $t("artist:") }}</div>
        <div class="text-sm rounded px-2 py-1 sinked">{{ detail.artist }}</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="text-xs pb-1">{{ $t("album:") }}</div>
        <div class="text-sm rounded px-2 py-1 sinked">{{ detail.album }}</div>
      </div>
      <div class="max-h-[120px] flex flex-col items-center">
        <div class="text-xs pb-1">{{ $t("lyric:") }}</div>
        <div class="flex-1 overflow-y-auto text-sm rounded p-2 sinked">
          {{ detail.lyric }}
        </div>
      </div>
      <div class="flex gap-2 text-xs">
        <button class="button" @click="toCancel">{{ $t("cancel") }}</button>
        <button class="button" data-type="primary" @click="toApply">{{ $t("apply") }}</button>
      </div>
    </div>
    <div v-else-if="!isLoading" class="w-full h-full flex justify-center items-center">{{ $t("no-results") }}</div>
  </div>
</template>
