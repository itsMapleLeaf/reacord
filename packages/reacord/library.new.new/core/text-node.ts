import { Node } from "./node.js"

export class TextNode extends Node {
  constructor(public text: string) {
    super()
  }
}
