/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import { logPretty } from "@reacord/helpers/log-pretty"
import { omit } from "@reacord/helpers/omit"
import { pruneNullishValues } from "@reacord/helpers/prune-nullish-values"
import { raise } from "@reacord/helpers/raise"
import { waitFor } from "@reacord/helpers/wait-for"
import type {
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
} from "discord.js"
import { randomUUID } from "node:crypto"
import { setTimeout } from "node:timers/promises"
import type { ReactNode } from "react"
import { expect } from "vitest"
import type { ButtonClickEvent } from "../library/core/components/button"
import type { SelectChangeEvent } from "../library/core/components/select"
import type { ReacordInstance } from "../library/core/instance"
import { Reacord } from "../library/core/reacord"
import type { Channel } from "../library/internal/channel"
import { Container } from "../library/internal/container"
import type {
  ButtonInteraction,
  CommandInteraction,
  SelectInteraction,
} from "../library/internal/interaction"
import type { Message, MessageOptions } from "../library/internal/message"
import { ChannelMessageRenderer } from "../library/internal/renderers/channel-message-renderer"
import { InteractionReplyRenderer } from "../library/internal/renderers/interaction-reply-renderer"

export type MessageSample = ReturnType<ReacordTester["sampleMessages"]>[0]

/**
 * A Record adapter for automated tests. WIP
 */
export class ReacordTester extends Reacord {
  private messageContainer = new Container<TestMessage>()

  constructor() {
    super({ maxInstances: 2 })
  }

  get messages(): readonly TestMessage[] {
    return [...this.messageContainer]
  }

  override send(initialContent?: ReactNode): ReacordInstance {
    return this.createInstance(
      new ChannelMessageRenderer(new TestChannel(this.messageContainer)),
      initialContent,
    )
  }

  override reply(initialContent?: ReactNode): ReacordInstance {
    return this.createInstance(
      new InteractionReplyRenderer(
        new TestCommandInteraction(this.messageContainer),
      ),
      initialContent,
    )
  }

  override ephemeralReply(initialContent?: ReactNode): ReacordInstance {
    return this.reply(initialContent)
  }

  assertMessages(expected: MessageSample[]) {
    return waitFor(() => {
      expect(this.sampleMessages()).toEqual(expected)
    })
  }

  async assertRender(content: ReactNode, expected: MessageSample[]) {
    const instance = this.reply()
    instance.render(content)
    await this.assertMessages(expected)
    instance.destroy()
  }

  logMessages() {
    logPretty(this.sampleMessages())
  }

  sampleMessages() {
    return pruneNullishValues(
      this.messages.map((message) => ({
        ...message.options,
        actionRows: message.options.actionRows.map((row) =>
          row.map((component) =>
            omit(component, [
              "customId",
              "onClick",
              "onSelect",
              "onSelectValue",
            ]),
          ),
        ),
      })),
    )
  }

  findButtonByLabel(label: string) {
    return {
      click: () => {
        return waitFor(() => {
          for (const [component, message] of this.eachComponent()) {
            if (component.type === "button" && component.label === label) {
              this.handleComponentInteraction(
                new TestButtonInteraction(component.customId, message, this),
              )
              return
            }
          }
          raise(`Couldn't find button with label "${label}"`)
        })
      },
    }
  }

  findSelectByPlaceholder(placeholder: string) {
    return {
      select: (...values: string[]) => {
        return waitFor(() => {
          for (const [component, message] of this.eachComponent()) {
            if (
              component.type === "select" &&
              component.placeholder === placeholder
            ) {
              this.handleComponentInteraction(
                new TestSelectInteraction(
                  component.customId,
                  message,
                  values,
                  this,
                ),
              )
              return
            }
          }
          raise(`Couldn't find select with placeholder "${placeholder}"`)
        })
      },
    }
  }

  createMessage(options: MessageOptions) {
    return new TestMessage(options, this.messageContainer)
  }

  private *eachComponent() {
    for (const message of this.messageContainer) {
      for (const component of message.options.actionRows.flat()) {
        yield [component, message] as const
      }
    }
  }
}

class TestMessage implements Message {
  constructor(
    public options: MessageOptions,
    private container: Container<TestMessage>,
  ) {
    container.add(this)
  }

  async edit(options: MessageOptions): Promise<void> {
    this.options = options
  }

  async delete(): Promise<void> {
    this.container.remove(this)
  }
}

class TestCommandInteraction implements CommandInteraction {
  readonly type = "command"
  readonly id = "test-command-interaction"
  readonly channelId = "test-channel-id"

  constructor(private messageContainer: Container<TestMessage>) {}

  async reply(messageOptions: MessageOptions): Promise<Message> {
    await setTimeout()
    return new TestMessage(messageOptions, this.messageContainer)
  }

  async followUp(messageOptions: MessageOptions): Promise<Message> {
    await setTimeout()
    return new TestMessage(messageOptions, this.messageContainer)
  }
}

class TestInteraction {
  readonly id = randomUUID()
  readonly channelId = "test-channel-id"

  constructor(
    readonly customId: string,
    readonly message: TestMessage,
    private tester: ReacordTester,
  ) {}

  async update(options: MessageOptions): Promise<void> {
    this.message.options = options
  }

  async deferUpdate(): Promise<void> {}

  async reply(messageOptions: MessageOptions): Promise<Message> {
    return this.tester.createMessage(messageOptions)
  }

  async followUp(messageOptions: MessageOptions): Promise<Message> {
    return this.tester.createMessage(messageOptions)
  }
}

class TestButtonInteraction
  extends TestInteraction
  implements ButtonInteraction
{
  readonly type = "button"
  readonly event: ButtonClickEvent

  constructor(customId: string, message: TestMessage, tester: ReacordTester) {
    super(customId, message, tester)
    this.event = new TestButtonClickEvent(tester)
  }
}

class TestSelectInteraction
  extends TestInteraction
  implements SelectInteraction
{
  readonly type = "select"
  readonly event: SelectChangeEvent

  constructor(
    customId: string,
    message: TestMessage,
    readonly values: string[],
    tester: ReacordTester,
  ) {
    super(customId, message, tester)
    this.event = new TestSelectChangeEvent(values, tester)
  }
}

class TestComponentEvent {
  constructor(private tester: ReacordTester) {}

  reply(content?: ReactNode): ReacordInstance {
    return this.tester.reply(content)
  }

  ephemeralReply(content?: ReactNode): ReacordInstance {
    return this.tester.ephemeralReply(content)
  }
}

class TestButtonClickEvent
  extends TestComponentEvent
  implements ButtonClickEvent
{
  interaction: APIMessageComponentButtonInteraction = {} as any // todo
}

class TestSelectChangeEvent
  extends TestComponentEvent
  implements SelectChangeEvent
{
  interaction: APIMessageComponentSelectMenuInteraction = {} as any // todo

  constructor(readonly values: string[], tester: ReacordTester) {
    super(tester)
  }
}

class TestChannel implements Channel {
  constructor(private messageContainer: Container<TestMessage>) {}

  async send(messageOptions: MessageOptions): Promise<Message> {
    return new TestMessage(messageOptions, this.messageContainer)
  }
}
