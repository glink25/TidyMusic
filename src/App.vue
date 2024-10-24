<script setup lang="ts">
import MusicList from "@/views/MusicList.vue";
import Editor from "@/views/Editor.vue";
import { LoadingWrapper } from "@/composables/useGlobalLoading";
import { ToastWrapper } from "@/composables/useToast";
</script>

<template>
  <div class="flex w-full h-full">
    <div
      class="flex-1 pt-6 min-w-[260px] h-full flex flex-col overflow-hidden shadow-[1px_0px_1px_rgba(0,0,0,0.1)]"
    >
      <MusicList />
    </div>
    <div class="flex-[70%] pt-6 h-full flex flex-col">
      <Editor />
    </div>
  </div>
  <ToastWrapper />
  <LoadingWrapper />
</template>
