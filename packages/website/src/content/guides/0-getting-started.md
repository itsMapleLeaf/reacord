---
title: Getting Started
description: Learn how to get started with Reacord.
slug: getting-started
---

# Getting Started

These guides assume some familiarity with [JavaScript](https://developer.mozilla.org/en-US/docs/Web/javascript), [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org), [Discord.js](https://discord.js.org) and the [Discord API](https://discord.dev). Keep these pages as reference if you need it.

## Setup from template

[Use this starter template](https://github.com/itsMapleLeaf/reacord-starter) to get off the ground quickly.

## Adding to an existing project

Install Reacord and dependencies:

```bash
# npm
npm install reacord react discord.js

# yarn
yarn add reacord react discord.js

# pnpm
pnpm add reacord react discord.js
```

Create a Discord.js client and a Reacord instance:

```ts
import { Client, Events } from "discord.js"
import { ReacordDiscordJs } from "reacord"

const client = new Client()
const reacord = new ReacordDiscordJs(client)

client.once(Events.ClientReady, () => {
	console.log("Ready!")
})

await client.login(process.env.BOT_TOKEN)
```
