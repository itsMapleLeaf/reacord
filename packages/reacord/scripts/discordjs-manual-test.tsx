import { raise } from "@reacord/helpers/raise.js"
import {
	Button,
	Link,
	Option,
	ReacordDiscordJs,
	Select,
	useInstance,
} from "../library/main.js"
import type { TextChannel } from "discord.js"
import { ChannelType, Client, IntentsBitField } from "discord.js"
import "dotenv/config"
import { kebabCase } from "lodash-es"
import * as React from "react"
import { useState } from "react"

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

await createTest("basic", (channel) => {
	reacord.createChannelMessage(channel).render("Hello, world!")
})

await createTest("counter", (channel) => {
	const Counter = () => {
		const [count, setCount] = React.useState(0)
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
