import type { Message, MessageOptions } from "../message"
import { Renderer } from "./renderer"

// keep track of interaction ids which have replies,
// so we know whether to call reply() or followUp()
const repliedInteractionIds = new Set<string>()

export type InteractionReplyRendererImplementation = {
	interactionId: string
	reply: (options: MessageOptions) => Promise<Message>
	followUp: (options: MessageOptions) => Promise<Message>
}

export class InteractionReplyRenderer extends Renderer {
	constructor(private implementation: InteractionReplyRendererImplementation) {
		super()
	}

	protected createMessage(options: MessageOptions): Promise<Message> {
		if (repliedInteractionIds.has(this.implementation.interactionId)) {
			return this.implementation.followUp(options)
		}

		repliedInteractionIds.add(this.implementation.interactionId)
		return this.implementation.reply(options)
	}
}
