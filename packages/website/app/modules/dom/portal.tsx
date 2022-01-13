import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export function Portal({ children }: { children: ReactNode }) {
  const containerRef = useRef<Element>()

  if (!containerRef.current && typeof document !== "undefined") {
    containerRef.current = document.createElement("react-portal")
    document.body.append(containerRef.current)
  }

  useEffect(() => () => containerRef.current!.remove(), [])

  return containerRef.current ? (
    createPortal(children, containerRef.current)
  ) : (
    <>{children}</>
  )
}
