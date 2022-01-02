import { AppLink } from "../components/app-link"
import { guideLinks } from "../data/guide-links"
import { mainLinks } from "../data/main-links"
import { linkClass } from "../styles/components"
import { PopoverMenu } from "./popover-menu"

export function MainNavigation() {
  return (
    <nav className="flex justify-between items-center h-16">
      <a href="/">
        <h1 className="text-3xl font-light">reacord</h1>
      </a>
      <div className="hidden md:flex gap-4">
        {mainLinks.map((link) => (
          <AppLink {...link} key={link.to} className={linkClass} />
        ))}
      </div>
      <div className="md:hidden">
        <PopoverMenu>
          {mainLinks.map((link) => (
            <AppLink
              {...link}
              key={link.to}
              className={PopoverMenu.itemClass}
            />
          ))}
          <hr className="border-0 h-[2px] bg-black/50" />
          {guideLinks.map((link) => (
            <AppLink
              {...link}
              key={link.to}
              className={PopoverMenu.itemClass}
            />
          ))}
        </PopoverMenu>
      </div>
    </nav>
  )
}
