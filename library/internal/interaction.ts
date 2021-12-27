import type { Message, MessageOptions } from "./message"

export type Interaction = CommandInteraction | ComponentInteraction

export type CommandInteraction = {
  type: "command"
  id: string
  channelId: string
  reply(messageOptions: MessageOptions): Promise<Message>
  followUp(messageOptions: MessageOptions): Promise<Message>
}

export type ComponentInteraction = ButtonInteraction | SelectInteraction

export type ButtonInteraction = {
  type: "button"
  id: string
  channelId: string
  customId: string
  update(options: MessageOptions): Promise<void>
}

export type SelectInteraction = {
  type: "select"
  id: string
  channelId: string
  customId: string
  values: string[]
  update(options: MessageOptions): Promise<void>
}
