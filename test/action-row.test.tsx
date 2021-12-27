import React from "react"
import { ActionRow, Button, Select } from "../library/main"
import { setupReacordTesting } from "./setup-testing"

const { assertRender } = setupReacordTesting()

test("action row", async () => {
  await assertRender(
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
