import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

export function SidebarLayout({
  sidebar,
  body,
}: {
  sidebar: ReactNode
  body: ReactNode
}) {
  const [offsetTop, setOffsetTop] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOffsetTop(sidebarRef.current?.offsetTop ?? 0)
  }, [sidebarRef])

  return (
    <div className="flex items-start gap-6">
      <div className="w-64 sticky" style={{ top: offsetTop }} ref={sidebarRef}>
        {sidebar}
      </div>
      <div className="flex-1">{body}</div>
    </div>
  )
}
