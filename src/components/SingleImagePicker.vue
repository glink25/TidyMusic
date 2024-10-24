<script lang="ts" setup>
import { pickFile } from "@/utils/fs";

defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits<{
  (name: "update:modelValue", value: string | undefined): void;
  (name: "change", value: string | undefined): void;
}>();

const onClick = async () => {
  try {
    const files = await pickFile({ multiple: false, accept: ["jpeg", "png"] });
    const url = files[0];
    emit("update:modelValue", url);
    emit("change", url);
  } catch (error) {
    console.error("no file select", error);
  }
};

const toRemove = () => {
  emit("update:modelValue", undefined);
  emit("change", undefined);
};
</script>
<template>
  <button class="cursor-pointer relative p-0 border-none" @click="onClick">
    <template v-if="modelValue">
      <img :src="modelValue" class="w-full h-full object-cover" />
      <button
        class="absolute z-[2] top-1 right-1 rounded-full bg-white bg-opacity-50 backdrop-blur p-1 border-none"
        @click.stop="toRemove">
        <div class="i-md:close-rounded w-[12px] h-[12px]"></div>
      </button>
    </template>
    <div v-else class="bg-gray text-white w-full h-full flex items-center justify-center">
      <div class="i-md:add-rounded"></div>
    </div>
  </button>
</template>
