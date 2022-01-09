import { MenuAlt4Icon } from "@heroicons/react/outline"
import clsx from "clsx"
import React from "react"
import { linkClass } from "./components"

export function PopoverMenu({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" x-data="{ open: false }">
      <button title="Menu" className={linkClass} x-on:click="open = !open">
        <MenuAlt4Icon className="w-6" />
      </button>
      <div
        className={`
          w-48 max-h-[calc(100vh-4rem)]
          absolute right-0 top-[calc(100%+8px)]
          bg-slate-800 shadow rounded-lg
          overflow-hidden overflow-y-auto 
          transition-all
        `}
        x-bind:class="open ? 'visible opacity-100' : 'invisible opacity-0 translate-y-3'"
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
