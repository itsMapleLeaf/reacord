import * as React from "react"
import { mainLinks } from "../data/main-links"
import type { AppLinkProps } from "./app-link"
import { AppLink } from "./app-link"
import { PopoverMenu } from "./popover-menu"

export type MainNavigationMobileMenuData = {
  guideLinks: AppLinkProps[]
}

export function render(data: MainNavigationMobileMenuData) {
  return (
    <PopoverMenu>
      {mainLinks.map((link) => (
        <AppLink {...link} key={link.to} className={PopoverMenu.itemClass} />
      ))}
      <hr className="border-0 h-[2px] bg-black/50" />
      {data.guideLinks.map((link) => (
        <AppLink {...link} key={link.to} className={PopoverMenu.itemClass} />
      ))}
    </PopoverMenu>
  )
}
