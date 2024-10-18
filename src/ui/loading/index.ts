import { computed, defineComponent, h, onMounted, reactive, ref, render, Teleport, watch } from "vue";
import Loading from "./Loading.vue";

export default function useLoading(body?: boolean) {
  const domRef = ref<HTMLElement>();
  const visible = ref(false);

  watch(visible, (v) => {
    const el = body ? document.body : domRef.value;
    if (!el) {
      return;
    }
    if (v) {
      el.style.position = "relative";
    } else {
      el.style.removeProperty('position')
    }
  });

  const LoadingWrapper = defineComponent(() => {
    const props = computed(() => ({
      to: body ? "body" : domRef.value,
      visible: visible.value,
    }));
    return () => h(Teleport, props.value, [h(Loading, { visible: props.value.visible }, {})]);
  });
  const controller = {
    show: () => (visible.value = true),
    dismiss: () => (visible.value = false),
  };

  return {
    domRef,
    LoadingWrapper,
    controller,
  };
}
