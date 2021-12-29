import type { ComponentEvent } from "../core/component-event"
import type { ButtonClickEvent, SelectChangeEvent } from "../main"
import type { Message, MessageOptions } from "./message"

export type Interaction = CommandInteraction | ComponentInteraction
export type ComponentInteraction = ButtonInteraction | SelectInteraction

export type CommandInteraction = BaseInteraction<"command">

export type ButtonInteraction = BaseComponentInteraction<
  "button",
  ButtonClickEvent
>

export type SelectInteraction = BaseComponentInteraction<
  "select",
  SelectChangeEvent
>

export type BaseInteraction<Type extends string> = {
  type: Type
  id: string
  reply(messageOptions: MessageOptions): Promise<Message>
  followUp(messageOptions: MessageOptions): Promise<Message>
}

export type BaseComponentInteraction<
  Type extends string,
  Event extends ComponentEvent,
> = BaseInteraction<Type> & {
  event: Event
  customId: string
  update(options: MessageOptions): Promise<void>
  deferUpdate(): Promise<void>
}
