import { waitFor } from "@reacord/helpers/wait-for.js"
import * as React from "react"
import { expect, test } from "vitest"
import { Button, Embed, EmbedField, EmbedTitle } from "../src/main"
import { ReacordTester } from "./tester"

test.skip("rendering behavior", async () => {
  // const tester = new ReacordTester()
  // const reply = tester.reply()
  // reply.render(<KitchenSinkCounter onDeactivate={() => reply.deactivate()} />)
  // await tester.assertMessages([
  //   {
  //     content: "count: 0",
  //     embeds: [],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //         },
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "show embed",
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("show embed").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 0",
  //     embeds: [{ title: "the counter" }],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "hide embed",
  //         },
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("clicc").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 1",
  //     embeds: [
  //       {
  //         title: "the counter",
  //         fields: [{ name: "is it even?", value: "no" }],
  //       },
  //     ],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "hide embed",
  //         },
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("clicc").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 2",
  //     embeds: [
  //       {
  //         title: "the counter",
  //         fields: [{ name: "is it even?", value: "yes" }],
  //       },
  //     ],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "hide embed",
  //         },
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("hide embed").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 2",
  //     embeds: [],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //         },
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "show embed",
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("clicc").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 3",
  //     embeds: [],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //         },
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "show embed",
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("deactivate").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 3",
  //     embeds: [],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //           disabled: true,
  //         },
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "show embed",
  //           disabled: true,
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //           disabled: true,
  //         },
  //       ],
  //     ],
  //   },
  // ])
  // await tester.findButtonByLabel("clicc").click()
  // await tester.assertMessages([
  //   {
  //     content: "count: 3",
  //     embeds: [],
  //     actionRows: [
  //       [
  //         {
  //           type: "button",
  //           style: "primary",
  //           label: "clicc",
  //           disabled: true,
  //         },
  //         {
  //           type: "button",
  //           style: "secondary",
  //           label: "show embed",
  //           disabled: true,
  //         },
  //         {
  //           type: "button",
  //           style: "danger",
  //           label: "deactivate",
  //           disabled: true,
  //         },
  //       ],
  //     ],
  //   },
  // ])
})

test("destroy()", async () => {
  const { message, channel, instance } = await ReacordTester.render(
    "destroy()",
    <>
      some text
      <Embed>some embed</Embed>
      <Button label="some button" onClick={() => {}} />
    </>,
  )

  expect(message.content).toBe("some text")
  expect(message.embeds.map((e) => e.toJSON())).toEqual([
    expect.objectContaining({ description: "some embed" }),
  ])
  expect(message.components.map((a) => a.toJSON())).toEqual([
    expect.objectContaining({
      components: [expect.objectContaining({ label: "some button" })],
    }),
  ])

  instance.destroy()

  await waitFor(async () => {
    const messages = await channel.messages.fetch()
    expect(messages.size).toBe(0)
  })
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
