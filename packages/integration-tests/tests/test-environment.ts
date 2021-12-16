import "dotenv/config.js"
import { raise } from "reacord-helpers/raise.js"

function getEnvironmentValue(name: string) {
  return process.env[name] ?? raise(`Missing environment variable: ${name}`)
}

export const testBotToken = getEnvironmentValue("TEST_BOT_TOKEN")
// export const testGuildId = getEnvironmentValue("TEST_GUILD_ID")
export const testChannelId = getEnvironmentValue("TEST_CHANNEL_ID")
