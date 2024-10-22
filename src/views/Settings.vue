<script lang="ts" setup>
import { OverridesStrategy, ShowInputHint, useSettings } from "@/composables/useStorage";

const { overridesStrategy, showInputHint } = useSettings();
</script>
<template>
  <div class="p-2 min-w-[300px]">
    <div class="h-8">Settings</div>
    <div class="w-full flex flex-col gap-2 text-sm">
      <div class="w-full flex justify-between items-center">
        <div>Override Strategy:</div>
        <select v-model="overridesStrategy" class="px-1 shadow border">
          <option disabled>select an option</option>
          <option :value="OverridesStrategy.OverrideAll">Override all</option>
          <option :value="OverridesStrategy.EmptyOnly">Empty-Only</option>
        </select>
      </div>
      <hr />
      <div class="w-full flex justify-between items-center">
        <div>Show input hint:</div>
        <select v-model="showInputHint" class="px-1 shadow border">
          <option disabled>select an option</option>
          <option :value="ShowInputHint.Always">Always</option>
          <option :value="ShowInputHint.EmptyOnly">Empty-Only</option>
        </select>
      </div>
      <hr />
      <div>About: version</div>
    </div>
  </div>
</template>
