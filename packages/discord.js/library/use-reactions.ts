import {
	Collection,
	type Message,
	type MessageReaction,
	type ReactionCollector,
} from "discord.js"
import { useEffect, useState } from "react"
import { useMessage } from "./use-message"

export interface UseReactionsOptions {
	message?: Message
}

type Reactions = Collection<string, MessageReaction>

export function useReactions(options: UseReactionsOptions) {
	// Hooks should not be called conditionally
	const messageInstance = useMessage()
	// Ref will persist the value across renders
	const message = options.message ?? messageInstance
	const [collector, setCollector] = useState<ReactionCollector | null>(null)
	const [alive, setAlive] = useState<boolean>(true)

	// Reactions collection
	const [reactions, setReactions] = useState<Reactions>(
		() => new Collection(),
	)

	useEffect(() => {
		const collector = message.createReactionCollector({
			dispose: true,
		})

		const update = () => {
			setReactions(() => collector.collected)
		}

		setCollector(collector)
		collector.on("collect", update)
		collector.on("remove", update)
		collector.on("end", () => {
			update()
			setAlive(false)
		})

		return () => collector.stop()
	}, [message])

	return { reactions, alive, collector }
}
