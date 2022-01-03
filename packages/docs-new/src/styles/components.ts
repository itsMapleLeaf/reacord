import clsx from "clsx"

export const maxWidthContainer = clsx`mx-auto w-full max-w-screen-lg px-4`

export const inlineIconClass = clsx`inline w-5 align-sub`

export const linkClass = clsx`
  font-medium inline-block relative
  opacity-60 hover:opacity-100 transition-opacity
  after:absolute after:block after:w-full after:h-px after:bg-white/50 after:translate-y-[3px] after:opacity-0 after:transition
  hover:after:translate-y-[-1px] hover:after:opacity-100
`

export const docsProseClass = clsx`
  prose prose-invert
  prose-h1:font-light prose-h1:mb-4 prose-h1:text-3xl lg:prose-h1:text-4xl
  prose-h2:font-light
  prose-h3:font-light
  prose-p:my-4
  prose-a:font-medium prose-a:text-emerald-400 hover:prose-a:no-underline
  prose-strong:font-medium prose-strong:text-emerald-400
  prose-pre:font-monospace prose-pre:overflow-x-auto
  max-w-none
`
