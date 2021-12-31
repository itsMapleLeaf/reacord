import type { ReactNode } from "react"

export function SidebarLayout({
  sidebar,
  body,
}: {
  sidebar: ReactNode
  body: ReactNode
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-64 sticky top-24">{sidebar}</div>
      <div className="flex-1 min-w-0">{body}</div>
    </div>
  )
}
