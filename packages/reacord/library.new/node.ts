export type Node = {
  readonly type: string
  readonly props?: Record<string, unknown>
  children?: Node[]
  getText?: () => string
}

export class TextNode implements Node {
  readonly type = "text"

  constructor(private text: string) {}

  getText() {
    return this.text
  }

  setText(text: string) {
    this.text = text
  }
}
