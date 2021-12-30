import clsx from "clsx"
import { useScrolled } from "~/hooks/dom/use-scrolled"

export function HeaderLayout({
  header,
  body,
}: {
  header: React.ReactNode
  body: React.ReactNode
}) {
  const isScrolled = useScrolled()
  return (
    <div className="isolate">
      <header
        className={clsx(
          isScrolled ? "bg-slate-700/30" : "bg-slate-800",
          "shadow-md sticky top-0 py-3 backdrop-blur-sm transition z-10",
        )}
      >
        <div className="m-auto max-w-screen-lg px-6">{header}</div>
      </header>
      <div className="m-auto max-w-screen-lg px-6 mt-6">{body}</div>
    </div>
  )
}
