---
"reacord": minor
---

add new descriptive adapter methods

The reacord instance names have been updated, and the old names are now deprecated.

- `send` -> `createChannelMessage`
- `reply` -> `createInteractionReply`

These new methods also accept discord JS options. Usage example:

```ts
// can accept either a channel object or a channel ID
reacord.createChannelMessage(channel)
reacord.createChannelMessage(channel, {
	tts: true,
})
reacord.createChannelMessage(channel, {
	reply: {
		messageReference: "123456789012345678",
		failIfNotExists: false,
	},
})

reacord.createInteractionReply(interaction)
reacord.createInteractionReply(interaction, {
	ephemeral: true,
})
```

These new methods replace the old ones, which are now deprecated.
