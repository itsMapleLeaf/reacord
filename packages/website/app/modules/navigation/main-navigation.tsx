import { AppLogo } from "~/modules/app/app-logo"
import { linkClass } from "../ui/components"
import { AppLink } from "./app-link"
import { mainLinks } from "./main-links"
import { MainNavigationMenu } from "./main-navigation-menu"

export function MainNavigation() {
  return (
    <nav className="flex justify-between items-center h-16">
      <a href="/">
        <AppLogo className="w-32" />
      </a>
      <div className="hidden md:flex gap-4">
        {mainLinks.map((link) => (
          <AppLink {...link} key={link.to} className={linkClass} />
        ))}
      </div>
      <div className="md:hidden">
        <MainNavigationMenu />
      </div>
    </nav>
  )
}
