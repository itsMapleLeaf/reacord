/* eslint-disable class-methods-use-this */
/* eslint-disable require-await */
import { logPretty } from "@reacord/helpers/log-pretty"
import { omit } from "@reacord/helpers/omit"
import { pruneNullishValues } from "@reacord/helpers/prune-nullish-values"
import { raise } from "@reacord/helpers/raise"
import { waitFor } from "@reacord/helpers/wait-for"
import { randomUUID } from "node:crypto"
import { setTimeout } from "node:timers/promises"
import type { Channel as DiscordJSChannel, GuildMember as DiscordJSMember } from 'discord.js'
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

  async click(message: TestMessage, customId: string, channel: DiscordJSChannel, member: DiscordJSMember) {
    this.handleComponentInteraction(
      new TestButtonInteraction(customId, message, this, channel, member),
    )
    await setTimeout(500) // Allow time for defer update to run
  }

  async select(message: TestMessage, customId: string, values: string[], channel: DiscordJSChannel, member: DiscordJSMember) {
    this.handleComponentInteraction(
      new TestSelectInteraction(
        customId,
        message,
        values,
        this,
        channel,
        member
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

  public hasButton(label: string, reacord: ReacordTester) {
    return this.findButtonByLabel(label, reacord) !== undefined;
  }

  public hasSelectMenu(
    placeholder: string,
    reacord: ReacordTester
  ) {
    return this.findSelectByPlaceholder(placeholder, reacord) !== undefined;
  }

  public hasComponents(labels: string[], placeholders: string[]) {
    const label_lookup = new Set(labels);
    const placeholder_lookup = new Set(placeholders);
    let num_components = 0;
    for (const row of this.options.actionRows) {
      for (const component of row) {
        num_components++;
        if (component.type === 'button' && (!component.label || !label_lookup.has(component.label))) {
          return false;
        }
        if (component.type === 'select' && (!component.placeholder || !placeholder_lookup.has(component.placeholder))) {
          return false;
        }
      }
    }
    return num_components == (labels.length + placeholders.length)
  }

  public findButtonByLabel(label: string, reacord: ReacordTester) {
    for (const row of this.options.actionRows) {
      for (const component of row) {
        if (component.type === "button" && component.label === label) {
          return {
            click: (channel: DiscordJSChannel, member: DiscordJSMember) => {
              return waitFor(() =>
                reacord.click(this, component.customId, channel, member)
              )
            },
            ...component,
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
            select: (channel: DiscordJSChannel, member: DiscordJSMember, ...values: string[]) => {
              return waitFor(() => reacord.select(this, component.customId, values, channel, member)
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

  constructor(customId: string, message: TestMessage, tester: ReacordTester, channel: DiscordJSChannel, member: DiscordJSMember) {
    super(customId, message, tester)
    this.event = new TestButtonClickEvent(tester, channel, member)

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
    channel: DiscordJSChannel,
    member: DiscordJSMember
  ) {
    super(customId, message, tester)
    this.event = new TestSelectChangeEvent(values, tester, channel, member)
  }
}

export class TestComponentEvent {
  message: MessageInfo = {} as any // todo
  channel: ChannelInfo = {} as any // todo
  user: UserInfo = {} as any // todo
  guild: GuildInfo = {} as any // todo
  constructor(private tester: ReacordTester, channel: DiscordJSChannel, member: DiscordJSMember) {
    const user = member.user;
    this.user = {
      avatarUrl: user.avatarURL() || '',
      discriminator: user.discriminator,
      id: user.id,
      tag: user.tag,
      username: user.username,
      accentColor: user.accentColor ?? undefined
    }
    this.channel = {
      id: channel.id,
      name: channel.isDMBased() ? undefined : channel.name,
      lastMessageId: channel.isThread() ? channel.lastMessageId ?? undefined : undefined,
      nsfw: channel.isDMBased() || !channel.isTextBased() || channel.isThread() ? undefined : channel.nsfw,
      ownerId: channel.isThread() ? channel.ownerId ?? undefined : undefined,
      parentId: channel.isThread() ? channel.parentId ?? undefined : undefined,
      rateLimitPerUser: channel.isDMBased() || !channel.isTextBased() ? undefined : channel.rateLimitPerUser ?? undefined,
      topic: channel.isDMBased() || channel.isThread() || channel.isVoiceBased() || !channel.isTextBased() ? undefined : channel.topic ?? undefined
    }
    this.guild = {
      id: member.guild.id,
      member: {
        color: member.displayColor,
        ...this.user,
        communicationDisabledUntil: member.communicationDisabledUntilTimestamp?.toString(),
        roles: member.roles.cache.map((role) => role.id),
        displayAvatarUrl: member.displayAvatarURL(),
        displayName: member.displayName,
        joinedAt: member.joinedTimestamp?.toString(),
        nick: member.nickname ?? undefined,
        id: member.id,
        pending: member.pending,
        premiumSince: member.premiumSinceTimestamp?.toString(),
        avatarUrl: member.avatarURL() ?? undefined
      },
      name: member.guild.name
    }
  }


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
  constructor(readonly values: string[], tester: ReacordTester, channel: DiscordJSChannel, member: DiscordJSMember) {
    super(tester, channel, member)
  }
}

export class TestChannel implements Channel {
  constructor(private messageContainer: Container<TestMessage>) { }

  async send(messageOptions: MessageOptions): Promise<Message> {
    return new TestMessage(messageOptions, this.messageContainer)
  }
}
