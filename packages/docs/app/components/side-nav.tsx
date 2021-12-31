import type { ReactNode } from "react"

export function SideNav({
  heading,
  children,
}: {
  heading: ReactNode
  children: ReactNode
}) {
  return (
    <nav>
      <h2 className="text-2xl">{heading}</h2>
      <div className="mt-3 flex flex-col gap-2 items-start">{children}</div>
    </nav>
  )
}
