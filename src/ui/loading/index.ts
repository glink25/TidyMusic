import { computed, defineComponent, h, nextTick, onMounted, Ref, ref, render, Teleport, watch } from "vue";
import Loading from "./Loading.vue";

// if appendTo === true, needs to use <LoadingWrapper/> manually
export default function useLoading<Params extends [] | [appendTo: true | Ref<HTMLElement | undefined>]>(
  ...params: Params
) {
  const firstParam = params[0];
  const appendToBody = firstParam === true;
  const domRef = (firstParam ?? ref<HTMLElement>()) as Ref<HTMLElement | undefined>;
  const visible = ref(false);

  const LoadingInner = defineComponent(() => {
    const props = computed(() => ({
      visible: visible.value,
    }));
    return () => h(Loading, props.value, {});
  });

  const LoadingBody = defineComponent(() => {
    const props = computed(() => {
      return {
        to: "body",
        visible: visible.value,
      };
    });
    return () => h(Teleport, props.value, [h(Loading, { visible: props.value.visible }, {})]);
  });
  const controller = {
    show: () => (visible.value = true),
    dismiss: () => (visible.value = false),
  };

  watch(visible, (v) => {
    nextTick().then(() => {
      const el = appendToBody ? document.body : domRef.value;
      if (!el) {
        return;
      }
      if (v) {
        el.style.position = "relative";
      } else {
        el.style.removeProperty("position");
      }
    });
  });

  if (!appendToBody) {
    onMounted(() => {
      if (!domRef.value) {
        return;
      }
      render(h(LoadingInner), domRef.value);
    });
  }

  type LoadingWrapperType = Params extends [] ? undefined : typeof LoadingBody;
  return {
    domRef,
    LoadingWrapper: (appendToBody ? LoadingBody : undefined) as LoadingWrapperType,
    controller,
    visible,
  };
}
