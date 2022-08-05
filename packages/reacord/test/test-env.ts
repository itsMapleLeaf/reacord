import { raise } from "@reacord/helpers/raise"
import "dotenv/config"

const getEnv = (name: string) =>
  process.env[name] ?? raise(`Missing env var: ${name}`)

export const testEnv = {
  TEST_BOT_TOKEN: getEnv("TEST_BOT_TOKEN"),
  TEST_CATEGORY_ID: getEnv("TEST_CATEGORY_ID"),
}
