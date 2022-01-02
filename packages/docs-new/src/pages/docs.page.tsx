import clsx from "clsx"
import { AppLink } from "../components/app-link"
import { MainNavigation } from "../components/main-navigation"
import { guideLinks } from "../data/guide-links"
import { useScrolled } from "../hooks/dom/use-scrolled"
import {
  docsProseClass,
  linkClass,
  maxWidthContainer,
} from "../styles/components"

export { DocsPage as Page }

function DocsPage() {
  return (
    <>
      <HeaderPanel>
        <div className={maxWidthContainer}>
          <MainNavigation />
        </div>
      </HeaderPanel>
      <main className={clsx(maxWidthContainer, "mt-8 flex items-start gap-4")}>
        <nav className="w-48 sticky top-24 hidden md:block">
          <h2 className="text-2xl">Guides</h2>
          <ul className="mt-3 flex flex-col gap-2 items-start">
            {guideLinks.map((link) => (
              <li key={link.to}>
                <AppLink {...link} className={linkClass} />
              </li>
            ))}
          </ul>
        </nav>
        <section className={clsx(docsProseClass, "pb-8 flex-1 min-w-0")}>
          {/* todo */}
        </section>
      </main>
    </>
  )
}

function HeaderPanel({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled()

  const className = clsx(
    isScrolled ? "bg-slate-700/30" : "bg-slate-800",
    "shadow sticky top-0 backdrop-blur-sm transition z-10 flex",
  )

  return <header className={className}>{children}</header>
}
