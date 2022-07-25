import type { ReactNode } from "react"

/**
 * Common props between button-like components
 * @category Button
 */
export type ButtonSharedProps = {
  /** The text on the button. Rich formatting (markdown) is not supported here. */
  label?: ReactNode

  /** When true, the button will be slightly faded, and cannot be clicked. */
  disabled?: boolean

  /**
   * Renders an emoji to the left of the text.
   * Has to be a literal emoji character (e.g. 🍍),
   * or an emoji code, like `<:plus_one:778531744860602388>`.
   *
   * To get an emoji code, type your emoji in Discord chat
   * with a backslash `\` in front.
   * The bot has to be in the emoji's guild to use it.
   */
  emoji?: string
}
