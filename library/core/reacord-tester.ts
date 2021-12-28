/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import { nanoid } from "nanoid"
import { nextTick } from "node:process"
import { promisify } from "node:util"
import type { ReactNode } from "react"
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
import { CommandReplyRenderer } from "../internal/renderers/command-reply-renderer"
import type { ReacordInstance } from "./reacord"
import { Reacord } from "./reacord"

const nextTickPromise = promisify(nextTick)

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
      new CommandReplyRenderer(
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

  private createButtonActions(
    button: MessageButtonOptions,
    message: TestMessage,
  ) {
    return {
      click: () => {
        this.handleComponentInteraction(
          new TestButtonInteraction(button.customId, message),
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
          new TestSelectInteraction(component.customId, message, values),
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

  constructor(readonly customId: string, readonly message: TestMessage) {}

  async update(options: MessageOptions): Promise<void> {
    this.message.options = options
  }

  async deferUpdate(): Promise<void> {}
}

class TestButtonInteraction
  extends TestInteraction
  implements ButtonInteraction
{
  readonly type = "button"
}

class TestSelectInteraction
  extends TestInteraction
  implements SelectInteraction
{
  readonly type = "select"

  constructor(
    customId: string,
    message: TestMessage,
    readonly values: string[],
  ) {
    super(customId, message)
  }
}

class TestChannel implements Channel {
  constructor(private messageContainer: Container<TestMessage>) {}

  async send(messageOptions: MessageOptions): Promise<Message> {
    return new TestMessage(messageOptions, this.messageContainer)
  }
}
