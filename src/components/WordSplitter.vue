<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  text: string;
}>();
const emits = defineEmits<{
  (name: "select", value: string): void;
}>();
const words = computed(() => {
  const text = props.text.split(".")?.[0];
  const splitters = ["-", ".", ",", "/", "·"];
  return splitters
    .reduce(
      (p, c) => {
        return p.map((text) => text.split(c)).flat();
      },
      [text]
    )
    .filter((w) => w !== "")
    .map((v) => v.trim());
});
</script>
<template>
  <div
    class="flex flex-col text-xs bg-bg bg-opacity-40 backdrop-blur-lg p-2 gap-1 rounded-lg min-w-[120px] max-w-[200px]">
    <div class="w-full text-center">{{ $t("select-words") }}</div>
    <div class="flex gap-1 justify-center flex-wrap">
      <div
        v-for="(word, index) in words"
        :key="index"
        class="border rounded px-1 cursor-pointer active:brightness-80"
        :tabindex="index"
        @click="emits('select', word)">
        {{ word }}
      </div>
    </div>
  </div>
</template>
