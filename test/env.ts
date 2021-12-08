import "dotenv/config.js"
import { raise } from "../src/helpers/raise.js"

function getEnv(name: string) {
  return process.env[name] ?? raise(`Missing environment variable: ${name}`)
}

export const testBotToken = getEnv("TEST_BOT_TOKEN")
export const testGuildId = getEnv("TEST_GUILD_ID")
export const testChannelId = getEnv("TEST_CHANNEL_ID")
