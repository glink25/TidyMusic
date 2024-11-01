import { computed, ComputedRef, defineComponent, h, nextTick, ref, Teleport } from "vue";
import Loading from "./Loading.vue";

const getId = (() => {
  let i = 0;
  return () => (i += 1);
})();

type LoadingChild = ComputedRef<{ id: any; visible: boolean; to: any }>;

export default function createLoadings() {
  const rootRef = ref<HTMLElement>();
  const loadingChildren = ref<LoadingChild[]>([]);
  const LoadingRoot = defineComponent(() => {
    const getProps = (l: LoadingChild, _i: number) => ({
      visible: l.value.visible,
      key: l.value.id,
    });
    const getTeleportProps = (l: LoadingChild) => ({ to: l.value.to });
    return () =>
      h(
        "div",
        { ref: rootRef },
        loadingChildren.value.map((l, i) => h(Teleport, getTeleportProps(l), h(Loading, getProps(l, i), {})))
      );
  });

  function useLoading(body = false) {
    const domRef = ref<HTMLElement>();
    const visible = ref(false);
    const id = getId();
    const l = computed(() => ({ id, visible: visible.value, to: body ? "body" : domRef.value }));

    const show = () => {
      // wait for dom ready
      nextTick().then(() => {
        visible.value = true;
        loadingChildren.value.push(l);
      });
    };
    const dismiss = () => {
      visible.value = false;
      // show animation
      nextTick().then(() => {
        loadingChildren.value.splice(loadingChildren.value.findIndex((v) => v.value.id === id));
      });
    };
    const controller = {
      show,
      dismiss,
    };

    return {
      domRef,
      controller,
      visible,
    };
  }

  return {
    LoadingRoot,
    useLoading,
  };
}
