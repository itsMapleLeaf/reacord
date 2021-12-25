import "dotenv/config"
import { test } from "vitest"
import { getEnvironmentValue } from "./helpers/get-environment-value.js"

const testBotToken = getEnvironmentValue("TEST_BOT_TOKEN")
const testChannelId = getEnvironmentValue("TEST_CHANNEL_ID")

test.todo("reacord")
