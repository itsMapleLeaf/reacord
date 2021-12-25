import { Node } from "./node.js"

export class TextNode extends Node {
  readonly name = "text"
  constructor(public text: string) {
    super()
  }
}
