import { ReacordFile } from "../core/file"
import type { Message, MessageOptions } from "./message"

export type Channel = {
  send(message: MessageOptions): Promise<Message>
  sendFiles(files: readonly ReacordFile[]): Promise<Message>
}
