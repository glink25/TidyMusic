<script lang="ts" setup>
defineProps<{
    visible: boolean
}>()
</script>
<template>
    <Transition name="fade">
        <div v-if="visible" class="w-full h-full absolute left-0 top-0 z-[40] bg-black bg-opacity-50">
            Loading...
        </div>
    </Transition>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
