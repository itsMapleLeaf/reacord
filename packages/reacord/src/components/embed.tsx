import type { ColorResolvable } from "discord.js"
import type { ReactNode } from "react"
import React from "react"
import { EmbedInstance } from "../renderer/embed-instance.js"

export type EmbedProps = {
  color?: ColorResolvable
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  return (
    <reacord-element createInstance={() => new EmbedInstance(props.color)} />
  )
}
