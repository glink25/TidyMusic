import { computed, defineComponent, h, ref } from "vue";
import Toast from "./Toast.vue";

export enum ToastType {
  info='info',
  success='success',
  error='error',
  warning='warning'
}
export type ToastItem = {
  type: ToastType;
  content: string;
  id: string | number
};

const getId = (() => {
  let i = 0;
  return () => (i += 1);
})();

export const useToastWrapper = () => {
  const list = ref<(ToastItem)[]>([]);
  const TooltipWrapper = defineComponent(() => {
    const _list = computed(() => list.value);
    return () => h(Toast, { list: _list.value });
  });

  const show=(content: string, timeout = 3000, type: ToastType = ToastType.info) => {
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
  }
  const controller = {
    show,
    success:(content:string,timeout = 3000)=>show(content,timeout,ToastType.success),
    info:(content:string,timeout = 3000)=>show(content,timeout,ToastType.info),
    warning:(content:string,timeout = 3000)=>show(content,timeout,ToastType.warning),
    error:(content:string,timeout = 3000)=>show(content,timeout,ToastType.error)

  };

  return [controller, TooltipWrapper] as const;
};
