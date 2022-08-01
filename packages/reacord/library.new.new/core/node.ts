export class Node<Props = unknown> {
  private readonly _children: Node[] = []

  constructor(public props: Props) {}

  get children(): readonly Node[] {
    return this._children
  }

  clear() {
    this._children.splice(0)
  }

  add(...nodes: Node[]) {
    this._children.push(...nodes)
  }

  remove(node: Node) {
    const index = this._children.indexOf(node)
    if (index !== -1) this._children.splice(index, 1)
  }

  insertBefore(node: Node, beforeNode: Node) {
    const index = this._children.indexOf(beforeNode)
    if (index !== -1) this._children.splice(index, 0, node)
  }

  replace(oldNode: Node, newNode: Node) {
    const index = this._children.indexOf(oldNode)
    if (index !== -1) this._children[index] = newNode
  }

  clone(): this {
    const cloned: this = new (this.constructor as any)()
    cloned.add(...this.children.map((child) => child.clone()))
    return cloned
  }

  *walk(): Generator<Node> {
    yield this
    for (const child of this.children) {
      yield* child.walk()
    }
  }
}
