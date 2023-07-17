export function getSettledErrorReason<T = any> (response: PromiseSettledResult<T>) {
  return response.status === 'rejected' && response.reason?.message;
}

export function getSettledValue<T = any> (response: PromiseSettledResult<T>) {
  return response.status === 'fulfilled' && response.value;
}
