import clsx from "clsx"
import { Outlet } from "remix"
import { AppLink } from "~/modules/navigation/app-link"
import { useGuideLinksContext } from "~/modules/navigation/guide-links-context"
import { MainNavigation } from "~/modules/navigation/main-navigation"
import {
  docsProseClass,
  linkClass,
  maxWidthContainer,
} from "~/modules/ui/components"

export default function GuidePage() {
  const guideLinks = useGuideLinksContext()
  return (
    <>
      <header className="bg-slate-700/30 shadow sticky top-0 backdrop-blur-sm transition z-10 flex">
        <div className={maxWidthContainer}>
          <MainNavigation />
        </div>
      </header>
      <main className={clsx(maxWidthContainer, "mt-8 flex items-start gap-4")}>
        <nav className="w-48 sticky top-24 hidden md:block">
          <h2 className="text-2xl">Guides</h2>
          <ul className="mt-3 flex flex-col gap-2 items-start">
            {guideLinks.map(({ link }) => (
              <li key={link.to}>
                <AppLink {...link} className={linkClass} />
              </li>
            ))}
          </ul>
        </nav>
        <section className={clsx(docsProseClass, "pb-8 flex-1 min-w-0")}>
          <Outlet />
        </section>
      </main>
    </>
  )
}
