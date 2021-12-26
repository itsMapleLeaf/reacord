import { nextTick } from "node:process"
import { promisify } from "node:util"
import * as React from "react"
import { omit } from "../src/helpers/omit"
import { Button, Embed, EmbedField, EmbedTitle, Reacord } from "../src/main"
import { TestAdapter, TestCommandInteraction } from "../src/test-adapter"

const nextTickPromise = promisify(nextTick)

test("kitchen-sink", async () => {
  const adapter = new TestAdapter()
  const reacord = new Reacord({ adapter })

  const reply = reacord.createCommandReply(new TestCommandInteraction(adapter))
  reply.render(<KitchenSinkCounter onDeactivate={() => reply.deactivate()} />)

  await assertMessages(adapter, [
    {
      content: "count: 0",
      embeds: [],
      actionRows: [
        [
          {
            type: "button",
            style: "primary",
            label: "clicc",
          },
          {
            type: "button",
            style: "secondary",
            label: "show embed",
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("show embed").click()
  await assertMessages(adapter, [
    {
      content: "count: 0",
      embeds: [{ title: "the counter" }],
      actionRows: [
        [
          {
            type: "button",
            style: "secondary",
            label: "hide embed",
          },
          {
            type: "button",
            style: "primary",
            label: "clicc",
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("clicc").click()
  await assertMessages(adapter, [
    {
      content: "count: 1",
      embeds: [
        {
          title: "the counter",
          fields: [{ name: "is it even?", value: "no" }],
        },
      ],
      actionRows: [
        [
          {
            type: "button",
            style: "secondary",
            label: "hide embed",
          },
          {
            type: "button",
            style: "primary",
            label: "clicc",
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("clicc").click()
  await assertMessages(adapter, [
    {
      content: "count: 2",
      embeds: [
        {
          title: "the counter",
          fields: [{ name: "is it even?", value: "yes" }],
        },
      ],
      actionRows: [
        [
          {
            type: "button",
            style: "secondary",
            label: "hide embed",
          },
          {
            type: "button",
            style: "primary",
            label: "clicc",
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("hide embed").click()
  await assertMessages(adapter, [
    {
      content: "count: 2",
      embeds: [],
      actionRows: [
        [
          {
            type: "button",
            style: "primary",
            label: "clicc",
          },
          {
            type: "button",
            style: "secondary",
            label: "show embed",
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("clicc").click()
  await assertMessages(adapter, [
    {
      content: "count: 3",
      embeds: [],
      actionRows: [
        [
          {
            type: "button",
            style: "primary",
            label: "clicc",
          },
          {
            type: "button",
            style: "secondary",
            label: "show embed",
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("deactivate").click()
  await assertMessages(adapter, [
    {
      content: "count: 3",
      embeds: [],
      actionRows: [
        [
          {
            type: "button",
            style: "primary",
            label: "clicc",
            disabled: true,
          },
          {
            type: "button",
            style: "secondary",
            label: "show embed",
            disabled: true,
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
            disabled: true,
          },
        ],
      ],
    },
  ])

  adapter.findButtonByLabel("clicc").click()
  await assertMessages(adapter, [
    {
      content: "count: 3",
      embeds: [],
      actionRows: [
        [
          {
            type: "button",
            style: "primary",
            label: "clicc",
            disabled: true,
          },
          {
            type: "button",
            style: "secondary",
            label: "show embed",
            disabled: true,
          },
          {
            type: "button",
            style: "danger",
            label: "deactivate",
            disabled: true,
          },
        ],
      ],
    },
  ])
})

function KitchenSinkCounter(props: { onDeactivate: () => void }) {
  const [count, setCount] = React.useState(0)
  const [embedVisible, setEmbedVisible] = React.useState(false)

  return (
    <>
      count: {count}
      {embedVisible && (
        <Embed>
          <EmbedTitle>the counter</EmbedTitle>
          {count > 0 && (
            <EmbedField name="is it even?">
              {count % 2 === 0 ? "yes" : "no"}
            </EmbedField>
          )}
        </Embed>
      )}
      {embedVisible && (
        <Button label="hide embed" onClick={() => setEmbedVisible(false)} />
      )}
      <Button
        style="primary"
        label="clicc"
        onClick={() => setCount(count + 1)}
      />
      {!embedVisible && (
        <Button label="show embed" onClick={() => setEmbedVisible(true)} />
      )}
      <Button style="danger" label="deactivate" onClick={props.onDeactivate} />
    </>
  )
}

function extractMessageDataSample(adapter: TestAdapter) {
  return adapter.messages.map((message) => ({
    ...message.options,
    actionRows: message.options.actionRows.map((row) =>
      row.map((component) => omit(component, ["customId"])),
    ),
  }))
}

async function assertMessages(
  adapter: TestAdapter,
  expected: ReturnType<typeof extractMessageDataSample>,
) {
  await nextTickPromise()
  expect(extractMessageDataSample(adapter)).toEqual(expected)
}
