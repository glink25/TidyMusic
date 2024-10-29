<script lang="ts" setup>
import { recursiveOpen } from "@/utils/fs";
import { isMusic } from "@/utils/music";
import { useMusicList } from "@/composables/useMusicList";
import { usePopcon } from "@/ui/popcon";
import Settings from "./Settings.vue";
import AutoFixer from "./AutoFixer.vue";
import { computed, ref } from "vue";
import { orderBy } from "lodash-es";
import { toasts } from "@/composables/useToast";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { invoke } from "@tauri-apps/api/core";
import { useI18n } from "vue-i18n";
import { error } from "@/utils/log";

const { t: $t } = useI18n();
const { list, addMusic, removeMusic, selected, toSelect } = useMusicList();
const chooseFolder = async () => {
  await recursiveOpen(async (file) => {
    if (!isMusic(file.name)) {
      return;
    }
    try {
      await addMusic(file.fullpath, file.name, file.data);
    } catch (err) {
      error(err);
      toasts.error(`${err}`);
    }
  });
};

// 按标题、名称、作者过滤文本
const filterText = ref("");

// 按名称升序排列
const textSortAscent = ref(true);

// 按标签完整度升序排列
const metaFullAscent = ref(false);

const computedList = computed(() => {
  return orderBy(
    list.value.filter((song) => {
      if (filterText.value === "") return true;
      const keyword = filterText.value.toLowerCase();
      return (
        song.name.toLowerCase().includes(keyword) ||
        (song.syncGetTags()?.some((t) => {
          const r = ["title", "artist"].includes(t.label) && t.value?.toLowerCase?.().includes(keyword);
          return r;
        }) ??
          false)
      );
    }),
    [
      (o) => {
        return o.syncGetTags()?.filter((t) => t.value !== undefined && t.value !== "").length ?? 0;
      },

      "name",
      (o) => {
        return o.syncGetTags()?.find((v) => v.label === "title")?.value;
      },
    ],
    [
      metaFullAscent.value ? "asc" : "desc",
      textSortAscent.value ? "asc" : "desc",
      textSortAscent.value ? "asc" : "desc",
    ]
  );
});

const [showSettings, SettingsPop] = usePopcon();

const [showAutoFixer, AutoFixerPop] = usePopcon();

const showContextMenu = async (item: (typeof computedList)["value"][number]) => {
  const options = [
    {
      id: "reveal",
      text: $t("reveal-in-finder"),
      action: async () => {
        await invoke("showfile", {
          path: item.path,
        });
      },
    },
    {
      id: "remove",
      text: $t("remove-form-list"),
      action: async () => {
        removeMusic(item.path);
      },
    },
  ];
  const items = await Promise.all(options.map((o) => MenuItem.new(o)));
  const menu = await Menu.new({
    items,
  });
  await menu.popup().catch((err) => {
    console.error(err);
    toasts.error(`${err}`);
  });
};
</script>
<template>
  <div class="p-2 flex justify-between order-2 shadow-[0px_-1px_1px_rgba(0,0,0,0.1)]">
    <div class="flex">
      <button @click="chooseFolder" class="icon-button" data-size="large" :title="$t('import-songs-from-folder')">
        <div class="i-md:drive-file-move-outline-rounded"></div>
      </button>
    </div>
    <div class="flex gap-2">
      <button
        @click="showAutoFixer"
        class="icon-button hidden"
        data-size="large"
        :title="$t('apply-online-sources-for-all-songs-automatically')">
        <div class="i-md:auto-fix-outline"></div>
      </button>
      <button @click="showSettings" class="icon-button" data-size="large" title="settings">
        <div class="i-md:settings-rounded"></div>
      </button>
    </div>
  </div>
  <div class="flex-1 w-full flex flex-col overflow-hidden">
    <div class="pt-1 pb-2 px-3 flex gap-2 items-center w-full overflow-hidden">
      <div class="flex-1">
        <input
          type="text"
          v-model="filterText"
          class="text-sm border rounded-lg px-2 py-1 w-full border-white border-opacity-60 bg-transparent placeholder-[rgba(255,255,255,0.6)]"
          :placeholder="$t('filter')" />
      </div>
      <button
        class="icon-button"
        data-size="small"
        :title="textSortAscent ? $t('sort-in-ascending-by-name') : $t('sort-in-descending-by-name')"
        @click="
          () => {
            textSortAscent = !textSortAscent;
          }
        ">
        <div :class="[textSortAscent ? 'i-tb:sort-ascending-letters' : 'i-tb:sort-descending-letters']"></div>
      </button>
      <button
        class="icon-button"
        data-size="small"
        :title="
          metaFullAscent
            ? $t('sort-in-ascending-order-by-tag-completeness')
            : $t('sort-in-descending-order-by-tag-completeness')
        "
        @click="
          () => {
            metaFullAscent = !metaFullAscent;
          }
        ">
        <div :class="[metaFullAscent ? 'i-tb:sort-ascending-small-big' : 'i-tb:sort-descending-small-big']"></div>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto px-2">
      <template v-if="computedList.length">
        <template v-for="item in computedList" :key="item.path">
          <div
            class="px-2 cursor-pointer text-sm rounded"
            data-allow-contextmenu
            :class="[selected?.path === item.path && 'bg-primary bg-opacity-90 backdrop-blur-lg']"
            :title="item.path"
            @click="() => toSelect(item.path)"
            @contextmenu.prevent="() => showContextMenu(item)">
            <div data-allow-contextmenu class="whitespace-nowrap">
              <div data-allow-contextmenu class="py-2 overflow-hidden text-ellipsis">
                {{ item.name }}
              </div>
            </div>
          </div>
        </template>
      </template>
      <div v-else-if="list.length" class="w-full h-full font-semibold flex justify-center items-center pb-[50%]">
        {{ $t("no-result") }}
      </div>
      <div v-else class="w-full h-full font-semibold flex justify-center items-center pb-[50%]">
        {{ $t("start-to-import-music") }}
      </div>
    </div>
  </div>
  <AutoFixerPop>
    <AutoFixer />
  </AutoFixerPop>
  <SettingsPop>
    <Settings />
  </SettingsPop>
</template>
