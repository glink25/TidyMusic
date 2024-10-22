<script lang="ts" setup>
import { recursiveOpen } from "@/utils/fs";
import { isMusic } from "@/utils/music";
import { useMusicList } from "@/composables/useMusicList";
import { usePopcon } from "@/ui/popcon";
import Settings from "./Settings.vue";
import AutoFixer from "./AutoFixer.vue";

const { list, addMusic, selected, toSelect } = useMusicList();
const chooseFolder = async () => {
  await recursiveOpen(async (file) => {
    if (!isMusic(file.name)) {
      return;
    }
    try {
      await addMusic(file.fullpath, file.name, file.data);
    } catch (error) {
      console.error(error);
    }
  });
};

const [showSettings, SettingsPop] = usePopcon();

const [showAutoFixer, AutoFixerPop] = usePopcon();
</script>
<template>
  <div class="p-2 flex justify-between border-b">
    <div class="flex">
      <button @click="chooseFolder" class="icon-button" title="import songs from folder">
        <div class="i-md:drive-file-move-outline-rounded"></div>
      </button>
    </div>
    <div class="flex gap-2">
      <button @click="showAutoFixer" class="icon-button" title="apply online sources for all songs automatically">
        <div class="i-md:auto-fix-outline"></div>
      </button>
      <button @click="showSettings" class="icon-button" title="settings">
        <div class="i-md:settings-rounded"></div>
      </button>
    </div>
  </div>
  <div class="p-2 flex-1 overflow-y-auto">
    <template v-for="item in list" :key="item.path">
      <div
        class="px-2 cursor-pointer text-sm rounded"
        :class="[selected?.path === item.path && 'bg-yellow']"
        :title="item.path">
        <div class="whitespace-nowrap">
          <div class="py-2 overflow-hidden text-ellipsis" @click="() => toSelect(item.path)">
            {{ item.name }}
          </div>
          <hr :class="[selected?.path === item.path && 'opacity-0']" />
        </div>
      </div>
    </template>
  </div>
  <AutoFixerPop>
    <AutoFixer />
  </AutoFixerPop>
  <SettingsPop>
    <Settings />
  </SettingsPop>
</template>
