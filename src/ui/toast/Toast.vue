<script lang="ts" setup>
import { computed } from "vue";
import { ToastItem, ToastType } from ".";

const props = defineProps<{
  list: ToastItem[];
}>();

const reverse = <T>(arr: T[]) => {
  const reversed: T[] = [];
  arr.forEach((v) => {
    reversed.unshift(v);
  });
  return reversed;
};

const reversed = computed(() => reverse(props.list));
</script>
<template>
  <Teleport to="body">
    <div class="w-full absolute left-0 top-0 z-[30] pointer-events-none flex flex-col items-center pt-8 p-2 gap-2">
      <TransitionGroup name="toast-down">
        <div
          v-for="toast in reversed"
          :key="toast.id"
          class="bg-white rounded min-w-[200px] max-w-[90vw] px-2 py-1 pointer-events-auto rounded shadow text-white flex justify-center items-center gap-1"
          :class="[`toast-${toast.type}`]">
          <div
            :class="[
              {
                'i-md:info': toast.type === ToastType.info,
                'i-md:check-circle-rounded': toast.type === ToastType.success,
                'i-md:warning-rounded': toast.type === ToastType.warning,
                'i-md:error': toast.type === ToastType.error,
              },
            ]"></div>
          <div class="text-sm align-middle">{{ toast.content }}</div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
<style scoped>
/** transition */
.toast-down-enter-active,
.toast-down-leave-active {
  transition: all 0.5s ease;
}

.toast-down-enter-from,
.toast-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/** style */
.toast-info {
  @apply bg-green;
}

.toast-success {
  @apply bg-green;
}

.toast-warning {
  @apply bg-yellow;
}

.toast-error {
  @apply bg-red;
}
</style>
