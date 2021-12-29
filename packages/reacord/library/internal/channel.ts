import type { Message, MessageOptions } from "./message"

export type Channel = {
  send(message: MessageOptions): Promise<Message>
}
