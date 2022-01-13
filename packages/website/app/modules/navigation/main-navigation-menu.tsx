import { Menu, Transition } from "@headlessui/react"
import { MenuAlt4Icon } from "@heroicons/react/outline"
import clsx from "clsx"
import { ActiveLink } from "~/modules/navigation/active-link"
import { useGuideLinksContext } from "~/modules/navigation/guide-links-context"
import { Popper } from "~/modules/ui/popper"
import { AppLink } from "./app-link"
import { mainLinks } from "./main-links"

export function MainNavigationMenu() {
  const guideLinks = useGuideLinksContext()
  return (
    <Menu>
      <Popper
        renderReference={(reference) => (
          <Menu.Button {...reference}>
            <MenuAlt4Icon className="w-6" />
            <span className="sr-only">Menu</span>
          </Menu.Button>
        )}
        renderPopover={() => (
          <Transition
            enter="transition"
            enterFrom="translate-y-4 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-4 opacity-0"
          >
            <Menu.Items className="w-48 max-h-[calc(100vh-5rem)] bg-slate-800 shadow rounded-lg overflow-hidden overflow-y-auto focus:outline-none">
              {mainLinks.map((link) => (
                <Menu.Item key={link.to}>
                  {({ active }) => (
                    <AppLink {...link} className={menuItemClass({ active })} />
                  )}
                </Menu.Item>
              ))}
              <Menu.Item disabled>
                <hr className="border-0 h-[2px] bg-black/50" />
              </Menu.Item>
              {guideLinks.map(({ link }) => (
                <Menu.Item key={link.to}>
                  {(menuItem) => (
                    <ActiveLink to={link.to}>
                      {(activeLink) => (
                        <AppLink
                          {...link}
                          className={menuItemClass({
                            active: activeLink.active || menuItem.active,
                          })}
                        />
                      )}
                    </ActiveLink>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        )}
      />
    </Menu>
  )
}

const menuItemClass = ({ active = false }) =>
  clsx(
    clsx`px-3 py-2 transition text-left font-medium block opacity-50`,
    active && clsx`opacity-100 bg-black/75 text-emerald-400`,
  )
