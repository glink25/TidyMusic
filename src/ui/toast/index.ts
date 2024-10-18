import { computed, defineComponent, h, ref } from "vue";
import Tooltip from "./Toast.vue";

export enum ToastType {
  info,
}
export type ToastItem = {
  type: ToastType;
  content: string;
};

const getId = (() => {
  let i = 0;
  return () => (i += 1);
})();

export const useToastWrapper = () => {
  const list = ref<(ToastItem & { id: string | number })[]>([]);
  const TooltipWrapper = defineComponent(() => {
    const _list = computed(() => list.value);
    return () => h(Tooltip, { list: _list.value });
  });

  const controller = {
    show: (content: string, timeout = 3000, type: ToastType = ToastType.info) => {
      const id = getId();
      list.value.push({
        content,
        type,
        id,
      });
      setTimeout(() => {
        list.value.splice(
          list.value.findIndex((v) => v.id === id),
          1
        );
      }, timeout);
    },
  };

  return [controller, TooltipWrapper] as const;
};
