export type AsyncCallback = () => unknown

export class AsyncQueue {
  private callbacks: AsyncCallback[] = []
  private promise: Promise<void> | undefined

  async add(callback: AsyncCallback) {
    this.callbacks.push(callback)
    if (this.promise) return this.promise

    this.promise = this.runQueue()
    try {
      await this.promise
    } finally {
      this.promise = undefined
    }
  }

  private async runQueue() {
    let callback: AsyncCallback | undefined
    while ((callback = this.callbacks.shift())) {
      await callback()
    }
  }
}
