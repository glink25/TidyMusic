<script lang="ts" setup>
import { recursiveOpen } from "@/utils/fs";
import { isMusic } from "@/utils/music";
import { useMusicList } from "@/composables/useMusicList";

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
</script>
<template>
  <div class="px-2 pt-2">
    <button @click="chooseFolder" class="icon-button">
      <div class="i-md:drive-file-move-outline-rounded"></div>
    </button>
  </div>
  <div class="p-2">
    <template v-for="item in list" :key="item.path">
      <div class="px-2 cursor-pointer text-sm rounded" :class="[selected?.path === item.path && 'bg-yellow']">
        <div class="whitespace-nowrap">
          <div @click="() => toSelect(item.path)" class="py-2">
            {{ item.name }}
          </div>
          <hr :class="[selected?.path === item.path && 'opacity-0']" />
        </div>
      </div>
    </template>
  </div>
</template>
