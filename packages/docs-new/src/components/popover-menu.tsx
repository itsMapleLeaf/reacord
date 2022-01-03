import { MenuAlt4Icon } from "@heroicons/react/outline"
import { useRect } from "@reach/rect"
import clsx from "clsx"
import React, { useRef, useState } from "react"
import { FocusOn } from "react-focus-on"
import { linkClass } from "../styles/components"

// todo: remove useRect usage and rely on css absolute positioning instead
export function PopoverMenu({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const buttonRect = useRect(buttonRef)

  const panelRef = useRef<HTMLDivElement>(null)
  const panelRect = useRect(panelRef)

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  return (
    <>
      <button
        title="Menu"
        className={linkClass}
        onClick={() => setVisible(!visible)}
        ref={buttonRef}
      >
        <MenuAlt4Icon className="w-6" />
      </button>

      <FocusOn
        enabled={visible}
        onClickOutside={() => setVisible(false)}
        onEscapeKey={() => setVisible(false)}
      >
        <div
          className="fixed"
          style={{
            left: (buttonRect?.right ?? 0) - (panelRect?.width ?? 0),
            top: (buttonRect?.bottom ?? 0) + 8,
          }}
          onClick={() => setVisible(false)}
        >
          <div
            className={clsx(
              "transition-all",
              visible
                ? "opacity-100 visible"
                : "translate-y-2 opacity-0 invisible",
            )}
          >
            <div ref={panelRef}>
              <div className="w-48 bg-slate-800 rounded-lg shadow overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </FocusOn>
    </>
  )
}

PopoverMenu.itemClass = clsx`
  px-3 py-2 transition text-left font-medium block
  opacity-50 hover:opacity-100 hover:bg-black/30
`
