<script lang="ts" setup>
import { recursiveOpen } from '../utils/fs';
import { isMusic } from '../utils/music';
import { useMusicList } from '../composables/useMusicList';

const { list, addMusic, selected, toSelect } = useMusicList()
const chooseFolder = async () => {
    await recursiveOpen(async (file) => {
        console.log("insie:", file.name, isMusic(file.name))
        if (!isMusic(file.name)) {
            return
        }
        try {
            const data = await file.data()
            await addMusic(data, file.fullpath, file.name)
        } catch (error) {
            console.error(error)
        }
    })
}


</script>
<template>
    <button @click="chooseFolder" class="buttoned">
        import folder
    </button>
    <div>
        <div v-for="(item, index) in list" :key="item.path"
            :class="['cursor-pointer', selected?.path === item.path && 'bg-yellow']">
            <div @click="() => toSelect(item.path)">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>