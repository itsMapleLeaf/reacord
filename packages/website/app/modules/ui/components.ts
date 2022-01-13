import clsx from "clsx"

export const maxWidthContainer = clsx`mx-auto w-full max-w-screen-lg px-4`

export const inlineIconClass = clsx`inline w-5 align-sub`

export const linkClass = ({ active = false } = {}) =>
  clsx(
    clsx`font-medium inline-block relative`,
    clsx`opacity-60 hover:opacity-100 transition-opacity`,
    clsx`after:absolute after:block after:w-full after:h-px after:bg-white/50 after:translate-y-[3px] after:opacity-0 after:transition`,
    clsx`hover:after:translate-y-[-1px] hover:after:opacity-100`,
    active
      ? clsx`text-emerald-500 after:bg-emerald-500`
      : clsx`after:bg-white/50`,
  )

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

export const buttonClass = ({
  variant,
}: {
  variant: "solid" | "semiblack"
}) => {
  return clsx(
    clsx`inline-block mt-4 px-4 py-2.5 text-xl transition rounded-lg`,
    clsx`hover:translate-y-[-2px] hover:shadow`,
    clsx`active:translate-y-[0px] active:transition-none`, // using translate-y-[0px] instead of just -0 so it takes priority
    variant === "solid" && clsx`bg-emerald-700 hover:bg-emerald-800`,
    variant === "semiblack" && clsx`bg-black/25 hover:bg-black/40`,
  )
}
