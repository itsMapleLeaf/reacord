import { nextTick } from "node:process"
import { promisify } from "node:util"
import { omit } from "../helpers/omit"
import type { TestAdapter } from "../library/testing"

const nextTickPromise = promisify(nextTick)

export async function assertMessages(
  adapter: TestAdapter,
  expected: ReturnType<typeof extractMessageDataSample>,
) {
  await nextTickPromise()
  expect(extractMessageDataSample(adapter)).toEqual(expected)
}

function extractMessageDataSample(adapter: TestAdapter) {
  return adapter.messages.map((message) => ({
    ...message.options,
    actionRows: message.options.actionRows.map((row) =>
      row.map((component) => omit(component, ["customId"])),
    ),
  }))
}
