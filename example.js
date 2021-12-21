/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
// @ts-nocheck
function KitchenSink() {
  return (
    <>
      {/* content */}
      some random text **here** all of it gets merged into the message content,
      separated by space
      <UserMention id="123" />
      <TimeStamp
        dateTime="someisostringormsunixtimestamp"
        format="long|short|relative|etc"
      />
      {/* embeds */}
      <Embed
        color="firebrick"
        title="the embed"
        url="https://example.com"
        timestamp={new Date().toISOString()}
        thumbnailUrl="https://example.com/thumbnail.png"
        author={{
          name: "the author",
          url: "https://example.com",
          iconUrl: "https://example.com/icon.png",
        }}
        footer={{
          text: "the footer",
          iconUrl: "https://example.com/icon.png",
        }}
      >
        description{"\n"}
        aaaaaaaaa
        <EmbedField name="field name">field content</EmbedField>
        <EmbedField name="field name" inline>
          field content but inline
        </EmbedField>
        <EmbedImage url="https://example.com/image.png" />
        <EmbedImage url="https://example.com/image.png" />
        <EmbedImage url="https://example.com/image.png" />
        <EmbedImage url="https://example.com/image.png" />
      </Embed>
      {/* files */}
      <File url="data:sdklfjs" />
      {/* components */}
      <Button
        label="increment"
        style="primary"
        disabled={false}
        emoji="🌌"
        onClick={(event) => {
          // event has stuff on it
        }}
      />
      <ActionRow>
        <Link
          label="increment"
          style="primary"
          disabled={false}
          emoji="🌌"
          url="https://example.com"
        />
      </ActionRow>
      <Select
        value="1"
        disabled={false}
        placholder="pick a number"
        minValues={1}
        maxValues={10}
      >
        <SelectOption value="1" description="one" emoji="1️⃣">
          one
        </SelectOption>
        <SelectOption value="2" description="two" emoji="2️⃣">
          two
        </SelectOption>
        <SelectOption value="3" description="three" emoji="3️⃣">
          three
        </SelectOption>
      </Select>
      {/* ???? */}
      <TextInput></TextInput>
      {/* select */}
    </>
  )
}
