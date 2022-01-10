/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import { nanoid } from "nanoid"
import { nextTick } from "node:process"
import { promisify } from "node:util"
import type { ReactNode } from "react"
import { expect } from "vitest"
import { logPretty } from "../../helpers/log-pretty"
import { omit } from "../../helpers/omit"
import { raise } from "../../helpers/raise"
import type { Channel } from "../internal/channel"
import { Container } from "../internal/container"
import type {
  ButtonInteraction,
  CommandInteraction,
  SelectInteraction,
} from "../internal/interaction"
import type {
  Message,
  MessageButtonOptions,
  MessageOptions,
  MessageSelectOptions,
} from "../internal/message"
import { ChannelMessageRenderer } from "../internal/renderers/channel-message-renderer"
import { InteractionReplyRenderer } from "../internal/renderers/interaction-reply-renderer"
import type {
  ChannelInfo,
  GuildInfo,
  MessageInfo,
  UserInfo,
} from "./component-event"
import type { ButtonClickEvent } from "./components/button"
import type { SelectChangeEvent } from "./components/select"
import type { ReacordInstance } from "./instance"
import { Reacord } from "./reacord"

const nextTickPromise = promisify(nextTick)

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

  override send(): ReacordInstance {
    return this.createInstance(
      new ChannelMessageRenderer(new TestChannel(this.messageContainer)),
    )
  }

  override reply(): ReacordInstance {
    return this.createInstance(
      new InteractionReplyRenderer(
        new TestCommandInteraction(this.messageContainer),
      ),
    )
  }

  override ephemeralReply(): ReacordInstance {
    return this.reply()
  }

  async assertMessages(expected: ReturnType<this["sampleMessages"]>) {
    await nextTickPromise()
    expect(this.sampleMessages()).toEqual(expected)
  }

  async assertRender(
    content: ReactNode,
    expected: ReturnType<this["sampleMessages"]>,
  ) {
    const instance = this.reply()
    instance.render(content)
    await this.assertMessages(expected)
    instance.destroy()
  }

  logMessages() {
    logPretty(this.sampleMessages())
  }

  sampleMessages() {
    return this.messages.map((message) => ({
      ...message.options,
      actionRows: message.options.actionRows.map((row) =>
        row.map((component) =>
          omit(component, ["customId", "onClick", "onSelect", "onSelectValue"]),
        ),
      ),
    }))
  }

  findButtonByLabel(label: string) {
    for (const message of this.messageContainer) {
      for (const component of message.options.actionRows.flat()) {
        if (component.type === "button" && component.label === label) {
          return this.createButtonActions(component, message)
        }
      }
    }
    raise(`Couldn't find button with label "${label}"`)
  }

  findSelectByPlaceholder(placeholder: string) {
    for (const message of this.messageContainer) {
      for (const component of message.options.actionRows.flat()) {
        if (
          component.type === "select" &&
          component.placeholder === placeholder
        ) {
          return this.createSelectActions(component, message)
        }
      }
    }
    raise(`Couldn't find select with placeholder "${placeholder}"`)
  }

  createMessage(options: MessageOptions) {
    return new TestMessage(options, this.messageContainer)
  }

  private createButtonActions(
    button: MessageButtonOptions,
    message: TestMessage,
  ) {
    return {
      click: () => {
        this.handleComponentInteraction(
          new TestButtonInteraction(button.customId, message, this),
        )
      },
    }
  }

  private createSelectActions(
    component: MessageSelectOptions,
    message: TestMessage,
  ) {
    return {
      select: (...values: string[]) => {
        this.handleComponentInteraction(
          new TestSelectInteraction(component.customId, message, values, this),
        )
      },
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

  async disableComponents(): Promise<void> {
    for (const row of this.options.actionRows) {
      for (const action of row) {
        if (action.type === "button") {
          action.disabled = true
        }
      }
    }
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

  reply(messageOptions: MessageOptions): Promise<Message> {
    return Promise.resolve(
      new TestMessage(messageOptions, this.messageContainer),
    )
  }

  followUp(messageOptions: MessageOptions): Promise<Message> {
    return Promise.resolve(
      new TestMessage(messageOptions, this.messageContainer),
    )
  }
}

class TestInteraction {
  readonly id = nanoid()
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

  message: MessageInfo = {} as any // todo
  channel: ChannelInfo = {} as any // todo
  user: UserInfo = {} as any // todo
  guild: GuildInfo = {} as any // todo

  reply(content?: ReactNode): ReacordInstance {
    return this.tester.reply()
  }

  ephemeralReply(content?: ReactNode): ReacordInstance {
    return this.tester.ephemeralReply()
  }
}

class TestButtonClickEvent
  extends TestComponentEvent
  implements ButtonClickEvent {}

class TestSelectChangeEvent
  extends TestComponentEvent
  implements SelectChangeEvent
{
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
