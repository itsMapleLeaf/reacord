import type {
  MessageActionRowComponentOptions,
  MessageOptions,
} from "discord.js"
import React from "react"
import { ContainerInstance } from "./container-instance.js"

export type ActionRowProps = {
  children: React.ReactNode
}

export function ActionRow(props: ActionRowProps) {
  return (
    <reacord-element createInstance={() => new ActionRowInstance()}>
      {props.children}
    </reacord-element>
  )
}

class ActionRowInstance extends ContainerInstance {
  readonly name = "ActionRow"

  constructor() {
    super({ warnOnNonTextChildren: false })
  }

  // eslint-disable-next-line class-methods-use-this
  override renderToMessage(options: MessageOptions) {
    const row = {
      type: "ACTION_ROW" as const,
      components: [] as MessageActionRowComponentOptions[],
    }

    for (const child of this.children) {
      if (!child.renderToActionRow) {
        console.warn(`${child.name} is not an action row component`)
        continue
      }
      child.renderToActionRow(row)
    }

    options.components ??= []
    options.components.push(row)
  }
}
