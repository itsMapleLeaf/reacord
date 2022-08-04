import { ChannelType, Client, IntentsBitField, TextChannel } from "discord.js"
import "dotenv/config"
import { kebabCase } from "lodash-es"
import * as React from "react"
import { useState } from "react"
import { Button } from "../library/components/button"
import { Option } from "../library/components/option"
import { Select } from "../library/components/select"
import { useInstance } from "../library/core/instance-context"
import { ReacordClient } from "../library/reacord-client"

const client = new Client({ intents: IntentsBitField.Flags.Guilds })

const reacord = new ReacordClient({
  token: process.env.TEST_BOT_TOKEN!,
})

type TestCase = {
  name: string
  run: (channel: TextChannel) => void | Promise<unknown>
}

const tests: TestCase[] = [
  {
    name: "basic",
    run: async (channel) => {
      await channel.send("hello world")
    },
  },
  {
    name: "counter",
    run: (channel) => {
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
      reacord.send(channel.id, <Counter />)
    },
  },
  {
    name: "ephemeral button",
    run: (channel) => {
      reacord.send(
        channel.id,
        <>
          <Button
            label="public clic"
            onClick={(event) => {
              console.info(event.interaction)
              event.reply(`${event.interaction.member?.nick} clic`)
            }}
          />
          <Button
            label="clic"
            onClick={(event) => event.ephemeralReply("you clic")}
          />
        </>,
      )
    },
  },
  {
    name: "select",
    run: (channel) => {
      function FruitSelect({
        onConfirm,
      }: {
        onConfirm: (choice: string) => void
      }) {
        const [value, setValue] = useState<string>()

        return (
          <>
            <Select
              placeholder="choose a fruit"
              value={value}
              onChangeValue={setValue}
            >
              <Option
                value="🍎"
                emoji="🍎"
                label="apple"
                description="it red"
              />
              <Option
                value="🍌"
                emoji="🍌"
                label="banana"
                description="bnanbna"
              />
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

      const instance = reacord.send(
        channel.id,
        <FruitSelect
          onConfirm={(value) => {
            instance.render(`you chose ${value}`)
            instance.deactivate()
          }}
        />,
      )
    },
  },
  {
    name: "delete this",
    run: (channel) => {
      function DeleteThis() {
        const instance = useInstance()
        return <Button label="delete this" onClick={() => instance.destroy()} />
      }
      reacord.send(channel.id, <DeleteThis />)
    },
  },
]

await client.login(process.env.TEST_BOT_TOKEN)

const category = await client.channels.fetch(process.env.TEST_CATEGORY_ID!)
if (category?.type !== ChannelType.GuildCategory) {
  throw new Error(
    `channel ${process.env.TEST_CATEGORY_ID} is not a guild category. received ${category?.type}`,
  )
}

const getTestCaseChannelName = (test: TestCase, index: number) =>
  `${String(index).padStart(3, "0")}-${kebabCase(test.name)}`

const testCaseNames = new Set(
  tests.map((test, index) => getTestCaseChannelName(test, index)),
)

const channelsWithoutTestCase = category.children.cache.filter(
  (channel) => !testCaseNames.has(channel.name),
)

const getTestCaseChannel = async (channelName: string, index: number) => {
  const channel = category.children.cache.find((ch) => ch.name === channelName)
  if (channel instanceof TextChannel) {
    for (const [, msg] of await channel.messages.fetch()) {
      await msg.delete()
    }
    return channel
  }

  await channel?.delete()
  return await category.children.create({
    type: ChannelType.GuildText,
    name: channelName,
    position: index,
  })
}

await Promise.all([
  Promise.all(channelsWithoutTestCase.map((channel) => channel.delete())),
  Promise.all(
    tests.map(async (test, index) => {
      const channelName = getTestCaseChannelName(test, index)
      const channel = await getTestCaseChannel(channelName, index)
      console.info("running test:", test.name)
      await test.run(channel)
    }),
  ),
])
