import type { MessageOptions } from "discord.js"
import type { ReactNode } from "react"
import React from "react"
import { ContainerInstance } from "./container-instance.js"

export type TextProps = {
  children?: ReactNode
}

export function Text(props: TextProps) {
  return (
    <reacord-element createInstance={() => new TextElementInstance()}>
      {props.children}
    </reacord-element>
  )
}

class TextElementInstance extends ContainerInstance {
  readonly name = "Text"

  constructor() {
    super({ warnOnNonTextChildren: true })
  }

  override getText() {
    return this.getChildrenText()
  }

  override renderToMessage(options: MessageOptions) {
    options.content = (options.content ?? "") + this.getText()
  }
}
