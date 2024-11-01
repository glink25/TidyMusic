<script lang="ts" setup>
import useLang from "@/composables/useLang";
import { OverridesStrategy, ShowInputHint, useSettings } from "@/composables/useStorage";

const { overridesStrategy, showInputHint, reset } = useSettings();

const { locale, options: langs } = useLang();

const toResetSettings = () => {
  reset();
};

const version = (window as any).__APP_VERSION__;
</script>
<template>
  <div class="p-2 min-w-[300px]">
    <div class="h-8">{{ $t("settings") }}</div>
    <div class="w-full flex flex-col gap-2 text-sm">
      <div class="w-full flex justify-between items-center p-2">
        <div>{{ $t("override-strategy") }}</div>
        <div class="select-wrapper">
          <select v-model="overridesStrategy" class="px-1 shadow border">
            <option disabled>{{ $t("select-an-option") }}</option>
            <option :value="OverridesStrategy.OverrideAll">{{ $t("override-all") }}</option>
            <option :value="OverridesStrategy.EmptyOnly">{{ $t("empty-only") }}</option>
          </select>
        </div>
      </div>
      <div class="w-full flex justify-between items-center p-2">
        <div>{{ $t("show-input-hint") }}</div>
        <div class="select-wrapper">
          <select v-model="showInputHint" class="px-1 shadow border">
            <option disabled>{{ $t("select-an-option") }}</option>
            <option :value="ShowInputHint.Always">{{ $t("always") }}</option>
            <option :value="ShowInputHint.EmptyOnly">{{ $t("empty-only") }}</option>
          </select>
        </div>
      </div>
      <div class="w-full flex justify-between items-center p-2">
        <div>{{ $t("language:") }}</div>
        <div class="select-wrapper">
          <select v-model="locale" class="px-1 shadow border">
            <option disabled>{{ $t("select-an-option") }}</option>
            <option v-for="lang in langs" :key="lang.locale" :value="lang.locale">{{ lang.label }}</option>
          </select>
        </div>
      </div>
      <div class="flex flex-col gap-2 justify-center items-center p-2 text-xs">
        <button class="button" @click="toResetSettings">
          {{ $t("reset-to-defaults") }}
        </button>
        <div class="text-xs">{{ $t("version-version", [version]) }}</div>
        <a class="text-xs underline" href="https://github.com/glink25/TidyMusic" target="_blank">Github</a>
      </div>
    </div>
  </div>
</template>
