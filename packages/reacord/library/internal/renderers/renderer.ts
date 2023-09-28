import { Container } from "../container.js"
import type { ComponentInteraction } from "../interaction"
import type { Message, MessageOptions } from "../message"
import type { Node } from "../node.js"
import { Subject } from "rxjs"
import { concatMap } from "rxjs/operators"

type UpdatePayload =
	| { action: "update" | "deactivate"; options: MessageOptions }
	| { action: "deferUpdate"; interaction: ComponentInteraction }
	| { action: "destroy" }

export abstract class Renderer {
	readonly nodes = new Container<Node<unknown>>()
	private componentInteraction?: ComponentInteraction
	private message?: Message
	private active = true
	private updates = new Subject<UpdatePayload>()

	private updateSubscription = this.updates
		.pipe(concatMap((payload) => this.updateMessage(payload)))
		.subscribe({ error: console.error })

	render() {
		if (!this.active) {
			console.warn("Attempted to update a deactivated message")
			return
		}

		this.updates.next({
			options: this.getMessageOptions(),
			action: "update",
		})
	}

	deactivate() {
		this.active = false
		this.updates.next({
			options: this.getMessageOptions(),
			action: "deactivate",
		})
	}

	destroy() {
		this.active = false
		this.updates.next({ action: "destroy" })
	}

	handleComponentInteraction(interaction: ComponentInteraction) {
		for (const node of this.nodes) {
			if (node.handleComponentInteraction(interaction)) {
				this.componentInteraction = interaction
				setTimeout(() => {
					this.updates.next({ action: "deferUpdate", interaction })
				}, 500)
				return true
			}
		}
	}

	protected abstract createMessage(options: MessageOptions): Promise<Message>

	private getMessageOptions(): MessageOptions {
		const options: MessageOptions = {
			content: "",
			embeds: [],
			actionRows: [],
		}
		for (const node of this.nodes) {
			node.modifyMessageOptions(options)
		}
		return options
	}

	private async updateMessage(payload: UpdatePayload) {
		if (payload.action === "destroy") {
			this.updateSubscription.unsubscribe()
			await this.message?.delete()
			return
		}

		if (payload.action === "deactivate") {
			this.updateSubscription.unsubscribe()

			await this.message?.edit({
				...payload.options,
				actionRows: payload.options.actionRows.map((row) =>
					row.map((component) => ({
						...component,
						disabled: true,
					})),
				),
			})

			return
		}

		if (payload.action === "deferUpdate") {
			await payload.interaction.deferUpdate()
			return
		}

		if (this.componentInteraction) {
			const promise = this.componentInteraction.update(payload.options)
			this.componentInteraction = undefined
			await promise
			return
		}

		if (this.message) {
			await this.message.edit(payload.options)
			return
		}

		this.message = await this.createMessage(payload.options)
	}
}
