---
order: 1
title: Sending Messages
description: Sending messages by creating Reacord instances
---

# Sending Messages with Instances

You can send messages via Reacord to a channel like so.

```jsx
const channelId = "abc123deadbeef"

client.on("ready", () => {
  reacord.send(channelId, "Hello, world!")
})
```

The `.send()` function creates a **Reacord instance**. You can pass strings, numbers, or anything that can be rendered by React, such as JSX!

Components rendered through this instance can include state and effects, and the message on Discord will update automatically.

```jsx
function Uptime() {
  const [startTime] = useState(Date.now())
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      currentTime(Date.now())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return <>this message has been shown for {currentTime - startTime}ms</>
}

client.on("ready", () => {
  reacord.send(channelId, <Uptime />)
})
```

The instance can be rendered to multiple times, which will update the message each time.

```jsx
const Hello = ({ subject }) => <>Hello, {subject}!</>

client.on("ready", () => {
  const instance = reacord.send(channel)
  instance.render(<Hello subject="World" />)
  instance.render(<Hello subject="Moon" />)
})
```

## Cleaning Up Instances

If you no longer want to use the instance, you can clean it up in a few ways:

- `instance.destroy()` - This will remove the message.
- `instance.deactivate()` - This will keep the message, but it will disable the components on the message, and no longer listen to user interactions.

By default, Reacord has a max limit on the number of active instances, and deactivates older instances to conserve memory. This can be configured through the Reacord options:

```js
const reacord = new ReacordDiscordJs(client, {
  // after sending four messages,
  // the first one will be deactivated
  maxInstances: 3,
})
```

## Discord Slash Commands

<aside>
This section also applies to other kinds of application commands, such as context menu commands.
</aside>

To reply to a command interaction, use the `.reply()` function. This function returns an instance that works the same way as the one from `.send()`. Here's an example:

```jsx
import { Client } from "discord.js"
import * as React from "react"
import { Button, ReacordDiscordJs } from "reacord"

const client = new Client({ intents: [] })
const reacord = new ReacordDiscordJs(client)

client.on("ready", () => {
  client.application?.commands.create({
    name: "pong",
    description: "pong!",
  })
})

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "pong") {
    // Use the reply() function instead of send
    reacord.reply(interaction, <>pong</>)
  }
})

client.login(process.env.DISCORD_TOKEN)
```

<aside>
This example uses <a href="https://discord.com/developers/docs/interactions/application-commands#registering-a-command">global commands</a>, so the command might take a while to show up 😅
</aside>

However, the process of creating commands can get really repetitive and error-prone. A command framework could help with this, or you could make a small helper:

```jsx
function handleCommands(client, commands) {
  client.on("ready", () => {
    for (const { name, description } of commands) {
      client.application?.commands.create({ name, description })
    }
  })

  client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
      for (const command of commands) {
        if (interaction.commandName === command.name) {
          command.run(interaction)
        }
      }
    }
  })
}
```

```jsx
handleCommands(client, [
  {
    name: "pong",
    description: "pong!",
    run: (interaction) => {
      reacord.reply(interaction, <>pong</>)
    },
  },
  {
    name: "hi",
    description: "say hi",
    run: (interaction) => {
      reacord.reply(interaction, <>hi</>)
    },
  },
])
```

## Ephemeral Command Replies

Ephemeral replies are replies that only appear for one user. To create them, use the `.ephemeralReply()` function.

```tsx
handleCommands(client, [
  {
    name: "pong",
    description: "pong, but in secret",
    run: (interaction) => {
      reacord.ephemeralReply(interaction, <>(pong)</>)
    },
  },
])
```

The `ephemeralReply` function also returns an instance, but ephemeral replies cannot be updated via `instance.render()`. You can `.deactivate()` them, but `.destroy()` will not delete the message; only the user can hide it from view.
