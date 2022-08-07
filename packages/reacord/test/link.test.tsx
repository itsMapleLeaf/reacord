import { ButtonStyle, ComponentType } from "discord.js"
import React from "react"
import { beforeEach, expect, test } from "vitest"
import { Link } from "../src/main"
import { ReacordTester } from "./tester"

let tester: ReacordTester
beforeEach(async () => {
  tester = await ReacordTester.create()
})

test("link", async () => {
  const { message } = await tester.render(
    "link",
    <>
      <Link url="https://example.com/">link text</Link>
      <Link label="link text" url="https://example.com/" />
      <Link label="link text" url="https://example.com/" disabled />
    </>,
  )

  expect(message.components.map((c) => c.toJSON())).toEqual([
    {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Link,
          url: "https://example.com/",
          label: "link text",
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Link,
          url: "https://example.com/",
          label: "link text",
        },
        {
          type: ComponentType.Button,
          style: ButtonStyle.Link,
          url: "https://example.com/",
          label: "link text",
          disabled: true,
        },
      ],
    },
  ])
})
