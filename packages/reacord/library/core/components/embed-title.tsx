import type { ReactNode } from "react"
import { ReacordElement } from "../../internal/element.js"
import { Node } from "../../internal/node.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

/** @category Embed */
export interface EmbedTitleProps {
	children: ReactNode
	url?: string
}

/** @category Embed */
export function EmbedTitle({ children, ...props }: EmbedTitleProps) {
	return (
		<ReacordElement props={props} createNode={() => new EmbedTitleNode(props)}>
			<ReacordElement props={{}} createNode={() => new TitleTextNode({})}>
				{children}
			</ReacordElement>
		</ReacordElement>
	)
}

class EmbedTitleNode extends EmbedChildNode<Omit<EmbedTitleProps, "children">> {
	override modifyEmbedOptions(options: EmbedOptions): void {
		options.title = this.children.findType(TitleTextNode)?.text ?? ""
		options.url = this.props.url
	}
}

class TitleTextNode extends Node<Record<string, never>> {}
