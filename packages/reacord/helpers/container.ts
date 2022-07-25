export class Container<T> {
  private items: T[] = []

  getItems(): readonly T[] {
    return this.items
  }

  add(item: T) {
    this.items.push(item)
  }

  remove(item: T) {
    const index = this.items.indexOf(item)
    if (index === -1) return
    this.items.splice(index, 1)
  }

  clear() {
    this.items = []
  }

  insertBefore(item: T, beforeItem: T) {
    const index = this.items.indexOf(beforeItem)
    if (index === -1) return
    this.items.splice(index, 0, item)
  }
}
