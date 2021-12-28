/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import { nanoid } from "nanoid"
import { raise } from "../helpers/raise"
import type { Adapter } from "./core/adapters/adapter"
import type { Channel } from "./internal/channel"
import type {
  ButtonInteraction,
  CommandInteraction,
  ComponentInteraction,
  SelectInteraction,
} from "./internal/interaction"
import type {
  Message,
  MessageButtonOptions,
  MessageOptions,
  MessageSelectOptions,
} from "./internal/message"

type TestAdapterGenerics = {
  commandReplyInit: TestCommandInteraction
  channelInit: TestChannel
}

export class TestAdapter implements Adapter<TestAdapterGenerics> {
  messages: TestMessage[] = []

  private constructor() {}

  static create(): Adapter<TestAdapterGenerics> & TestAdapter {
    return new TestAdapter()
  }

  private componentInteractionListener: (
    interaction: ComponentInteraction,
  ) => void = () => {}

  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ): void {
    this.componentInteractionListener = listener
  }

  createCommandInteraction(
    interaction: CommandInteraction,
  ): CommandInteraction {
    return interaction
  }

  createChannel(channel: TestChannel): Channel {
    return channel
  }

  findButtonByLabel(label: string) {
    for (const message of this.messages) {
      for (const component of message.options.actionRows.flat()) {
        if (component.type === "button" && component.label === label) {
          return this.createButtonActions(component, message)
        }
      }
    }
    raise(`Couldn't find button with label "${label}"`)
  }

  findSelectByPlaceholder(placeholder: string) {
    for (const message of this.messages) {
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

  removeMessage(message: TestMessage) {
    this.messages = this.messages.filter((m) => m !== message)
  }

  private createButtonActions(
    button: MessageButtonOptions,
    message: TestMessage,
  ) {
    return {
      click: () => {
        this.componentInteractionListener(
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
        this.componentInteractionListener(
          new TestSelectInteraction(component.customId, message, values),
        )
      },
    }
  }
}

export class TestMessage implements Message {
  constructor(public options: MessageOptions, private adapter: TestAdapter) {}

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
    this.adapter.removeMessage(this)
  }
}

export class TestCommandInteraction implements CommandInteraction {
  readonly type = "command"
  readonly id = "test-command-interaction"
  readonly channelId = "test-channel-id"

  constructor(private adapter: TestAdapter) {}

  private createMesssage(messageOptions: MessageOptions): Message {
    const message = new TestMessage(messageOptions, this.adapter)
    this.adapter.messages.push(message)
    return message
  }

  reply(messageOptions: MessageOptions): Promise<Message> {
    return Promise.resolve(this.createMesssage(messageOptions))
  }

  followUp(messageOptions: MessageOptions): Promise<Message> {
    return Promise.resolve(this.createMesssage(messageOptions))
  }
}

export class TestButtonInteraction implements ButtonInteraction {
  readonly type = "button"
  readonly id = nanoid()
  readonly channelId = "test-channel-id"

  constructor(readonly customId: string, readonly message: TestMessage) {}

  async update(options: MessageOptions): Promise<void> {
    this.message.options = options
  }
}

export class TestSelectInteraction implements SelectInteraction {
  readonly type = "select"
  readonly id = nanoid()
  readonly channelId = "test-channel-id"

  constructor(
    readonly customId: string,
    readonly message: TestMessage,
    readonly values: string[],
  ) {}

  async update(options: MessageOptions): Promise<void> {
    this.message.options = options
  }
}

export class TestChannel implements Channel {
  constructor(private adapter: TestAdapter) {}

  async send(messageOptions: MessageOptions): Promise<Message> {
    const message = new TestMessage(messageOptions, this.adapter)
    this.adapter.messages.push(message)
    return message
  }
}
