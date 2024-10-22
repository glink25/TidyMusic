class CancelError extends Error {
  constructor() {
    super("Promise aborted");
  }
}
export default function abortable<T>(promise: Promise<T>) {
  let _rej: ((err: any) => void) | undefined = undefined;
  const abortable = new Promise((res, rej) => {
    _rej = rej;
    return promise
      .then((v) => {
        res(v);
      })
      .catch((err) => {
        if (err instanceof CancelError) {
          console.warn(err);
          return;
        }
        rej(err);
        return err;
      });
  });
  const abort = () => _rej?.(new CancelError());

  return [abortable, abort] as const;
}
