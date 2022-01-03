import clsx from "clsx"

const menus = document.querySelectorAll("[data-popover]")

for (const menu of menus) {
  const button = menu.querySelector<HTMLButtonElement>("[data-popover-button]")!

  const panel = menu.querySelector<HTMLDivElement>("[data-popover-panel]")!
  const panelClasses = clsx`${panel.className} transition-all`

  const visibleClass = clsx`${panelClasses} visible opacity-100 translate-y-0`
  const hiddenClass = clsx`${panelClasses} invisible opacity-0 translate-y-2`

  let visible = false

  const setVisible = (newVisible: boolean) => {
    visible = newVisible
    panel.className = visible ? visibleClass : hiddenClass

    if (!visible) return

    requestAnimationFrame(() => {
      const handleClose = (event: MouseEvent) => {
        if (panel.contains(event.target as Node)) return
        setVisible(false)
        window.removeEventListener("click", handleClose)
      }
      window.addEventListener("click", handleClose)
    })
  }

  const toggleVisible = () => setVisible(!visible)

  button.addEventListener("click", toggleVisible)

  setVisible(false)
  panel.hidden = false
}
