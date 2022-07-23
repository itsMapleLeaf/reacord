export class Container<T> {
  private items: T[] = []

  add(...items: T[]) {
    this.items.push(...items)
  }

  addBefore(item: T, before: T) {
    let index = this.items.indexOf(before)
    if (index === -1) {
      index = this.items.length
    }
    this.items.splice(index, 0, item)
  }

  remove(toRemove: T) {
    this.items = this.items.filter((item) => item !== toRemove)
  }

  clear() {
    this.items = []
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate)
  }

  findType<U extends T>(type: new (...args: any[]) => U): U | undefined {
    for (const item of this.items) {
      if (item instanceof type) return item
    }
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]()
  }
}
