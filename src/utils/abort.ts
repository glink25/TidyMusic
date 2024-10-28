class CancelError extends Error {
  constructor() {
    super("Promise aborted");
  }
}
export default function abortable<T>(promise: Promise<T>) {
  let innerRej: ((err: any) => void) | undefined;
  const controller = new Promise<T>((res, rej) => {
    promise.then((v) => res(v)).catch(() => rej());
    innerRej = rej;
  });
  const abort = () => innerRej?.(new CancelError());

  const pro = Promise.race([controller, promise]);

  return [pro, abort] as const;
}
