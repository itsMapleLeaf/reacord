import type { Node } from "./node"
import type { ReactNode } from "react"
import React from "react"

export function ReacordElement<Props>(props: {
	props: Props
	createNode: () => Node<Props>
	children?: ReactNode
}) {
	return React.createElement("reacord-element", props)
}
