---
title: Embeds
description: Using embed components
slug: embeds
---

# Embeds

Reacord comes with an `<Embed />` component for sending rich embeds.

```tsx
import { Embed } from "reacord"

interface FancyMessageProps {
	title: string
	description: string
}

function FancyMessage({ title, description }: FancyMessageProps) {
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

```tsx
reacord
	.createChannelMessage(channel)
	.render(<FancyMessage title="Hello" description="World" />)
```

Reacord also comes with multiple embed components, for defining embeds on a piece-by-piece basis. This enables composition:

```tsx
import { Embed, EmbedTitle } from "reacord"

interface FancyDetailsProps {
	title: string
	description: string
}

function FancyDetails({ title, description }: FancyDetailsProps) {
	return (
		<>
			<EmbedTitle>{title}</EmbedTitle>
			{/* embed descriptions are just text */}
			{description}
		</>
	)
}

interface FancyMessageProps {
	children: React.ReactNode
}

function FancyMessage({ children }: FancyMessageProps) {
	return (
		<Embed color={0x00ff00} timestamp={Date.now()}>
			{children}
		</Embed>
	)
}
```

```tsx
reacord.createChannelMessage(channel).render(
	<FancyMessage>
		<FancyDetails title="Hello" description="World" />
	</FancyMessage>,
)
```

See the [API Reference](/api/index.html#EmbedAuthorProps) for the full list of embed components.
