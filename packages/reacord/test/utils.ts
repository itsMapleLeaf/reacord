import { waitFor } from "@reacord/helpers/wait-for"
import type { ReactNode } from "react"
import { expect } from "vitest"
import type { MessageSample, ReacordTester } from "./test-adapter"

export async function assertMessages(expected: MessageSample[], sampleMessages: MessageSample[]) {
    return waitFor(() => {
        expect(sampleMessages).toEqual(expected)
    })
}


export async function assertRender(reacord: ReacordTester, content: ReactNode, expected: MessageSample[]) {
    const instance = reacord.reply()
    instance.render(content)
    await assertMessages(expected, reacord.sampleMessages())
    instance.destroy()
}
