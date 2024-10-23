<script lang="ts" setup>
import { useMusicList } from "@/composables/useMusicList";
import { CommonTag } from "@/utils/music";
import { useAlert, usePopcon } from "@/ui/popcon";
import Source from "@/views/Source.vue";
import { computed, reactive, ref, watch } from "vue";
import abortable from "@/utils/abort";
import { toasts } from "@/composables/useToast";
import { loadings } from "@/composables/useGlobalLoading";
import Song from "@/utils/song";
import { saveFile } from "@/utils/fs";
import SingleImagePicker from "@/components/SingleImagePicker.vue";
import Tooltip from "@/components/Tooltip.vue";
import WordSplitter from "@/components/WordSplitter.vue";
import LyricSource from "./LyricSource.vue";
import { OverridesStrategy, ShowInputHint, useSettings } from "@/composables/useStorage";
import { useSources } from "@/composables/useSources";

const { overridesStrategy, showInputHint, showOverrideUnsupportedTagWarning } = useSettings();
const showHint = (v: any) => (showInputHint.value === ShowInputHint.Always ? true : v === "" || v === undefined);

const { selected, beforeSelectChange } = useMusicList();
let originalTags: Record<string, any> | undefined;
const getTag = async (v?: Song) => {
  if (!v) return {};
  const tags = await v.getTags();
  originalTags = tags;
  const transformed = Object.fromEntries(tags.map((t) => [t.label, t.value])) as Record<string, any>;
  originalTags = transformed;
  return transformed;
};

const inner = reactive<Partial<CommonTag>>({});
const isInnerDirty = ref(false);
const isLoadFailed = ref(false);
const notifyChange = () => {
  isInnerDirty.value = true;
};
watch(selected, (_o, _n, onCleanUp) => {
  const [promise, cancel] = abortable(getTag(selected.value));
  promise
    .then((v) => {
      Object.assign(inner, v);
      isLoadFailed.value = false;
    })
    .catch((err) => {
      console.error(err);
      Object.keys(inner).forEach((k) => {
        (inner as any)[k] = undefined;
      });
      isLoadFailed.value = true;
      toasts.error(err);
    })
    .finally(() => {
      isInnerDirty.value = false;
    });
  onCleanUp(() => {
    cancel();
  });
});

const [alert, AlertWrapper] = useAlert();
beforeSelectChange(async () => {
  if (isInnerDirty.value) {
    const leave = await alert({
      title: "Changed not saved, Are you sure to leave?",
      options: ["Still leave", "Cancel"],
    });
    return leave;
  }
  return true;
});

const isEmpty = (v: any) => {
  return (
    v === undefined ||
    v === null ||
    Object.keys(v).length === 0 ||
    Object.values(v).every((v) => v === undefined || v === null || v === "")
  );
};

const [showSourcePop, SourcePop] = usePopcon<Partial<CommonTag>, Partial<CommonTag>>();

const canSearchOnline = computed(() => !isEmpty(inner));
const toSearchOnline = async () => {
  if (!canSearchOnline.value) return;
  const params = inner;
  const newTag = await showSourcePop(params);
  if (!newTag) {
    return;
  }
  console.log("online tag", newTag);
  Object.entries(newTag).forEach(<K extends keyof typeof newTag>(p: any) => {
    const [k, v] = p as [K, (typeof newTag)[K]];
    const old = inner[k];
    if (overridesStrategy.value === OverridesStrategy.EmptyOnly) {
      if (old !== undefined || old !== "") {
        return;
      }
    }
    inner[k] = v;
  });
  notifyChange();
};

const [showLyricSourcePop, LyricSourcePop] = usePopcon<Partial<{ lyric: string }>, Partial<CommonTag>>();

// const canSearchOnline = computed(() => !isEmpty(inner));
const toSearchLyricOnline = async () => {
  if (!canSearchOnline.value) return;
  const params = inner;
  const newLyric = await showLyricSourcePop(params);
  if (!newLyric) {
    return;
  }
  console.log("online lyric", newLyric);
  inner.lyric = newLyric.lyric;
  notifyChange();
};

const toReset = () => {
  toasts.success("Rest success");
  if (!originalTags) {
    return;
  }
  Object.assign(inner, originalTags);
  isInnerDirty.value = false;
};
const toSave = async () => {
  const song = selected.value;
  if (!song) return;
  loadings.show();
  try {
    const [canSafeUpdate, next, diffs] = await song.update(inner);
    if (!canSafeUpdate && showOverrideUnsupportedTagWarning.value) {
      loadings.dismiss();
      console.log("diffs:", diffs);
      const options = ["Continue", "Cancel", "Continue and don't show again"];
      const conti = await alert({
        title: "Some tag will be override, still continue?",
        subtitle: `These tags will be removed or replaced: ${diffs.map((v) => `${v.id}`).join(", ")}`,
        options,
      });
      if (!conti || conti === options[1]) {
        return;
      }
      if (conti === options[2]) {
        showOverrideUnsupportedTagWarning.value = false;
      }
    }
    const newBuffer = await next();
    await saveFile(song.path, newBuffer);
    isInnerDirty.value = false;
    toasts.success("save success");
  } catch (error) {
    console.error(error);
    toasts.error(`save failed: ${error}`);
  } finally {
    loadings.dismiss();
  }
};

// useGlobalBackground(() => inner.cover)
const { selectedSource, setSelectedSource, sources, lyricSources, selectedLyricSource, setSelectedLyricSource } =
  useSources();
</script>
<template>
  <template v-if="selected">
    <div class="w-full flex gap-2 p-2 justify-between border-b">
      <div class="flex items-center">
        <button
          class="icon-button"
          data-size="large"
          :disabled="!canSearchOnline"
          @click="toSearchOnline"
          title="search online">
          <div class="i-md:screen-search-desktop-outline-rounded"></div>
        </button>
        <select
          class="text-xs outline-none text-text"
          :value="selectedSource.id"
          @change="
            (v) => {
              console.log(v);
              setSelectedSource((v.target as any)?.value);
            }
          ">
          <option value="" disabled>select default source</option>
          <option v-for="source in sources" :key="source.id" :value="source.id">{{ source.title }}</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button class="icon-button" data-size="large" :disabled="!isInnerDirty" @click="toReset" title="reset">
          <div class="i-md:refresh"></div>
        </button>
        <button class="icon-button" data-size="large" :disabled="!isInnerDirty" @click="toSave" title="save">
          <div class="i-md:save-outline-rounded"></div>
        </button>
      </div>
    </div>
    <div class="w-full flex-1 overflow-y-auto p-2">
      <div v-if="!isLoadFailed" class="w-full flex flex-col items-center gap-2 text-sm">
        <div class="song-form-item">
          <div>Cover:</div>
          <SingleImagePicker v-model="inner.cover" @change="notifyChange" class="!w-[150px] h-[150px]" />
        </div>
        <div class="song-form-item">
          <div>Title:</div>
          <Tooltip direction="top">
            <input v-model="inner.title" @change="notifyChange" class="w-full rounded" />
            <template #tooltip v-if="showHint(inner.title)">
              <WordSplitter
                :text="selected.name"
                @select="
                  (v) => {
                    inner.title = (inner.title ?? '') + v;
                    notifyChange();
                  }
                " />
            </template>
          </Tooltip>
        </div>
        <div class="song-form-item">
          <div>Artist:</div>
          <Tooltip direction="top">
            <input v-model="inner.artist" @change="notifyChange" class="w-full rounded" />
            <template #tooltip v-if="showHint(inner.artist)">
              <WordSplitter
                :text="selected.name"
                @select="
                  (v) => {
                    inner.artist = (inner.artist ?? '') + v;
                    notifyChange();
                  }
                " />
            </template>
          </Tooltip>
        </div>
        <div class="song-form-item">
          <div>Album:</div>
          <Tooltip direction="top">
            <input v-model="inner.album" @change="notifyChange" class="w-full rounded" />
            <template #tooltip v-if="showHint(inner.album)">
              <WordSplitter
                :text="selected.name"
                @select="
                  (v) => {
                    inner.album = (inner.album ?? '') + v;
                    notifyChange();
                  }
                " />
            </template>
          </Tooltip>
        </div>
        <div class="song-form-item">
          <div>Lyrics:</div>
          <textarea v-model="inner.lyric" @change="notifyChange" class="h-[150px] resize-none" />
          <div class="flex items-center gap-2">
            <button class="button" @click="toSearchLyricOnline">search lyric</button>
            <select
              class="text-xs outline-none text-text underline"
              :value="selectedLyricSource.id"
              @change="
            (v) => {
              setSelectedLyricSource((v as any).value);
            }
          ">
              <option value="" disabled>select default source</option>
              <option v-for="source in lyricSources" :key="source.id" :value="source.id">{{ source.title }}</option>
            </select>
          </div>
        </div>
        <div class="song-form-item">
          <div>Comment:</div>
          <textarea v-model="inner.comment" @change="notifyChange" class="w-full rounded resize-none" />
          <div class="text-[10px] text-gray">some source may use comment to store id</div>
        </div>
      </div>
      <div v-else class="w-full flex-1 flex flex-col justify-center items-center">
        <div class="i-md:error-outline-rounded w-[32px] h-[32px]"></div>
        <div>Load music failed</div>
      </div>
    </div>
  </template>
  <SourcePop>
    <template #default="binded">
      <Source v-bind="binded" />
    </template>
  </SourcePop>
  <LyricSourcePop>
    <template #default="binded">
      <LyricSource v-bind="binded" />
    </template>
  </LyricSourcePop>
  <AlertWrapper />
</template>

<style scoped>
.song-form-item {
  @apply w-full flex flex-col justify-center items-center gap-1 [&>:first-child]:(text-gray text-xs text-right) [&>:nth-child(2)]:(rounded min-w-[150px] w-[50%] max-w[220px]);
}

input,
textarea {
  @apply text-center p-1 bg-[rgba(0,0,0,0.1)];
}
</style>
