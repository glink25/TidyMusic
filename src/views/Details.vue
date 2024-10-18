<script lang="ts" setup>
import { EditableMusic, useMusicList } from '../composables/useMusicList';
import { CommonTag } from '../utils/music';
import { useConfirm } from '../ui/confirm';
import Source from "./Source.vue";
import { reactive, watchEffect } from 'vue';
import abortable from '../utils/abort';
import { saveFile } from '../utils/fs';
import { toasts } from '../composables/useToast';
import { loadings } from '../composables/useGlobalLoading';

const { selected } = useMusicList()
let originalTags: Record<string, any> | undefined
const getTag = async (v?: EditableMusic) => {
    if (!v) return {}
    const tags = await v.tags()
    originalTags = tags
    const transformed = Object.fromEntries(tags.map((t) => [t.label, t.value])) as Record<string, any>
    originalTags = transformed
    return transformed
}

const inner = reactive<Partial<CommonTag>>({})
watchEffect((onCleanUp) => {
    const [promise, cancel] = abortable(getTag(selected.value))
    promise.then((v) => {
        Object.assign(inner, v)
    })
    onCleanUp(() => {
        cancel()
    })
})
const isEmpty = (v: any) => {
    return Object.keys(v).length === 0 || Object.values(v).every(v => v === undefined || v === null || v === '')
}

const [showConfirm, Popcon] = useConfirm<Partial<CommonTag>, Partial<CommonTag>>()

const toSearchOnline = async () => {
    if (isEmpty(inner)) return
    const params = inner
    const newTag = await showConfirm(params)
    console.log(newTag, "newTag", newTag.cover)
    if (!newTag) {
        return
    }
    Object.assign(inner, newTag)
}

const toReset = () => {
    if (!originalTags) {
        return
    }
    Object.assign(inner, originalTags)
}
const toSave = async () => {
    const song = selected.value
    if (!song) return
    loadings.show()
    const newBuffer = await song.update(inner)
    await saveFile(song.path, newBuffer)
    loadings.dismiss()
    toasts.show("save success")
    console.log("save success")
}

</script>
<template>
    <template v-if="selected">
        <div class="w-full flex gap-2">
            <button @click="toSearchOnline">search online</button>
            <button @click="toReset">Reset</button>
            <button @click="toSave">Save</button>
        </div>
        <div class="w-full flex-1 overflow-y-auto flex">
            <div>
                <img v-if="inner.cover" :src="inner.cover" alt="" width="64" height="64">
                <div>
                    <div>Title:</div><input v-model="inner.title" />
                </div>

                <div>
                    <div>Artist:</div><input v-model="inner.artist" />
                </div>
                <textarea v-model="inner.lyric" />
            </div>
        </div>
    </template>
    <Popcon>
        <template #default="binded">
            <Source v-bind="binded" />
        </template>
    </Popcon>
</template>