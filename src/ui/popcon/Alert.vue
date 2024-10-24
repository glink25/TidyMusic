<script lang="ts" setup>
import { computed } from "vue";
import { AlertInput } from ".";

const props = defineProps<{
  input: AlertInput;
  exit: (v: any) => void;
}>();

const options = computed(() => [props.input.options].flat());
</script>
<template>
  <div class="flex flex-col h-full py-2 px-4">
    <div class="flex-1 h-4 flex items-center">{{ props.input.title }}</div>
    <div v-if="props.input.subtitle" class="py-2 text-xs">
      {{ props.input.subtitle }}
    </div>
    <div class="flex items-center justify-end gap-2 text-sm">
      <button
        class="button"
        v-for="(option, index) in options"
        :key="index"
        :data-type="index === 0 ? 'primary' : 'normal'"
        :style="`order: ${options.length - index};`"
        @click="exit(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
