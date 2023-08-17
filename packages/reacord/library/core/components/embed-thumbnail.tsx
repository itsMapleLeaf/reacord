import { ReacordElement } from "../../internal/element.js"
import { EmbedChildNode } from "./embed-child.js"
import type { EmbedOptions } from "./embed-options"

/** @category Embed */
export interface EmbedThumbnailProps {
	url: string
}

/** @category Embed */
export function EmbedThumbnail(props: EmbedThumbnailProps) {
	return (
		<ReacordElement
			props={props}
			createNode={() => new EmbedThumbnailNode(props)}
		/>
	)
}

class EmbedThumbnailNode extends EmbedChildNode<EmbedThumbnailProps> {
	override modifyEmbedOptions(options: EmbedOptions): void {
		options.thumbnail = { url: this.props.url }
	}
}
