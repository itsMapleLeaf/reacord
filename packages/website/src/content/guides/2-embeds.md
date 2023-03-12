---
title: Embeds
description: Using embed components
slug: embeds
---

# Embeds

Reacord comes with an `<Embed />` component for sending rich embeds.

```jsx
import { Embed } from "reacord"

function FancyMessage({ title, description }) {
  return (
    <Embed
      title={title}
      description={description}
      color={0x00ff00}
      timestamp={Date.now()}
    />
  )
}
```

```jsx
reacord.send(channelId, <FancyMessage title="Hello" description="World" />)
```

Reacord also comes with multiple embed components, for defining embeds on a piece-by-piece basis. This enables composition:

```jsx
import { Embed, EmbedTitle } from "reacord"

function FancyDetails({ title, description }) {
  return (
    <>
      <EmbedTitle>{title}</EmbedTitle>
      {/* embed descriptions are just text */}
      {description}
    </>
  )
}

function FancyMessage({ children }) {
  return (
    <Embed color={0x00ff00} timestamp={Date.now()}>
      {children}
    </Embed>
  )
}
```

```jsx
reacord.send(
  channelId,
  <FancyMessage>
    <FancyDetails title="Hello" description="World" />
  </FancyMessage>,
)
```

See the [API Reference](/api/index.html#EmbedAuthorProps) for the full list of embed components.
