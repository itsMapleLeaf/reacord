import { raise } from "@reacord/helpers/raise.js"
import {
	Button,
	Embed,
	EmbedField,
	Link,
	Option,
	ReacordDiscordJs,
	Select,
	useInstance,
} from "../library/main.js"
import type { CommandInteraction, TextChannel } from "discord.js"
import { ChannelType, Client, Events, IntentsBitField } from "discord.js"
import "dotenv/config"
import { kebabCase } from "lodash-es"
import { useEffect, useState } from "react"

const client = new Client({ intents: IntentsBitField.Flags.Guilds })
const reacord = new ReacordDiscordJs(client)

await client.login(process.env.TEST_BOT_TOKEN)

const guild = await client.guilds.fetch(
	process.env.TEST_GUILD_ID ?? raise("TEST_GUILD_ID not defined"),
)

const category = await guild.channels.fetch(
	process.env.TEST_CATEGORY_ID ?? raise("TEST_CATEGORY_ID not defined"),
)
if (category?.type !== ChannelType.GuildCategory) {
	throw new Error(
		`channel ${process.env.TEST_CATEGORY_ID} is not a guild category. received ${category?.type}`,
	)
}

for (const [, channel] of category.children.cache) {
	await channel.delete()
}

let prefix = 0
const createTest = async (
	name: string,
	block: (channel: TextChannel) => unknown,
) => {
	prefix += 1
	const channel = await category.children.create({
		type: ChannelType.GuildText,
		name: `${String(prefix).padStart(3, "0")}-${kebabCase(name)}`,
	})
	await block(channel)
}

const executables: Record<
	string,
	(interaction: CommandInteraction) => unknown
> = {}
const createInteractionTest = async (
	name: string,
	block: (interaction: CommandInteraction) => unknown,
) => {
	const slashName = kebabCase(name)

	await client.application?.commands.create({
		name: slashName,
		description: "Test command",
	})
	executables[slashName] = block
}

client.on(Events.InteractionCreate, (interaction) => {
	if (interaction.isCommand()) {
		executables[interaction.commandName]?.(interaction)
	}
})

await createTest("basic", (channel) => {
	reacord.createChannelMessage(channel).render("Hello, world!")
})

await createTest("readme counter", (channel) => {
	interface EmbedCounterProps {
		count: number
		visible: boolean
	}

	function EmbedCounter({ count, visible }: EmbedCounterProps) {
		if (!visible) return <></>

		return (
			<Embed title="the counter">
				<EmbedField name="is it even?">{count % 2 ? "no" : "yes"}</EmbedField>
			</Embed>
		)
	}

	function Counter() {
		const [showEmbed, setShowEmbed] = useState(false)
		const [count, setCount] = useState(0)
		const instance = useInstance()

		return (
			<>
				this button was clicked {count} times
				<EmbedCounter count={count} visible={showEmbed} />
				<Button
					style="primary"
					label="clicc"
					onClick={() => setCount(count + 1)}
				/>
				<Button
					style="secondary"
					label={showEmbed ? "hide embed" : "show embed"}
					onClick={() => setShowEmbed(!showEmbed)}
				/>
				<Button
					style="danger"
					label="deactivate"
					onClick={() => instance.destroy()}
				/>
			</>
		)
	}

	reacord.createChannelMessage(channel).render(<Counter />)
})

await createTest("counter", (channel) => {
	function Counter() {
		const [count, setCount] = useState(0)

		return (
			<>
				count: {count}
				<Button
					style="primary"
					emoji="➕"
					onClick={() => setCount(count + 1)}
				/>
				<Button
					style="primary"
					emoji="➖"
					onClick={() => setCount(count - 1)}
				/>
				<Button label="reset" onClick={() => setCount(0)} />
			</>
		)
	}
	reacord.createChannelMessage(channel).render(<Counter />)
})

await createInteractionTest("bounce counter", (interaction) => {
	function Counter() {
		const [count, setCount] = useState(0)

		useEffect(() => {
			// This will reply once the count is updated to track useEffect usage.
			// Not creating instances.
			void interaction.followUp(`Updated the count to ${count}`)
		}, [count])

		return (
			<>
				count: {count}
				<Button
					style="primary"
					emoji="➕"
					onClick={() => setCount(count + 1)}
				/>
				<Button
					style="primary"
					emoji="➖"
					onClick={() => setCount(count - 1)}
				/>
				<Button label="reset" onClick={() => setCount(0)} />
			</>
		)
	}
	reacord.createInteractionReply(interaction).render(<Counter />)
})

await createTest("select", (channel) => {
	function FruitSelect({ onConfirm }: { onConfirm: (choice: string) => void }) {
		const [value, setValue] = useState<string>()

		return (
			<>
				<Select
					placeholder="choose a fruit"
					value={value}
					onChangeValue={setValue}
				>
					<Option value="🍎" emoji="🍎" label="apple" description="it red" />
					<Option value="🍌" emoji="🍌" label="banana" description="bnanbna" />
					<Option value="🍒" emoji="🍒" label="cherry" description="heh" />
				</Select>
				<Button
					label="confirm"
					disabled={value == undefined}
					onClick={() => {
						if (value) onConfirm(value)
					}}
				/>
			</>
		)
	}

	const instance = reacord.createChannelMessage(channel).render(
		<FruitSelect
			onConfirm={(value) => {
				instance.render(`you chose ${value}`)
				instance.deactivate()
			}}
		/>,
	)
})

await createTest("ephemeral button", (channel) => {
	reacord.createChannelMessage(channel).render(
		<>
			<Button
				label="public clic"
				onClick={(event) =>
					event.reply(`${event.guild?.member.displayName} clic`)
				}
			/>
			<Button
				label="clic"
				onClick={(event) => event.reply("you clic", { ephemeral: true })}
			/>
		</>,
	)
})

await createTest("delete this", (channel) => {
	function DeleteThis() {
		const instance = useInstance()
		return <Button label="delete this" onClick={() => instance.destroy()} />
	}
	reacord.createChannelMessage(channel).render(<DeleteThis />)
})

await createTest("link", (channel) => {
	reacord
		.createChannelMessage(channel)
		.render(<Link label="hi" url="https://mapleleaf.dev" />)
})
