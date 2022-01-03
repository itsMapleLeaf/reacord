import React from "react"
import { guideLinks } from "../data/guide-links"
import { mainLinks } from "../data/main-links"
import { createHydrater } from "../helpers/hydration"
import { linkClass } from "../styles/components"
import { AppLink } from "./app-link"
import type { MainNavigationMobileMenuData } from "./main-navigation-mobile-menu"

const MenuHydrater = await createHydrater<MainNavigationMobileMenuData>(
  new URL("./main-navigation-mobile-menu.tsx", import.meta.url).pathname,
)

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
      <div className="md:hidden" id="main-navigation-popover">
        <MenuHydrater data={{ guideLinks }} />
      </div>
    </nav>
  )
}
