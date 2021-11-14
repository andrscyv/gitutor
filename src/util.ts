export async function callIfFunction(
  // eslint-disable-next-line @typescript-eslint/ban-types
  valOrFunc: Function | any,
  ...args: any[]
): Promise<any> {
  if (typeof valOrFunc === 'function') {
    return await Promise.resolve(valOrFunc(...args));
  }
  return valOrFunc;
}
