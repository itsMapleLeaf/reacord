import { useState } from "react"
import { useWindowEvent } from "./use-window-event"

export function useScrolled() {
  const [scrolled, setScrolled] = useState(
    typeof window !== "undefined" ? window.scrollY > 0 : false,
  )
  useWindowEvent("scroll", () => setScrolled(window.scrollY > 0))
  return scrolled
}
