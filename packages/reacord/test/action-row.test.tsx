import React from "react"
import { test } from "vitest"
import { ActionRow, Button, Select } from "../library/main"
import { ReacordTester } from "./test-adapter"
import { assertRender } from "./utils"

const testing = new ReacordTester()

test("action row", async () => {
  await assertRender(testing,
    <>
      <Button label="outside button" onClick={() => {}} />
      <ActionRow>
        <Button label="button inside action row" onClick={() => {}} />
      </ActionRow>
      <Select />
      <Button label="last row 1" onClick={() => {}} />
      <Button label="last row 2" onClick={() => {}} />
    </>,
    [
      {
        content: "",
        embeds: [],
        actionRows: [
          [{ type: "button", style: "secondary", label: "outside button" }],
          [
            {
              type: "button",
              style: "secondary",
              label: "button inside action row",
            },
          ],
          [{ type: "select", options: [], values: [] }],
          [
            { type: "button", style: "secondary", label: "last row 1" },
            { type: "button", style: "secondary", label: "last row 2" },
          ],
        ],
      },
    ],
  )
})
