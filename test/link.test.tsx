import React from "react"
import { Link } from "../library/main"
import { setupReacordTesting } from "./setup-testing"

const { assertRender } = setupReacordTesting()

test("link", async () => {
  await assertRender(
    <>
      <Link url="https://example.com/">link text</Link>
      <Link label="link text" url="https://example.com/" />
      <Link label="link text" url="https://example.com/" disabled />
    </>,
    [
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
    ],
  )
})
