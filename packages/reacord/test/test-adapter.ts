/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import { logPretty } from "@reacord/helpers/log-pretty"
import { omit } from "@reacord/helpers/omit"
import { pruneNullishValues } from "@reacord/helpers/prune-nullish-values"
import { raise } from "@reacord/helpers/raise"
import { waitFor } from "@reacord/helpers/wait-for"
import { randomUUID } from "node:crypto"
import { setTimeout } from "node:timers/promises"
import type { ReactNode } from "react"
import type {
  ChannelInfo,
  GuildInfo,
  MessageInfo,
  UserInfo,
} from "../library/core/component-event"
import type { ButtonClickEvent } from "../library/core/components/button"
import type { SelectChangeEvent } from "../library/core/components/select"
import type { ReacordInstance } from "../library/core/instance"
import { Reacord } from "../library/core/reacord"
import type { Channel } from "../library/internal/channel"
import { Container } from "../library/internal/container"
import type {
  ButtonInteraction,
  CommandInteraction,
  ComponentInteraction,
  SelectInteraction,
} from "../library/internal/interaction"
import type { Message, MessageButtonOptions, MessageOptions } from "../library/internal/message"
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

  override send(initialContent?: ReactNode, channel?: Channel): ReacordInstance {
    return this.createInstance(
      new ChannelMessageRenderer(channel ?? new TestChannel(this.messageContainer)),
      initialContent,
    )
  }

  override reply(initialContent?: ReactNode, interaction?: CommandInteraction): ReacordInstance {
    return this.createInstance(
      new InteractionReplyRenderer(
        interaction ?? new TestCommandInteraction(this.messageContainer),
      ),
      initialContent,
    )
  }

  override ephemeralReply(initialContent?: ReactNode): ReacordInstance {
    return this.reply(initialContent)
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
    for (const [component, message] of this.eachComponent()) {
      const data = message.findButtonByLabel(label, this)
      if (data) return data;
    }
  }

  async click(message: TestMessage, customId: string) {
    this.handleComponentInteraction(
      new TestButtonInteraction(customId, message, this),
    )
    await setTimeout(500) // Allow time for defer update to run
  }

  async select(message: TestMessage, customId: string, values: string[]) {
    this.handleComponentInteraction(
      new TestSelectInteraction(
        customId,
        message,
        values,
        this,
      ),
    )
    await setTimeout(500) // Allow time for defer update to run

  }

  findSelectByPlaceholder(placeholder: string) {
    for (const [component, message] of this.eachComponent()) {
      const select = message.findSelectByPlaceholder(placeholder, this)
      if (select)
        return select;
    }
  }

  createMessage(options: MessageOptions) {
    return new TestMessage(options, this.messageContainer)
  }

  private * eachComponent() {
    for (const message of this.messageContainer) {
      for (const component of message.options.actionRows.flat()) {
        yield [component, message] as const
      }
    }
  }
}

export class TestMessage implements Message {
  constructor(
    public options: MessageOptions,
    private container: Container<TestMessage>,
  ) {
    container.add(this)
  }

  public findButtonByLabel(label: string, reacord: ReacordTester) {
    for (const row of this.options.actionRows) {
      for (const component of row) {
        if (component.type === "button" && component.label === label) {
          return {
            click: (buttonInteraction?: ComponentInteraction) => {
              return waitFor(() =>
                reacord.click(this, component.customId)
              )
            },
            ...component
          }
        }
      }
    }
  }

  public findSelectByPlaceholder(placeholder: string, reacord: ReacordTester) {
    for (const row of this.options.actionRows) {
      for (const component of row) {
        if (
          component.type === "select" &&
          component.placeholder === placeholder
        ) {
          return {
            select: (...values: string[]) => {
              return waitFor(() => reacord.select
              )
            },
            ...component,
          }
        }
      }
    }
  }
  async edit(options: MessageOptions): Promise<void> {
    this.options = options
  }

  async delete(): Promise<void> {
    this.container.remove(this)
  }
}

export class TestCommandInteraction implements CommandInteraction {
  readonly type = "command"
  readonly id = "test-command-interaction"
  readonly channelId = "test-channel-id"

  constructor(private messageContainer: Container<TestMessage>) { }

  async reply(messageOptions: MessageOptions): Promise<Message> {
    await setTimeout()
    return new TestMessage(messageOptions, this.messageContainer)
  }

  async followUp(messageOptions: MessageOptions): Promise<Message> {
    await setTimeout()
    return new TestMessage(messageOptions, this.messageContainer)
  }
}

export class TestInteraction {
  readonly id = randomUUID()
  readonly channelId = "test-channel-id"

  constructor(
    readonly customId: string,
    readonly message: TestMessage,
    private tester: ReacordTester,
  ) { }

  async update(options: MessageOptions): Promise<void> {
    this.message.options = options
  }

  async deferUpdate(): Promise<void> { }

  async reply(messageOptions: MessageOptions): Promise<Message> {
    return this.tester.createMessage(messageOptions)
  }

  async followUp(messageOptions: MessageOptions): Promise<Message> {
    return this.tester.createMessage(messageOptions)
  }
}

export class TestButtonInteraction
  extends TestInteraction
  implements ButtonInteraction {
  readonly type = "button"
  readonly event: ButtonClickEvent

  constructor(customId: string, message: TestMessage, tester: ReacordTester) {
    super(customId, message, tester)
    this.event = new TestButtonClickEvent(tester)

  }
}

export class TestSelectInteraction
  extends TestInteraction
  implements SelectInteraction {
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

export class TestComponentEvent {
  constructor(private tester: ReacordTester) { }

  message: MessageInfo = {} as any // todo
  channel: ChannelInfo = {} as any // todo
  user: UserInfo = {} as any // todo
  guild: GuildInfo = {} as any // todo

  reply(content?: ReactNode): ReacordInstance {
    return this.tester.reply(content)
  }

  ephemeralReply(content?: ReactNode): ReacordInstance {
    return this.tester.ephemeralReply(content)
  }
}

export class TestButtonClickEvent
  extends TestComponentEvent
  implements ButtonClickEvent { }

export class TestSelectChangeEvent
  extends TestComponentEvent
  implements SelectChangeEvent {
  constructor(readonly values: string[], tester: ReacordTester) {
    super(tester)
  }
}

export class TestChannel implements Channel {
  constructor(private messageContainer: Container<TestMessage>) { }

  async send(messageOptions: MessageOptions): Promise<Message> {
    return new TestMessage(messageOptions, this.messageContainer)
  }
}
