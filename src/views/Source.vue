<script lang="ts" setup>
import { ref } from 'vue';
import { CommonTag } from '../utils/music';
import { createNeteaseSource } from '../sources/netease';

const props = defineProps<{
    input: CommonTag;
    exit: (v: any) => void
}>()

const loading = ref(false)
const searchResults = ref<any[]>()
const load = async () => {
    loading.value = true
    try {
        const source = createNeteaseSource()
        const results = await source.findList(props.input)
        searchResults.value = results
    } catch (error) {

    } finally {
        loading.value = false
    }
}
load()

const toApply = (result: any) => {
    props.exit(result)
}

</script>
<template>
    <div class="overflow-hidden h-full flex flex-col">
        <div>{{ loading }}</div>
        <div class="flex-1 min-w-[200px] flex flex-col overflow-y-auto">
            <div v-for="(result, index) in searchResults" :key="index" class="flex p-2">
                <div class="flex flex-1">
                    <img :src="result.cover" width="48" height="48" />
                    <div>Name: {{ result.title }}</div>
                    <div>Artist: {{ result.artist }}</div>
                    <div>Album: {{ result.album }}</div>
                </div>
                <button @click="toApply(result)">Use this</button>
            </div>
        </div>
    </div>
</template>