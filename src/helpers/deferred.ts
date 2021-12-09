// eslint-disable-next-line import/no-unused-modules
export type Deferred<T> = PromiseLike<T> & {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: unknown) => void
}

export function createDeferred<T = void>(): Deferred<T> {
  let resolve: (value: T | PromiseLike<T>) => void
  let reject: (reason?: unknown) => void

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    then: promise.then.bind(promise),
    resolve: (value) => resolve(value),
    reject: (reason) => reject(reason),
  }
}
