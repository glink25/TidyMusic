<script lang="ts" setup>
defineProps<{
  visible: boolean;
}>();
</script>
<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="w-full h-full absolute left-0 top-0 z-[40] bg-bg bg-opacity-50 flex items-center justify-center">
      <div class="text-text flex flex-col gap-2 justify-center items-center">
        <div class="i-md:progress-activity-sharp animate-spin"></div>
        <div class="text-sm">{{ $t("loading") }}</div>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
