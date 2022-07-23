export type AsyncCallback = () => unknown

export function createAsyncQueue() {
  const callbacks: AsyncCallback[] = []
  let promise: Promise<void> | undefined

  async function add(callback: AsyncCallback) {
    callbacks.push(callback)
    if (promise) return promise

    promise = runQueue()
    try {
      await promise
    } finally {
      promise = undefined
    }
  }

  async function runQueue() {
    let callback: AsyncCallback | undefined
    while ((callback = callbacks.shift())) {
      await callback()
    }
  }

  return { add }
}
