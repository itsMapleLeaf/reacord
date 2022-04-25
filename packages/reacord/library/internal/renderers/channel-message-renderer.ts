import { ReacordFile } from "../../core/file"
import type { Channel } from "../channel"
import type { Message, MessageOptions } from "../message"
import { Renderer } from "./renderer"

export class ChannelMessageRenderer extends Renderer {
  constructor(private channel: Channel) {
    super()
  }

  protected createMessage(options: MessageOptions): Promise<Message> {
    return this.channel.send(options)
  }

  protected createMessageFromFiles(
    files: readonly ReacordFile[],
  ): Promise<Message> {
    return this.channel.sendFiles(files)
  }
}
