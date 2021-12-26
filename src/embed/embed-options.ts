export type EmbedOptions = {
  title?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  fields?: EmbedFieldOptions[]
  author?: { name: string; url?: string; icon_url?: string }
  thumbnail?: { url: string }
  image?: { url: string }
  video?: { url: string }
  footer?: { text: string; icon_url?: string }
}

export type EmbedFieldOptions = {
  name: string
  value: string
  inline?: boolean
}
