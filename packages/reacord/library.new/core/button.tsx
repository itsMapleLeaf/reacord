import { randomUUID } from "node:crypto"
import React, { useState } from "react"
import type { Except } from "type-fest"
import type { ButtonSharedProps } from "./button-shared-props"
import type { ComponentEvent } from "./component-event"
import type { NodeBase } from "./node"
import { makeNode } from "./node"
import { ReacordElement } from "./reacord-element"

/**
 * @category Button
 */
export type ButtonProps = ButtonSharedProps & {
  /**
   * The style determines the color of the button and signals intent.
   * @see https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
   */
  style?: "primary" | "secondary" | "success" | "danger"

  /**
   * Happens when a user clicks the button.
   */
  onClick: (event: ButtonClickEvent) => void
}

/**
 * @category Button
 */
export type ButtonClickEvent = ComponentEvent

export type ButtonNode = NodeBase<
  "button",
  Except<ButtonProps, "label"> & { customId: string }
>

export function Button({ label, ...props }: ButtonProps) {
  const [customId] = useState(() => randomUUID())
  return (
    <ReacordElement node={makeNode("button", { ...props, customId })}>
      {label}
    </ReacordElement>
  )
}
