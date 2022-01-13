import { XIcon } from "@heroicons/react/outline"
import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { FocusOn } from "react-focus-on"
import { Portal } from "~/modules/dom/portal"

export function Modal({
  children,
  visible,
  onClose,
}: {
  children: ReactNode
  visible: boolean
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (visible) {
      // trying to immediately focus doesn't work for whatever reason
      // neither did requestAnimationFrame
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
    }
  }, [visible])

  return (
    <Portal>
      <div
        className={clsx(
          "bg-black/70 fixed inset-0 transition-all flex flex-col p-4",
          visible ? "opacity-100 visible" : "opacity-0 invisible",
        )}
      >
        <FocusOn
          className={clsx(
            "m-auto flex flex-col gap-2 w-full max-h-full max-w-screen-sm overflow-y-auto transition",
            visible ? "translate-y-0" : "translate-y-3",
          )}
          enabled={visible}
          onClickOutside={onClose}
          onEscapeKey={onClose}
        >
          <button
            type="button"
            className="self-end"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <span className="sr-only">Close</span>
            <XIcon aria-hidden className="w-6 text-white" />
          </button>
          <div className={clsx("bg-slate-700 rounded-md shadow p-4")}>
            {children}
          </div>
        </FocusOn>
      </div>
    </Portal>
  )
}

export function ControlledModal({
  children,
  button,
}: {
  children: ReactNode
  button: (buttonProps: { onClick: () => void }) => void
}) {
  const [visible, setVisible] = useState(false)
  return (
    <>
      {button({ onClick: () => setVisible(true) })}
      <Modal visible={visible} onClose={() => setVisible(false)}>
        {children}
      </Modal>
    </>
  )
}
