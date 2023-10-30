export const poll = async function <T>(
  fn: () => Promise<T>,
  fnConditionToKeepPolling: (arg: T) => boolean,
  ms: number
) {
  let result = await fn();
  while (fnConditionToKeepPolling(result)) {
    await wait(ms);
    result = await fn();
  }
  return result;
};

export const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
