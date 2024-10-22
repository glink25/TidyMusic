import { defineComponent, h, reactive, ref, SlotsType, watch } from "vue";
import Popcon from "./Popcon.vue";
import Alert from "./Alert.vue";

export const usePopcon = <Output, Input>() => {
  const onCancel = (v: any) => {
    injectProps.visible = false;
    _res?.(v);
  };
  const injectProps = reactive({
    visible: false,
    input: undefined as any,
    onCancel,
  });
  let _res: any = undefined;

  const ConfirmWrapper = defineComponent<
    Record<string, any>,
    {},
    string,
    SlotsType<{ default: { input: Input; exit: (v?: Output) => void } }>
  >((_ctx, props) => {
    return () => h(Popcon, injectProps, props.slots);
  });
  const open = (v: Input) =>
    new Promise<Output>((res) => {
      injectProps.visible = true;
      injectProps.input = v;
      _res = res;
    });

  return [open, ConfirmWrapper] as const;
};

type AlertOptions = string | [string] | [primary: string, secondary: string] | string[];
type AlertReturned<Option extends AlertOptions> = Option extends [string, string]
  ? boolean
  : Option extends [string]
  ? true
  : string | undefined;
export type AlertInput<Option extends AlertOptions = AlertOptions> = {
  title: string;
  options: Option;
};

export const useAlert = () => {
  const [open, ConfirmWrapper] = usePopcon<string, AlertInput>();
  const AlertWrapper = defineComponent(() => {
    return () =>
      h(ConfirmWrapper, null, {
        default: (binded: any) => h(Alert, binded),
      });
  });

  const alert = async <Option extends AlertOptions>(params: AlertInput<Option>): Promise<AlertReturned<Option>> => {
    const option = await open(params);
    if (params.options.length === 2) {
      if (option === undefined) {
        return false as any;
      }
      return (option === params.options[0]) as any;
    }
    return option as any;
  };

  return [alert, AlertWrapper] as const;
};
