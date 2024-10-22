<script lang="ts" setup generic="Input,Output">

defineProps<{
    visible: boolean,
    input: Input
    onCancel: (v?: Output) => void
}>()

</script>
<template>
    <Teleport to="body">
        <div v-if="visible"
            class="fixed top-0 left-0 w-full h-full flex justify-center items-center p-4 overflow-hidden flex flex-col">
            <div class="absolute bg-black bg-opacity-50 w-full h-full"></div>
            <div class="relative min-w-[200px] min-h-[120px] bg-white rounded">
                <div class="absolute top-2 right-2 z-[50]" @click="() => onCancel()">
                    <div class="i-md:cancel-rounded"></div>
                </div>
                <slot v-bind="{ input, exit: onCancel }"></slot>
            </div>
        </div>
    </Teleport>
</template>