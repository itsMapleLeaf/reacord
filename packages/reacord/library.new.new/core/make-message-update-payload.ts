import { omit } from "@reacord/helpers/omit"
import type {
  APIActionRowComponent,
  APIEmbed,
  APIMessageActionRowComponent,
} from "discord.js"
import type { HostElement } from "./host-element.js"

export type MessageUpdatePayload = {
  content: string
  embeds: APIEmbed[]
  components: Array<APIActionRowComponent<APIMessageActionRowComponent>>
}

export function makeMessageUpdatePayload(
  tree: HostElement<keyof ReacordHostElementMap>,
): MessageUpdatePayload {
  return {
    content: tree.children
      .map((child) => (child.type === "reacord-text" ? child.props.text : ""))
      .join(""),

    embeds: tree.children.flatMap<APIEmbed>((child) => {
      if (child.type !== "reacord-embed") return []

      const embed: APIEmbed = omit(child.props, ["timestamp"])

      if (child.props.timestamp != undefined) {
        embed.timestamp = new Date(child.props.timestamp).toISOString()
      }

      return embed
    }),

    components: [],
  }
}
