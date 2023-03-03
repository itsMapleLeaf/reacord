import * as React from "react"
import { test } from "vitest"
import { Button, Embed, EmbedField, EmbedTitle } from "../library/main"
import { ReacordTester } from "./test-adapter"
import {assertMessages} from './utils'
test("rendering behavior", async () => {
  const tester = new ReacordTester()

  const reply = tester.reply()
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
  ], tester.sampleMessages())

  let btn = await tester.findButtonByLabel("show embed")
  await btn!.click()
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
  ], tester.sampleMessages())

  btn = await tester.findButtonByLabel("clicc")
  await btn!.click()
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
  ], tester.sampleMessages())

  btn = await tester.findButtonByLabel("clicc")
  await btn!.click()
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
  ], tester.sampleMessages())

  btn = await tester.findButtonByLabel("hide embed")
  await btn!.click()
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
  ], tester.sampleMessages())

  btn = await tester.findButtonByLabel("clicc")
  await btn!.click()
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
  ], tester.sampleMessages())

  btn = await tester.findButtonByLabel("deactivate")
  await btn!.click()
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
  ], tester.sampleMessages())

  btn = await tester.findButtonByLabel("clicc")
  await btn!.click()
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
  ], tester.sampleMessages())
})

test("delete", async () => {
  const tester = new ReacordTester()

  const reply = tester.reply()
  reply.render(
    <>
      some text
      <Embed>some embed</Embed>
      <Button label="some button" onClick={() => {}} />
    </>,
  )

  await assertMessages([
    {
      content: "some text",
      embeds: [{ description: "some embed" }],
      actionRows: [
        [{ type: "button", style: "secondary", label: "some button" }],
      ],
    },
  ], tester.sampleMessages())

  reply.destroy()
  await assertMessages([], tester.sampleMessages())
})

// test multiple instances that can be updated independently,
// + old instances getting deactivated once the limit is reached
test.todo("multiple instances")

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
