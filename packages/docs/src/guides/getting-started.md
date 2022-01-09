---
order: 0
title: Getting Started
description: Learn how to get started with Reacord.
---

# Getting Started

This guide assumes some familiarity with JavaScript, [React](https://reactjs.org), [Discord.js](https://discord.js.org) and the [Discord API](https://discord.dev). Keep these pages as reference if you need it.

**Note:** Ensure your project has support for running code with JSX. I recommend using [esno](https://npm.im/esno).

## Install

```bash
# npm
npm install reacord react discord.js

# yarn
yarn add reacord react discord.js

# pnpm
pnpm add reacord react discord.js
```

## Setup

Create a Discord.js client and a Reacord instance:

```js
// main.js
import { Client } from "discord.js"
import { ReacordDiscordJs } from "reacord"

const client = new Client()
const reacord = new ReacordDiscordJs(client)

client.on("ready", () => {
  console.log("Ready!")
})

await client.login(process.env.BOT_TOKEN)
```
