import { attachConsole, info, error, warn } from "@tauri-apps/plugin-log";

if (import.meta.env.DEV) {
  attachConsole();
}

const transform = (...args: any[]) => args.map((v) => `${v}`).join(" ");
const wrap = <F extends (...args: any) => any>(fn: F) => {
  return (...args: Parameters<typeof transform>) => fn(transform(...args)) as ReturnType<F>;
};

const tInfo = wrap(info);
const tError = wrap(error);
const tWarn = wrap(warn);
export { tInfo as info, tError as error, tWarn as warn };
