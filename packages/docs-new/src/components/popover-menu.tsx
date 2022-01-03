import { MenuAlt4Icon } from "@heroicons/react/outline"
import clsx from "clsx"
import React from "react"
import { linkClass } from "../styles/components"

export function PopoverMenu({ children }: { children: React.ReactNode }) {
  return (
    <div data-popover className="relative">
      <button data-popover-button title="Menu" className={linkClass}>
        <MenuAlt4Icon className="w-6" />
      </button>
      <div
        data-popover-panel
        hidden
        className="absolute w-48 bg-slate-800 rounded-lg shadow overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto right-0 top-[calc(100%+8px)]"
      >
        {children}
      </div>
    </div>
  )
}

PopoverMenu.itemClass = clsx`
  px-3 py-2 transition text-left font-medium block
  opacity-50 hover:opacity-100 hover:bg-black/30
`
