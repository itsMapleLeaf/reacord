import clsx from "clsx"
import type { LoaderFunction } from "remix"
import { Link, Outlet, useLoaderData } from "remix"
import { MainNavigation } from "~/components/main-navigation"
import type { ContentIndexEntry } from "~/helpers/create-index.server"
import { createContentIndex } from "~/helpers/create-index.server"
import { useScrolled } from "~/hooks/dom/use-scrolled"
import { docsProseClass, linkClass, maxWidthContainer } from "~/styles"

type LoaderData = ContentIndexEntry[]

export const loader: LoaderFunction = async () => {
  const data: LoaderData = await createContentIndex("app/routes/docs/guides")
  return data
}

export default function Docs() {
  const data: LoaderData = useLoaderData()
  return (
    <>
      <HeaderPanel>
        <div className={maxWidthContainer}>
          <MainNavigation />
        </div>
      </HeaderPanel>
      <main className={clsx(maxWidthContainer, "mt-8 flex items-start gap-4")}>
        <nav className="w-64 sticky top-24">
          <h2 className="text-2xl">Guides</h2>
          <ul className="mt-3 flex flex-col gap-2 items-start">
            {data.map(({ title, route }) => (
              <li key={route}>
                <Link className={linkClass} to={route}>
                  {title}
                </Link>
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

function HeaderPanel({ children }: { children: React.ReactNode }) {
  const isScrolled = useScrolled()

  const className = clsx(
    isScrolled ? "bg-slate-700/30" : "bg-slate-800",
    "shadow-md sticky top-0 backdrop-blur-sm transition z-10 flex",
  )

  return <header className={className}>{children}</header>
}
