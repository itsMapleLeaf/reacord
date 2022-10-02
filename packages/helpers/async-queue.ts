export type AsyncCallback<T> = () => T

type QueueItem = {
  callback: AsyncCallback<unknown>
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
}

export class AsyncQueue {
  private items: QueueItem[] = []
  private running = false

  append<T>(callback: AsyncCallback<T>): Promise<Awaited<T>> {
    return new Promise((resolve, reject) => {
      this.items.push({ callback, resolve: resolve as any, reject })
      void this.run()
    })
  }

  private async run() {
    if (this.running) return
    this.running = true

    let item
    while ((item = this.items.shift())) {
      try {
        item.resolve(await item.callback())
      } catch (error) {
        item.reject(error)
      }
    }

    this.running = false
  }
}
