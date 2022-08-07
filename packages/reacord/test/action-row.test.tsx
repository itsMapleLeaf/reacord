import { ComponentType } from "discord.js"
import React from "react"
import { beforeAll, expect, test } from "vitest"
import { ActionRow, Button, Option, Select } from "../src/main"
import { ReacordTester } from "./tester"

let tester: ReacordTester
beforeAll(async () => {
  tester = await ReacordTester.create()
})

test("action row", async () => {
  const { message } = await tester.render(
    "action row",
    <>
      <Button label="outside button" onClick={() => {}} />
      <ActionRow>
        <Button label="button inside action row" onClick={() => {}} />
      </ActionRow>
      <Select value="the">
        <Option value="the" />
      </Select>
      <Button label="last row 1" onClick={() => {}} />
      <Button label="last row 2" onClick={() => {}} />
    </>,
  )

  expect(message.components.map((c) => c.toJSON())).toEqual([
    {
      type: ComponentType.ActionRow,
      components: [
        expect.objectContaining({
          type: ComponentType.Button,
          label: "outside button",
        }),
      ],
    },
    {
      type: ComponentType.ActionRow,
      components: [
        expect.objectContaining({
          type: ComponentType.Button,
          label: "button inside action row",
        }),
      ],
    },
    {
      type: ComponentType.ActionRow,
      components: [expect.objectContaining({ type: ComponentType.SelectMenu })],
    },
    {
      type: ComponentType.ActionRow,
      components: [
        expect.objectContaining({
          type: ComponentType.Button,
          label: "last row 1",
        }),
        expect.objectContaining({
          type: ComponentType.Button,
          label: "last row 2",
        }),
      ],
    },
  ])
})
