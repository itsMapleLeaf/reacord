import type { APIInteraction, Client } from "discord.js"
import {
  GatewayDispatchEvents,
  GatewayIntentBits,
  InteractionResponseType,
  InteractionType,
  Routes,
} from "discord.js"
import * as React from "react"
import { createDiscordClient } from "./create-discord-client"
import type { ReacordInstance } from "./reacord-instance"
import { ReacordInstancePrivate } from "./reacord-instance"
import { InstanceProvider } from "./react/instance-context"
import type { Renderer } from "./renderer"
import {
  ChannelMessageRenderer,
  EphemeralInteractionReplyRenderer,
  InteractionReplyRenderer,
} from "./renderer"

/**
 * @category Core
 */
export type ReacordConfig = {
  /** Discord bot token */
  token: string

  /**
   * The max number of active instances.
   * When this limit is exceeded, the oldest instances will be cleaned up
   * to prevent memory leaks.
   */
  maxInstances?: number
}

/**
 * Info for replying to an interaction. For Discord.js
 * (and probably other libraries) you should be able to pass the
 * interaction object directly:
 * ```js
 * client.on("interactionCreate", (interaction) => {
 *   if (interaction.isChatInputCommand() && interaction.commandName === "hi") {
 *     reacord.reply(interacition, "hi lol")
 *   }
 * })
 * ```
 * @category Core
 */
export type InteractionInfo = {
  id: string
  token: string
}

/**
 * @category Core
 */
export class ReacordClient {
  private readonly config: Required<ReacordConfig>
  private readonly discordClientPromise: Promise<Client<true>>
  private instances: ReacordInstancePrivate[] = []
  destroyed = false

  constructor(config: ReacordConfig) {
    this.config = {
      ...config,
      maxInstances: config.maxInstances ?? 50,
    }

    this.discordClientPromise = createDiscordClient(this.config.token, {
      intents: [GatewayIntentBits.Guilds],
    })

    this.discordClientPromise
      .then((client) => {
        // we listen to the websocket message instead of the normal "interactionCreate" event,
        // so that we can pass a library-agnostic APIInteraction object to the user's component callbacks
        // the DJS MessageComponentInteraction doesn't have the raw data on it (as of writing this)
        client.ws.on(
          GatewayDispatchEvents.InteractionCreate,
          async (interaction: APIInteraction) => {
            if (interaction.type !== InteractionType.MessageComponent) return

            // handling a component interaction may not always result in a re-render,
            // and in the case that it doesn't, discord will incorrectly show "interaction failed",
            // so here, we'll just always defer an update just in case
            //
            // we _can_ be a little smarter and check to see if an update happened before deferring,
            // but I can figure that out later
            //
            // or we can make the user defer themselves if they don't update,
            // but that's bad UX probably
            await client.rest.post(
              Routes.interactionCallback(interaction.id, interaction.token),
              { body: { type: InteractionResponseType.DeferredMessageUpdate } },
            )

            for (const instance of this.instances) {
              instance.handleInteraction(interaction, this)
            }
          },
        )
        return client
      })
      .catch(console.error)
  }

  send(channelId: string, initialContent?: React.ReactNode) {
    return this.createInstance(
      new ChannelMessageRenderer(channelId, this.discordClientPromise),
      initialContent,
    )
  }

  reply(interaction: InteractionInfo, initialContent?: React.ReactNode) {
    return this.createInstance(
      new InteractionReplyRenderer(interaction, this.discordClientPromise),
      initialContent,
    )
  }

  ephemeralReply(
    interaction: InteractionInfo,
    initialContent?: React.ReactNode,
  ) {
    return this.createInstance(
      new EphemeralInteractionReplyRenderer(
        interaction,
        this.discordClientPromise,
      ),
      initialContent,
    )
  }

  destroy() {
    void this.discordClientPromise.then((client) => client.destroy())
    this.destroyed = true
  }

  private createInstance(renderer: Renderer, initialContent?: React.ReactNode) {
    if (this.destroyed) throw new Error("ReacordClient is destroyed")

    const instance = new ReacordInstancePrivate(renderer)

    this.instances.push(instance)

    if (this.instances.length > this.config.maxInstances) {
      void this.instances[0]?.deactivate()
      this.removeInstance(this.instances[0]!)
    }

    const publicInstance: ReacordInstance = {
      render: (content: React.ReactNode) => {
        instance.render(
          React.createElement(
            InstanceProvider,
            { value: publicInstance },
            content,
          ),
        )
      },
      deactivate: () => {
        this.removeInstance(instance)
        renderer.deactivate()
      },
      destroy: () => {
        this.removeInstance(instance)
        renderer.destroy()
      },
    }

    if (initialContent !== undefined) {
      publicInstance.render(initialContent)
    }

    return publicInstance
  }

  private removeInstance(instance: ReacordInstancePrivate) {
    this.instances = this.instances.filter((the) => the !== instance)
  }
}
