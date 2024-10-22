<script setup lang="ts">
import MusicList from "@/views/MusicList.vue";
import Details from "@/views/Details.vue";
import { LoadingWrapper } from "@/composables/useGlobalLoading";
import { ToastWrapper } from "@/composables/useToast";
</script>

<template>
  <div class="flex w-full h-full">
    <div
      class="flex-1 min-w-[240px] h-full backdrop-blur-lg bg-white bg-opacity-10 shadow-[1px_0px_1px_rgba(0,0,0,0.1)]">
      <MusicList />
    </div>
    <div class="flex-[70%] h-full flex flex-col">
      <Details />
    </div>
  </div>
  <ToastWrapper />
  <LoadingWrapper />
</template>
