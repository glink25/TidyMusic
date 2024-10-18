<script setup lang="ts">
import MusicList from './views/MusicList.vue';
import Details from './views/Details.vue';
import { LoadingWrapper } from './composables/useGlobalLoading';
import { ToastWrapper } from './composables/useToast';

</script>

<template>
  <div class="flex w-full h-full">
    <div class="flex-1 min-w-[200px] h-full border-r">
      <MusicList />
    </div>
    <div class="flex-[70%] h-full flex flex-col">
      <Details />
    </div>
  </div>
  <ToastWrapper />
  <LoadingWrapper />
</template>

<style>
body {
  width: 100vw;
  height: 100vh;
}

#app {
  width: 100%;
  height: 100%;
}

.buttoned {
  @apply rounded bg-gray
}
</style>
