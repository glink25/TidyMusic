import { onMounted, ref } from "vue";

export default function useKeyboard(onKeydown: (e: KeyboardEvent) => void) {
  const focusRef = ref<HTMLElement>();
  onMounted(() => {
    document.addEventListener("keydown", (e) => {
      if (e.target !== focusRef.value && !focusRef.value?.contains(e.target as HTMLElement)) {
        return;
      }
      onKeydown(e);
    });
  });
  return focusRef;
}
