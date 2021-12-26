import type { CommandInteraction, ComponentInteraction } from "./interaction"

export type Adapter<InteractionInit> = {
  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ): void

  createCommandInteraction(interactionInfo: InteractionInit): CommandInteraction
}
