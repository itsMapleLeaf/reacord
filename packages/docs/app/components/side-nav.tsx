import type { ReactNode } from "react"

export function SideNav({
  heading,
  children,
}: {
  heading: ReactNode
  children: ReactNode
}) {
  return (
    <nav className="w-64 sticky top-0">
      <h2 className="text-2xl mt-1">{heading}</h2>
      <div className="mt-3 flex flex-col gap-2 items-start">{children}</div>
    </nav>
  )
}
