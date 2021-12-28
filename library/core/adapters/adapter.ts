import type { Channel } from "../../internal/channel"
import type {
  CommandInteraction,
  ComponentInteraction,
} from "../../internal/interaction"

export type AdapterGenerics = {
  commandReplyInit: unknown
  channelInit: unknown
}

export type Adapter<Generics extends AdapterGenerics> = {
  /**
   * @internal
   */
  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ): void

  /**
   * @internal
   */
  createCommandInteraction(
    init: Generics["commandReplyInit"],
  ): CommandInteraction

  /**
   * @internal
   */
  createChannel(init: Generics["channelInit"]): Channel
}
