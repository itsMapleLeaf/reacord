import { nextTick } from "node:process"
import { promisify } from "node:util"
import type { ReactNode } from "react"
import { logPretty } from "../helpers/log-pretty"
import { omit } from "../helpers/omit"
import { Reacord } from "../library/main"
import { TestAdapter, TestCommandInteraction } from "../library/testing"

const nextTickPromise = promisify(nextTick)

export function setupReacordTesting() {
  const adapter = TestAdapter.create()
  const reacord = new Reacord({ adapter })
  const reply = reacord.reply(new TestCommandInteraction(adapter))

  async function assertMessages(expected: ReturnType<typeof sampleMessages>) {
    await nextTickPromise() // wait for the render to complete
    expect(sampleMessages(adapter)).toEqual(expected)
  }

  async function assertRender(
    content: ReactNode,
    expected: ReturnType<typeof sampleMessages>,
  ) {
    reply.render(content)
    await assertMessages(expected)
  }

  function logMessages() {
    logPretty(sampleMessages(adapter))
  }

  return {
    reacord,
    adapter,
    reply,
    assertMessages,
    assertRender,
    logMessages,
  }
}

function sampleMessages(adapter: TestAdapter) {
  return adapter.messages.map((message) => ({
    ...message.options,
    actionRows: message.options.actionRows.map((row) =>
      row.map((component) =>
        omit(component, ["customId", "onClick", "onSelect", "onSelectValue"]),
      ),
    ),
  }))
}
