export class Node<Props = unknown> {
  readonly children: Node[] = []

  constructor(public props: Props) {}

  clear() {
    this.children.splice(0)
  }

  add(...nodes: Node[]) {
    this.children.push(...nodes)
  }

  remove(node: Node) {
    const index = this.children.indexOf(node)
    if (index !== -1) this.children.splice(index, 1)
  }

  insertBefore(node: Node, beforeNode: Node) {
    const index = this.children.indexOf(beforeNode)
    if (index !== -1) this.children.splice(index, 0, node)
  }

  replace(oldNode: Node, newNode: Node) {
    const index = this.children.indexOf(oldNode)
    if (index !== -1) this.children[index] = newNode
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

  findInstanceOf<T extends Node>(
    cls: new (...args: any[]) => T,
  ): T | undefined {
    for (const child of this.children) {
      if (child instanceof cls) return child
    }
  }

  extractText(depth = 1): string {
    if (this instanceof TextNode) return this.props.text
    if (depth <= 0) return ""
    return this.children.map((child) => child.extractText(depth - 1)).join("")
  }
}

export class TextNode extends Node<{ text: string }> {}
