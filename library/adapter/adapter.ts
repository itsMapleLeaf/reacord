import type { CommandInteraction, ComponentInteraction } from "../interaction"

export type Adapter<InteractionInit> = {
  /**
   * @internal
   */
  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ): void

  /**
   * @internal
   */
  createCommandInteraction(interactionInfo: InteractionInit): CommandInteraction
}
