import type {
  BaseMessageComponentOptions,
  EmojiResolvable,
  MessageActionRowOptions,
  MessageButtonStyle,
  MessageOptions,
} from "discord.js"
import { nanoid } from "nanoid"
import React from "react"
import { ContainerInstance } from "./container-instance.js"
import { last } from "./helpers/last.js"
import { pick } from "./helpers/pick.js"
import { toUpper } from "./helpers/to-upper.js"

export type ButtonStyle = Exclude<Lowercase<MessageButtonStyle>, "link">

export type ButtonProps = {
  style?: ButtonStyle
  emoji?: EmojiResolvable
  disabled?: boolean
  children?: React.ReactNode
}

export function Button(props: ButtonProps) {
  return (
    <reacord-element createInstance={() => new ButtonInstance(props)}>
      {props.children}
    </reacord-element>
  )
}

class ButtonInstance extends ContainerInstance {
  readonly name = "Button"

  constructor(private readonly props: ButtonProps) {
    super({ warnOnNonTextChildren: true })
  }

  override renderToMessage(options: MessageOptions) {
    options.components ??= []

    // i hate this
    let actionRow:
      | (Required<BaseMessageComponentOptions> & MessageActionRowOptions)
      | undefined = last(options.components)

    if (
      !actionRow ||
      actionRow.components[0]?.type === "SELECT_MENU" ||
      actionRow.components.length >= 5
    ) {
      actionRow = {
        type: "ACTION_ROW",
        components: [],
      }
      options.components.push(actionRow)
    }

    actionRow.components.push({
      ...pick(this.props, "emoji", "disabled"),
      type: "BUTTON",
      style: this.props.style ? toUpper(this.props.style) : "SECONDARY",
      label: this.getChildrenText(),
      customId: nanoid(),
    })
  }
}
