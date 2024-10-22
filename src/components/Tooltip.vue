<script lang="ts" setup>
defineProps<{
    direction: 'left' | 'top' | 'right' | 'bottom'
}>()
</script>

<template>
    <div class="tooltip-wrapper relative flex justify-center">
        <div class="tooltip absolute shadow rounded"
            :class="[{ 'bottom-full mb-2': direction === 'top', 'top-full mt-2': direction === 'bottom', }]">
            <slot name="tooltip"></slot>
        </div>
        <slot name="default"></slot>
    </div>
</template>
<style>
.tooltip {
    visibility: hidden;
}

.tooltip-wrapper:focus-within .tooltip {
    visibility: visible;
}
</style>