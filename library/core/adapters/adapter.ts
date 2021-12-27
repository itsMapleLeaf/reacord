import type {
  CommandInteraction,
  ComponentInteraction,
} from "../../internal/interaction"

export type Adapter<CommandReplyInit> = {
  /**
   * @internal
   */
  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ): void

  /**
   * @internal
   */
  createCommandInteraction(init: CommandReplyInit): CommandInteraction
}
