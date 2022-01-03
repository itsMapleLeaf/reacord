import { useEffect } from "react"

export function useWindowEvent<EventType extends keyof WindowEventMap>(
  type: EventType,
  handler: (event: WindowEventMap[EventType]) => void,
) {
  useEffect(() => {
    window.addEventListener(type, handler)
    return () => window.removeEventListener(type, handler)
  })
}
