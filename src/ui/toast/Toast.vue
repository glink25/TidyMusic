<script lang="ts" setup>
import { ToastItem, ToastType } from '.';

defineProps<{
    list: ToastItem[]
}>()
</script>
<template>
    <Teleport to="body">
        <div class="w-full h-full absolute left-0 top-0 z-[30] pointer-events-none">
            <div v-for="(tooltip, index) in list" :key="index"
                class="bg-white rounded min-w-[200px] p-2 pointer-events-auto">
                {{ tooltip.content }}
            </div>
        </div>
    </Teleport>
</template>
