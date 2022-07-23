import * as React from "react"
import { test } from "vitest"
import {
  Button,
  Embed,
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedTitle,
  Link,
  Option,
  Select,
} from "../library/main"
import { ReacordTester } from "./test-adapter"

test("text children in other components", async () => {
  const tester = new ReacordTester()

  const SomeText = () => <>some text</>

  await tester.assertRender(
    <>
      <Embed>
        <EmbedTitle>
          <SomeText />
        </EmbedTitle>
        <EmbedAuthor>
          <SomeText />
        </EmbedAuthor>
        <EmbedField name={<SomeText />}>
          <SomeText /> <Button label="ignore this" onClick={() => {}} />
          nailed it
        </EmbedField>
        <EmbedFooter>
          <SomeText />
        </EmbedFooter>
      </Embed>
      <Button label={<SomeText />} onClick={() => {}} />
      <Link url="https://discord.com" label={<SomeText />} />
      <Select>
        <Option value="1">
          <SomeText />
        </Option>
        <Option value="2" label={<SomeText />} description={<SomeText />} />
      </Select>
    </>,
    [
      {
        content: "",
        embeds: [
          {
            title: "some text",
            author: {
              name: "some text",
            },
            fields: [{ name: "some text", value: "some text nailed it" }],
            footer: {
              text: "some text",
            },
          },
        ],
        actionRows: [
          [
            {
              type: "button",
              label: "some text",
              style: "secondary",
            },
            {
              type: "link",
              url: "https://discord.com",
              label: "some text",
            },
          ],
          [
            {
              type: "select",
              values: [],
              options: [
                { value: "1", label: "some text" },
                { value: "2", label: "some text", description: "some text" },
              ],
            },
          ],
        ],
      },
    ],
  )
})
