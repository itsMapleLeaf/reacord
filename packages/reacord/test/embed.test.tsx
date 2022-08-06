import React from "react"
import { beforeAll, expect, test } from "vitest"
import {
  Embed,
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  EmbedThumbnail,
  EmbedTitle,
} from "../library/main"
import { ReacordTester } from "./tester"

let tester: ReacordTester
beforeAll(async () => {
  tester = await ReacordTester.create()
})

test("kitchen sink", async () => {
  const now = new Date()

  const { message } = await tester.render(
    "kitchen sink",
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
  )

  expect(message.embeds.map((e) => e.toJSON())).toEqual([
    expect.objectContaining({
      description: "description text",
      author: expect.objectContaining({
        icon_url: "https://example.com/author.png",
        name: "author",
      }),
      color: 0xfe_ee_ef,
      fields: [
        {
          inline: true,
          name: "field name",
          value: "field value",
        },
        {
          inline: false,
          name: "block field",
          value: "block field value",
        },
      ],
      footer: expect.objectContaining({
        icon_url: "https://example.com/footer.png",
        text: "footer text",
      }),
      image: expect.objectContaining({
        url: "https://example.com/image.png",
      }),
      thumbnail: expect.objectContaining({
        url: "https://example.com/thumbnail.png",
      }),
      title: "title text",
    }),
  ])

  // the timestamp format from Discord is not the same one that JS makes
  expect(new Date(message.embeds[0]!.timestamp!)).toEqual(now)
})

test("author variants", async () => {
  const { message } = await tester.render(
    "author variants",
    <>
      <Embed>
        <EmbedAuthor iconUrl="https://example.com/author.png">
          author name 1
        </EmbedAuthor>
      </Embed>
      <Embed>
        <EmbedAuthor
          name="author name 2"
          iconUrl="https://example.com/author.png"
        />
      </Embed>
    </>,
  )

  expect(message.embeds.map((e) => e.toJSON())).toEqual([
    expect.objectContaining({
      author: expect.objectContaining({
        name: "author name 1",
        icon_url: "https://example.com/author.png",
      }),
    }),
    expect.objectContaining({
      author: expect.objectContaining({
        name: "author name 2",
        icon_url: "https://example.com/author.png",
      }),
    }),
  ])
}, 20_000)

test("field variants", async () => {
  const { message } = await tester.render(
    "field variants",
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
  )

  expect(message.embeds.map((e) => e.toJSON())).toEqual([
    expect.objectContaining({
      fields: [
        {
          name: "field name",
          value: "field value",
          inline: false,
        },
        {
          name: "field name",
          value: "field value",
          inline: true,
        },
        {
          name: "field name",
          value: "field value",
          inline: true,
        },
        {
          name: "field name",
          value: "_ _",
          inline: false,
        },
      ],
    }),
  ])
})

test("footer variants", async () => {
  const now = new Date()

  const { message } = await tester.render(
    "footer variants",
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
  )

  expect(message.embeds.map((e) => e.toJSON())).toEqual([
    expect.objectContaining({
      footer: {
        text: "footer text",
      },
    }),
    expect.objectContaining({
      footer: expect.objectContaining({
        icon_url: "https://example.com/footer.png",
        text: "footer text",
      }),
    }),
    expect.objectContaining({
      timestamp: expect.stringContaining(""),
    }),
    expect.objectContaining({
      timestamp: expect.stringContaining(""),
    }),
  ])

  expect(new Date(message.embeds[2]!.timestamp!)).toEqual(now)
  expect(new Date(message.embeds[3]!.timestamp!)).toEqual(now)
})

test.only("embed props", async () => {
  const now = new Date()

  const { message } = await tester.render(
    "embed props",
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
  )

  expect(message.embeds.map((e) => e.toJSON())).toEqual([
    expect.objectContaining({
      title: "title text",
      description: "description text",
      url: "https://example.com/",
      color: 0xfe_ee_ef,
      author: expect.objectContaining({
        name: "author name",
        url: "https://example.com/author",
        icon_url: "https://example.com/author.png",
      }),
      thumbnail: expect.objectContaining({
        url: "https://example.com/thumbnail.png",
      }),
      image: expect.objectContaining({ url: "https://example.com/image.png" }),
      footer: expect.objectContaining({
        text: "footer text",
        icon_url: "https://example.com/footer.png",
      }),
      fields: [
        { name: "field name", value: "field value", inline: true },
        { name: "block field", value: "block field value", inline: false },
      ],
    }),
  ])

  expect(new Date(message.embeds[0]!.timestamp!)).toEqual(now)
})
