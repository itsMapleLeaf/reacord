import clsx from "clsx"
import { useScrolled } from "~/hooks/dom/use-scrolled"

export function Header({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled()
  return (
    <header
      className={clsx(
        isScrolled ? "bg-slate-700/30" : "bg-slate-800",
        "shadow-md sticky top-0 px-4 py-3 backdrop-blur-sm transition",
      )}
    >
      {children}
    </header>
  )
}
