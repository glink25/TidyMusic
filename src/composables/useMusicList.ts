import { computed, onBeforeUnmount, ref } from "vue";
import Song from "@/utils/song";

export const useMusicList = (() => {
  const addMusic = async (path: string, name: string, file: () => Promise<Uint8Array>) => {
    const index = list.value.findIndex((f) => f.path === path);
    const item = new Song(path, name, file);
    if (index !== -1) {
      list.value[index] = item;
      return;
    }
    list.value.push(item);
  };

  const list = ref([] as Song[]);

  type Guard = () => Promise<boolean>;
  const selectChangeGuards: Guard[] = [];
  const beforeSelectChange = (guard: Guard) => {
    selectChangeGuards.push(guard);
    onBeforeUnmount(() => {
      selectChangeGuards.splice(
        selectChangeGuards.findIndex((f) => f === guard),
        1
      );
    });
  };

  const selectedKey = ref<string>();
  const toSelect = async (key: string) => {
    const canSelect = (await Promise.all(selectChangeGuards.map((g) => g()))).reduce((p, c) => p && c, true);
    if (!canSelect) {
      return;
    }
    selectedKey.value = key;
  };
  const selected = computed(() => list.value.find((v) => v.path === selectedKey.value) as Song | undefined);

  return () => ({
    list,
    addMusic,
    selected,
    toSelect,
    beforeSelectChange,
  });
})();
