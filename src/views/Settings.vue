<script lang="ts" setup>
import {
  OverridesStrategy,
  ShowInputHint,
  useSettings,
} from "@/composables/useStorage";

const { overridesStrategy, showInputHint, reset } = useSettings();

const toResetSettings = () => {
  reset();
};

const version = (window as any).__APP_VERSION__;
</script>
<template>
  <div class="p-2 min-w-[300px]">
    <div class="h-8">Settings</div>
    <div class="w-full flex flex-col gap-2 text-sm">
      <div class="w-full flex justify-between items-center p-2">
        <div>Override Strategy:</div>
        <div class="select-wrapper">
          <select v-model="overridesStrategy" class="px-1 shadow border">
            <option disabled>select an option</option>
            <option :value="OverridesStrategy.OverrideAll">Override all</option>
            <option :value="OverridesStrategy.EmptyOnly">Empty-Only</option>
          </select>
        </div>
      </div>
      <div class="w-full flex justify-between items-center p-2">
        <div>Show input hint:</div>
        <div class="select-wrapper">
          <select v-model="showInputHint" class="px-1 shadow border">
            <option disabled>select an option</option>
            <option :value="ShowInputHint.Always">Always</option>
            <option :value="ShowInputHint.EmptyOnly">Empty-Only</option>
          </select>
        </div>
      </div>
      <div class="flex flex-col gap-2 justify-center items-center p-2 text-xs">
        <button class="button" @click="toResetSettings">
          Reset to defaults
        </button>
        <div class="text-xs">version: {{ version }}</div>
        <a
          class="text-xs underline"
          href="https://github.com/glink25/TidyMusic"
          target="_blank"
          >Github</a
        >
      </div>
    </div>
  </div>
</template>
