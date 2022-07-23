export type MessageTree = {
  children: TextNode[]
  render: () => void
}

export type TextNode = {
  type: "text"
  text: string
}
