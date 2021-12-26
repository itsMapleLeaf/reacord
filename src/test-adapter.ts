import { nanoid } from "nanoid"
import type { Adapter } from "./adapter"
import { raise } from "./helpers/raise"
import type {
  ButtonInteraction,
  CommandInteraction,
  ComponentInteraction,
} from "./interaction"
import type { Message, MessageButtonOptions, MessageOptions } from "./message"

export class TestAdapter implements Adapter<{}> {
  readonly messages: TestMessage[] = []

  // eslint-disable-next-line class-methods-use-this
  private componentInteractionListener: (
    interaction: ComponentInteraction,
  ) => void = () => {}

  addComponentInteractionListener(
    listener: (interaction: ComponentInteraction) => void,
  ): void {
    this.componentInteractionListener = listener
  }

  // eslint-disable-next-line class-methods-use-this
  createCommandInteraction(
    interaction: CommandInteraction,
  ): CommandInteraction {
    return interaction
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
}

export class TestMessage implements Message {
  constructor(public options: MessageOptions) {}

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
}

export class TestCommandInteraction implements CommandInteraction {
  readonly type = "command"
  readonly id = "test-command-interaction"
  readonly channelId = "test-channel-id"

  constructor(private adapter: TestAdapter) {}

  private createMesssage(messageOptions: MessageOptions): Message {
    const message = new TestMessage(messageOptions)
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
