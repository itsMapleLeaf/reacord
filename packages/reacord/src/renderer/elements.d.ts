export type ReacordElementTag = "reacord-element"

export type ReacordElementProps = {
  createInstance: () => unknown
}

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements
      extends Record<ReacordElementTag, ReacordElementProps> {}
  }
}
