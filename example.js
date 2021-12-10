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
      <Embed color="firebrick">
        <EmbedAuthor url="subscribe to my patreon" iconUrl="data:whatever">
          author name
        </EmbedAuthor>
        <EmbedTitle url="https://example.com">title</EmbedTitle>
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
        <EmbedThumbnail url="https://example.com/image.png" />
        <EmbedFooter iconUrl="data:whatever" timestamp={Date.now()}>
          footer content
        </EmbedFooter>
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
