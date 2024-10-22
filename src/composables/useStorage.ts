import { load, Store } from "@tauri-apps/plugin-store";
import { computed, reactive, watch } from "vue";

const KEY = "__state";

// LinkedKeys: 获取对象深层嵌套的键数组，不定长路径
type LinkedKeys<T> = T extends object
  ? {
      [K in keyof T]: [K] | [K, ...LinkedKeys<T[K]>];
    }[keyof T]
  : never;

// LinkedValues: 根据路径数组，获取嵌套属性的类型
type LinkedValues<T, P extends any[]> = P extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends []
      ? T[First]
      : LinkedValues<T[First], Rest>
    : never
  : T; // 如果P是空数组，则返回整个对象类型

export default function useStorage<State extends object>(key: string, autoSave = true) {
  let store: Store | undefined = undefined;
  const state = reactive({} as Partial<State>);
  const loadStore = async () => {
    store = await load(key, { autoSave });
    const localed = await store.get(KEY);
    Object.assign(state, localed);
  };
  loadStore();
  watch(state, (newValue) => {
    store?.set(KEY, newValue);
  });

  const createRef = <K extends LinkedKeys<State>, V extends LinkedValues<State, K> | undefined>(
    keys: K,
    initialValue: V
  ) => {
    const ref = computed({
      get: () => {
        const value = keys.reduce((p, c) => {
          if (p === undefined) {
            return undefined;
          }
          return p[c];
        }, state as any);
        return (value ?? initialValue) as V;
      },
      set: (v: LinkedValues<State, K>) => {
        keys.reduce((p, c, i) => {
          if (i === keys.length - 1) {
            p[c] = v;
            return;
          }
          if (p[c] === undefined) {
            p[c] = {};
          }
          return p[c];
        }, state as any);
      },
    });
    return ref;
  };
  return {
    state,
    createRef,
  };
}

export enum OverridesStrategy {
  OverrideAll = "override-all",
  EmptyOnly = "empty-only",
}

export enum ShowInputHint {
  Always = "always",
  EmptyOnly = "empty-only",
}

export type Settings = {
  appSettings: {
    overridesStrategy: OverridesStrategy;
    showInputHint: ShowInputHint;
  };
  autoFixerSettings: {};
};
export const useSettings = (() => {
  const { createRef } = useStorage<Settings>("settings.json");

  const overridesStrategy = createRef(["appSettings", "overridesStrategy"], OverridesStrategy.OverrideAll);
  const showInputHint = createRef(["appSettings", "showInputHint"], ShowInputHint.Always);
  return () => ({ overridesStrategy, showInputHint });
})();
