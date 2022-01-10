import React from "react"
import { test } from "vitest"
import { ReacordTester } from "../library/core/reacord-tester"
import {
  Embed,
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  EmbedThumbnail,
  EmbedTitle,
} from "../library/main"

const testing = new ReacordTester()

test("kitchen sink", async () => {
  const now = new Date()

  await testing.assertRender(
    <>
      <Embed color={0xfe_ee_ef}>
        <EmbedAuthor name="author" iconUrl="https://example.com/author.png" />
        <EmbedTitle>title text</EmbedTitle>
        description text
        <EmbedThumbnail url="https://example.com/thumbnail.png" />
        <EmbedImage url="https://example.com/image.png" />
        <EmbedField name="field name" value="field value" inline />
        <EmbedField name="block field" value="block field value" />
        <EmbedFooter
          text="footer text"
          iconUrl="https://example.com/footer.png"
          timestamp={now}
        />
      </Embed>
    </>,
    [
      {
        actionRows: [],
        content: "",
        embeds: [
          {
            description: "description text",
            author: {
              icon_url: "https://example.com/author.png",
              name: "author",
            },
            color: 0xfe_ee_ef,
            fields: [
              {
                inline: true,
                name: "field name",
                value: "field value",
              },
              {
                name: "block field",
                value: "block field value",
              },
            ],
            footer: {
              icon_url: "https://example.com/footer.png",
              text: "footer text",
            },
            image: {
              url: "https://example.com/image.png",
            },
            thumbnail: {
              url: "https://example.com/thumbnail.png",
            },
            timestamp: now.toISOString(),
            title: "title text",
          },
        ],
      },
    ],
  )
})

test("author variants", async () => {
  await testing.assertRender(
    <>
      <Embed>
        <EmbedAuthor iconUrl="https://example.com/author.png">
          author name
        </EmbedAuthor>
      </Embed>
      <Embed>
        <EmbedAuthor iconUrl="https://example.com/author.png" />
      </Embed>
    </>,
    [
      {
        content: "",
        actionRows: [],
        embeds: [
          {
            author: {
              icon_url: "https://example.com/author.png",
              name: "author name",
            },
          },
          {
            author: {
              icon_url: "https://example.com/author.png",
              name: "",
            },
          },
        ],
      },
    ],
  )
})

test("field variants", async () => {
  await testing.assertRender(
    <>
      <Embed>
        <EmbedField name="field name" value="field value" />
        <EmbedField name="field name" value="field value" inline />
        <EmbedField name="field name" inline>
          field value
        </EmbedField>
        <EmbedField name="field name" />
      </Embed>
    </>,
    [
      {
        content: "",
        actionRows: [],
        embeds: [
          {
            fields: [
              {
                name: "field name",
                value: "field value",
              },
              {
                inline: true,
                name: "field name",
                value: "field value",
              },
              {
                inline: true,
                name: "field name",
                value: "field value",
              },
              {
                name: "field name",
                value: "",
              },
            ],
          },
        ],
      },
    ],
  )
})

test("footer variants", async () => {
  const now = new Date()

  await testing.assertRender(
    <>
      <Embed>
        <EmbedFooter text="footer text" />
      </Embed>
      <Embed>
        <EmbedFooter
          text="footer text"
          iconUrl="https://example.com/footer.png"
        />
      </Embed>
      <Embed>
        <EmbedFooter timestamp={now}>footer text</EmbedFooter>
      </Embed>
      <Embed>
        <EmbedFooter iconUrl="https://example.com/footer.png" timestamp={now} />
      </Embed>
    </>,
    [
      {
        content: "",
        actionRows: [],
        embeds: [
          {
            footer: {
              text: "footer text",
            },
          },
          {
            footer: {
              icon_url: "https://example.com/footer.png",
              text: "footer text",
            },
          },
          {
            footer: {
              text: "footer text",
            },
            timestamp: now.toISOString(),
          },
          {
            footer: {
              icon_url: "https://example.com/footer.png",
              text: "",
            },
            timestamp: now.toISOString(),
          },
        ],
      },
    ],
  )
})

test("embed props", async () => {
  const now = new Date()

  await testing.assertRender(
    <Embed
      title="title text"
      description="description text"
      url="https://example.com/"
      color={0xfe_ee_ef}
      timestamp={now}
      author={{
        name: "author name",
        url: "https://example.com/author",
        iconUrl: "https://example.com/author.png",
      }}
      thumbnail={{
        url: "https://example.com/thumbnail.png",
      }}
      image={{
        url: "https://example.com/image.png",
      }}
      footer={{
        text: "footer text",
        iconUrl: "https://example.com/footer.png",
      }}
      fields={[
        { name: "field name", value: "field value", inline: true },
        { name: "block field", value: "block field value" },
      ]}
    />,
    [
      {
        content: "",
        actionRows: [],
        embeds: [
          {
            title: "title text",
            description: "description text",
            url: "https://example.com/",
            color: 0xfe_ee_ef,
            timestamp: now.toISOString(),
            author: {
              name: "author name",
              url: "https://example.com/author",
              icon_url: "https://example.com/author.png",
            },
            thumbnail: { url: "https://example.com/thumbnail.png" },
            image: { url: "https://example.com/image.png" },
            footer: {
              text: "footer text",
              icon_url: "https://example.com/footer.png",
            },
            fields: [
              { name: "field name", value: "field value", inline: true },
              { name: "block field", value: "block field value" },
            ],
          },
        ],
      },
    ],
  )
})
