import clsx from "clsx"

export const linkClass = clsx`
  font-medium inline-block relative
  opacity-60 hover:opacity-100 transition-opacity
  after:absolute after:block after:w-full after:h-px after:bg-white/50 after:translate-y-[3px] after:opacity-0 after:transition
  hover:after:translate-y-[-1px] hover:after:opacity-100
`
