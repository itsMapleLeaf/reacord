export class LimitedCollection<T> {
  private items: T[] = []

  constructor(private readonly size: number) {}

  add(item: T) {
    if (this.items.length >= this.size) {
      this.items.shift()
    }
    this.items.push(item)
  }

  has(item: T) {
    return this.items.includes(item)
  }

  values(): readonly T[] {
    return this.items
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]()
  }
}
