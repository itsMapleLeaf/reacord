import { MenuAlt4Icon } from "@heroicons/react/outline"
import { useRect } from "@reach/rect"
import clsx from "clsx"
import { useRef, useState } from "react"
import { FocusOn } from "react-focus-on"
import { Link } from "remix"
import { mainLinks } from "~/app-links"
import { AppLink } from "~/components/app-link"
import type { ContentIndexEntry } from "~/helpers/create-index.server"
import { linkClass } from "~/styles"

const menuItemClass = clsx`
  px-3 py-2 transition text-left font-medium block
  opacity-50 hover:opacity-100 hover:bg-black/30
`

export function MainNavigation({
  guideRoutes,
}: {
  guideRoutes: ContentIndexEntry[]
}) {
  return (
    <nav className="flex justify-between items-center h-16">
      <Link to="/">
        <h1 className="text-3xl font-light">reacord</h1>
      </Link>
      <div className="hidden md:flex gap-4">
        {mainLinks.map((link) => (
          <AppLink key={link.to} className={linkClass} {...link} />
        ))}
      </div>
      <div className="md:hidden">
        <PopoverMenu>
          {mainLinks.map((link) => (
            <AppLink key={link.to} className={menuItemClass} {...link} />
          ))}
          <hr className="border-0 h-[2px] bg-black/50" />
          {guideRoutes.map((route) => (
            <Link key={route.route} to={route.route} className={menuItemClass}>
              {route.title}
            </Link>
          ))}
        </PopoverMenu>
      </div>
    </nav>
  )
}

function PopoverMenu({ children }: { children: React.ReactNode }) {
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
