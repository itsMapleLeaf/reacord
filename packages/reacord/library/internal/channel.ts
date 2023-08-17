import type { Message, MessageOptions } from "./message"

export interface Channel {
	send(message: MessageOptions): Promise<Message>
}
