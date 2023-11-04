import {
	Collection,
	type Message,
	type MessageReaction,
	type ReactionCollector,
} from "discord.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { useMessage } from "./use-message"

interface Options {
	message?: Message
}

type Reactions = Collection<string, MessageReaction>

export function useReactions({ message }: Options) {
	// Hooks should not be called conditionally
	const messageInstance = useMessage()
	// Ref will persist the value across renders
	const messageRef = useRef(message ?? messageInstance)
	const [collector, setCollector] = useState<ReactionCollector | null>(null)
	const [alive, setAlive] = useState<boolean>(true)

	// Reactions collection
	const [reactions, setReactions] = useState<Reactions>(
		collector?.collected ?? new Collection(),
	)

	const update = useCallback(() => {
		if (collector) setReactions(() => collector.collected)
	}, [collector])

	useEffect(() => {
		const collector = messageRef.current.createReactionCollector({
			dispose: true,
		})

		setCollector(collector)
		collector.on("collect", update)
		collector.on("remove", update)
		collector.on("end", () => {
			update()
			setAlive(false)
		})

		return () => collector.stop()
	}, [message, update])

	return { reactions, alive, collector }
}
