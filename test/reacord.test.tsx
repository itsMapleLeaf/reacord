import * as React from "react"
import { Button, Embed, EmbedField, EmbedTitle } from "../library/main"
import { TestCommandInteraction } from "../library/testing"
import { setupReacordTesting } from "./setup-testing"

const { reacord, adapter, assertMessages } = setupReacordTesting()

test("rendering behavior", async () => {
  const reply = reacord.createCommandReply(new TestCommandInteraction(adapter))
  reply.render(<KitchenSinkCounter onDeactivate={() => reply.deactivate()} />)

  await assertMessages([
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
  await assertMessages([
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
  await assertMessages([
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
  await assertMessages([
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
  await assertMessages([
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
  await assertMessages([
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
  await assertMessages([
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
  await assertMessages([
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
