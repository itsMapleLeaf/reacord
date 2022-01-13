import { useRect } from "@reach/rect"
import * as React from "react"
import { Portal } from "~/modules/dom/portal"

export function Popper({
  renderReference,
  renderPopover,
}: {
  renderReference: (referenceProps: {
    ref: (element: HTMLElement | null | undefined) => void
  }) => React.ReactNode
  renderPopover: () => React.ReactNode
}) {
  const [reference, referenceRef] = React.useState<HTMLElement | null>()
  const referenceRect = useRect(useValueAsRefObject(reference))

  return (
    <>
      {renderReference({ ref: referenceRef })}
      <Portal>
        {referenceRect && (
          <div
            className="fixed -translate-x-full"
            style={{
              left: referenceRect.right,
              top: referenceRect.bottom + 16,
            }}
          >
            {renderPopover()}
          </div>
        )}
      </Portal>
    </>
  )
}

function useValueAsRefObject<Value>(value: Value): { readonly current: Value } {
  const ref = React.useRef<Value>(value)
  ref.current = value
  return ref
}
