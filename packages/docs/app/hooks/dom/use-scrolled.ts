import { useState } from "react"
import { useWindowEvent } from "~/hooks/dom/use-window-event"

export function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useWindowEvent("scroll", () => setScrolled(window.scrollY > 0))
  return scrolled
}
