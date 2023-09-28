import type { ReactNode } from "react"
import type { ComponentInteraction } from "../internal/interaction.js"
import { reconciler } from "../internal/reconciler.js"
import type { Renderer } from "../internal/renderers/renderer.js"
import { InstanceProvider } from "./instance-context.js"
import type { ReacordInstance } from "./instance.js"

/** @category Core */
export interface ReacordConfig {
	/**
	 * The max number of active instances. When this limit is exceeded, the oldest
	 * instances will be disabled.
	 */
	maxInstances?: number
}

/**
 * The main Reacord class that other Reacord adapters should extend. Only use
 * this directly if you're making [a custom adapter](/guides/custom-adapters).
 */
export abstract class Reacord {
	private renderers: Renderer[] = []

	constructor(private readonly config: ReacordConfig = {}) {}

	abstract send(...args: unknown[]): ReacordInstance
	abstract reply(...args: unknown[]): ReacordInstance
	abstract ephemeralReply(...args: unknown[]): ReacordInstance

	protected handleComponentInteraction(interaction: ComponentInteraction) {
		for (const renderer of this.renderers) {
			if (renderer.handleComponentInteraction(interaction)) return
		}
	}

	private get maxInstances() {
		return this.config.maxInstances ?? 50
	}

	protected createInstance(renderer: Renderer, initialContent?: ReactNode) {
		if (this.renderers.length > this.maxInstances && this.renderers[0]) {
			this.deactivate(this.renderers[0])
		}

		this.renderers.push(renderer)

		const container: unknown = reconciler.createContainer(
			renderer,
			0,
			null,
			false,
			null,
			"reacord",
			() => {},
			null,
		)

		const instance: ReacordInstance = {
			render: (content: ReactNode) => {
				reconciler.updateContainer(
					<InstanceProvider value={instance}>{content}</InstanceProvider>,
					container,
				)
			},
			deactivate: () => {
				this.deactivate(renderer)
			},
			destroy: () => {
				this.renderers = this.renderers.filter((it) => it !== renderer)
				renderer.destroy()
			},
		}

		if (initialContent !== undefined) {
			instance.render(initialContent)
		}

		return instance
	}

	private deactivate(renderer: Renderer) {
		this.renderers = this.renderers.filter((it) => it !== renderer)
		renderer.deactivate()
	}
}
