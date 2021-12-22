import React from "react"

export type ActionRowProps = {
  children: React.ReactNode
}

export function ActionRow(props: ActionRowProps) {
  return (
    <reacord-element createNode={() => ({ type: "actionRow", children: [] })}>
      {props.children}
    </reacord-element>
  )
}
