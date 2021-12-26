import React from "react"
import {
  Link,
  Reacord,
  TestAdapter,
  TestCommandInteraction,
} from "../library/main"
import { assertMessages } from "./assert-messages"

const adapter = new TestAdapter()
const reacord = new Reacord({ adapter })
const reply = reacord.createCommandReply(new TestCommandInteraction(adapter))

test("link", async () => {
  reply.render(
    <>
      <Link url="https://example.com/">link text</Link>
      <Link label="link text" url="https://example.com/" />
      <Link label="link text" url="https://example.com/" disabled />
    </>,
  )

  await assertMessages(adapter, [
    {
      content: "",
      embeds: [],
      actionRows: [
        [
          {
            type: "link",
            url: "https://example.com/",
            label: "link text",
          },
          {
            type: "link",
            url: "https://example.com/",
            label: "link text",
          },
          {
            type: "link",
            url: "https://example.com/",
            label: "link text",
            disabled: true,
          },
        ],
      ],
    },
  ])
})
