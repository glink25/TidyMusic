<script lang="ts" setup generic="Input,Output">
defineProps<{
  visible: boolean;
  input: Input;
  onCancel: (v?: Output) => void;
}>();
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed z-[50] top-0 left-0 w-full h-full flex justify-center items-center overflow-hidden flex flex-col">
        <div class="absolute bg-black bg-opacity-50 w-full h-full"></div>
        <div class="relative min-w-[200px] min-h-[120px] bg-bg rounded m-8">
          <button class="absolute top-2 right-2 z-[50] active:brightness-90 text-icon" @click="() => onCancel()">
            <div class="i-md:cancel-rounded"></div>
          </button>
          <slot v-bind="{ input, exit: onCancel }"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
