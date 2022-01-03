import * as React from "react"
import { createRoot } from "react-dom"
import { mainLinks } from "../data/main-links"
import { AppLink } from "./app-link"
import type { MainNavigationClientData } from "./main-navigation"
import { PopoverMenu } from "./popover-menu"

const dataScript = document.querySelector("#main-navigation-popover-data")!
const data: MainNavigationClientData = JSON.parse(dataScript.innerHTML)

createRoot(document.querySelector("#main-navigation-popover")!).render(
  <PopoverMenu>
    {mainLinks.map((link) => (
      <AppLink {...link} key={link.to} className={PopoverMenu.itemClass} />
    ))}
    <hr className="border-0 h-[2px] bg-black/50" />
    {data.guideLinks.map((link) => (
      <AppLink {...link} key={link.to} className={PopoverMenu.itemClass} />
    ))}
  </PopoverMenu>,
)
