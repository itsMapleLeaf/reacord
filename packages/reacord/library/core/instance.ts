import type { ReactNode } from "react"

/**
 * Represents an interactive message, which can later be replaced or deleted.
 *
 * @category Core
 */
export interface ReacordInstance {
	/** Render some JSX to this instance (edits the message) */
	render: (content: ReactNode) => void

	/** Remove this message */
	destroy: () => void

	/**
	 * Same as destroy, but keeps the message and disables the components on it.
	 * This prevents it from listening to user interactions.
	 */
	deactivate: () => void
}
