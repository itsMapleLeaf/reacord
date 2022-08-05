import type { ClientOptions } from "discord.js"
import { Client } from "discord.js"
import { once } from "node:events"

export async function createDiscordClient(
  token: string,
  options: ClientOptions,
) {
  const client = new Client(options)
  await client.login(token)
  const [readyClient] = await once(client, "ready")
  return readyClient
}
