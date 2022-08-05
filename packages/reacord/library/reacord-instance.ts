import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentSelectMenuInteraction,
} from "discord.js"
import { ComponentType } from "discord.js"
import type * as React from "react"
import { Node } from "./node"
import type { ReacordClient } from "./reacord-client"
import { ButtonNode } from "./react/button"
import type { ComponentEvent } from "./react/component-event"
import { reconciler } from "./react/reconciler"
import type { SelectChangeEvent } from "./react/select"
import { SelectNode } from "./react/select"
import type { Renderer } from "./renderer"

/**
 * Represents an interactive message, which can later be replaced or deleted.
 * @category Core
 */
export type ReacordInstance = {
  /** Render some JSX to this instance (edits the message) */
  render(content: React.ReactNode): void

  /** Remove this message */
  deactivate(): void

  /**
   * Same as destroy, but keeps the message and disables the components on it.
   * This prevents it from listening to user interactions.
   */
  destroy(): void
}

export class ReacordInstancePrivate {
  private readonly container = reconciler.createContainer(
    this,
    0,
    // eslint-disable-next-line unicorn/no-null
    null,
    false,
    // eslint-disable-next-line unicorn/no-null
    null,
    "reacord",
    () => {},
    // eslint-disable-next-line unicorn/no-null
    null,
  )

  readonly tree = new Node({})
  private latestTree?: Node

  constructor(private readonly renderer: Renderer) {}

  render(content: React.ReactNode) {
    reconciler.updateContainer(content, this.container)
  }

  async update(tree: Node) {
    try {
      await this.renderer.update(tree)
      this.latestTree = tree
    } catch (error) {
      console.error(error)
    }
  }

  async deactivate() {
    try {
      await this.renderer.deactivate()
    } catch (error) {
      console.error(error)
    }
  }

  async destroy() {
    try {
      await this.renderer.destroy()
    } catch (error) {
      console.error(error)
    }
  }

  handleInteraction(
    interaction: APIMessageComponentInteraction,
    client: ReacordClient,
  ) {
    if (!this.latestTree) return

    const baseEvent: ComponentEvent = {
      reply: (content) => client.reply(interaction, content),
      ephemeralReply: (content) => client.ephemeralReply(interaction, content),
    }

    if (interaction.data.component_type === ComponentType.Button) {
      for (const node of this.latestTree.walk()) {
        if (
          node instanceof ButtonNode &&
          node.customId === interaction.data.custom_id
        ) {
          node.props.onClick({
            ...baseEvent,
            interaction: interaction as APIMessageComponentButtonInteraction,
          })
          break
        }
      }
    }

    if (interaction.data.component_type === ComponentType.SelectMenu) {
      const event: SelectChangeEvent = {
        ...baseEvent,
        interaction: interaction as APIMessageComponentSelectMenuInteraction,
        values: interaction.data.values,
      }

      for (const node of this.latestTree.walk()) {
        if (
          node instanceof SelectNode &&
          node.customId === interaction.data.custom_id
        ) {
          node.props.onChange?.(event)
          node.props.onChangeMultiple?.(interaction.data.values, event)
          if (interaction.data.values[0]) {
            node.props.onChangeValue?.(interaction.data.values[0], event)
          }
        }
      }
    }
  }
}
