export function runAsync(cb: () => Promise<void>) {
  (async () => {
    try {
      await cb();
    } catch (e) {
      console.log(e);
    }
  })();
}
