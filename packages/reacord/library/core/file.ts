import { Readable } from "node:stream"

export type ReacordFile = {
  name?: string
  description?: string
  data: Buffer | Readable | string
}
