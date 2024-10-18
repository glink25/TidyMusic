import { defineComponent, h, reactive, ref, SlotsType, watch } from "vue";
import Popcon from "./Popcon.vue";

export const useConfirm = <Output, Input>() => {
  const onCancel = (v: any) => {
    console.log("oncancle");
    injectProps.visible = false;
    _res?.(v);
  };
  const injectProps = reactive({
    visible: false,
    input: undefined as any,
    onCancel,
  });
  let _res: any = undefined;

  const ConfirmWrapper = defineComponent<Record<string, any>, {}, string, SlotsType<{ default: { input: Input,exit:(v?:Output)=>void } }>>(
    (_ctx, props) => {
      return () => h(Popcon, injectProps, props.slots);
    }
  );
  const open = (v: Input) =>
    new Promise<Output>((res) => {
      injectProps.visible = true;
      injectProps.input = v;
      _res = res;
    });

  return [open, ConfirmWrapper] as const;
};
