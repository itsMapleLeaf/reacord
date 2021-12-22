import React from "react"

export type EmbedFieldProps = {
  name: string
  children: React.ReactNode
  inline?: boolean
}

export function EmbedField(props: EmbedFieldProps) {
  return (
    <reacord-element
      createNode={() => ({ ...props, type: "embedField", children: [] })}
    >
      {props.children}
    </reacord-element>
  )
}
