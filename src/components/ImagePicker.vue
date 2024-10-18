<script setup lang="ts">
import { convertFileSrc } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import { ref } from 'vue';

const src = ref<string>()
const onClick = async () => {
    const path = await open({ multiple: false })
    if (!path) {
        return
    }
    // src.value = convertFileSrc(path)
    const file = await readFile(path)
    const blob = new Blob([file])
    src.value = URL.createObjectURL(blob)
}
</script>

<template>
    <button @click="onClick">pick image</button>
    <img v-if="src" :src="src" alt="">
</template>