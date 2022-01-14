import clsx from "clsx"
import { Fragment } from "react"
import type { LoaderFunction } from "remix"
import { Outlet, useLoaderData } from "remix"
import { loadApiData } from "~/modules/api/api-data.server"
import { ActiveLink } from "~/modules/navigation/active-link"
import type { AppLinkProps } from "~/modules/navigation/app-link"
import { AppLink } from "~/modules/navigation/app-link"
import { MainNavigation } from "~/modules/navigation/main-navigation"
import {
  docsProseClass,
  linkClass,
  maxWidthContainer,
} from "~/modules/ui/components"

type LoaderData = {
  categorySections: Array<{
    title: string
    links: AppLinkProps[]
  }>
  // [key: string]: unknown
}

export const loader: LoaderFunction = async () => {
  const apiData = await loadApiData()

  const childrenById = Object.fromEntries(
    apiData.children.map((child) => [child.id, { name: child.name }]),
  )

  const data: LoaderData = {
    categorySections: apiData.categories.map((category) => ({
      title: category.title,
      links: category.children
        .map((childId) => childrenById[childId])
        .flatMap<AppLinkProps>((child) =>
          child
            ? { to: `/api/${child.name}`, type: "router", children: child.name }
            : [],
        ),
    })),
  }
  return data
}

export default function ApiReferencePage() {
  const data = useLoaderData<LoaderData>()
  return (
    <div className="isolate">
      <header className="bg-slate-700/30 shadow sticky top-0 backdrop-blur-sm transition z-10 flex">
        <div className={maxWidthContainer}>
          <MainNavigation />
        </div>
      </header>

      <div className={clsx(maxWidthContainer, "mt-8 flex items-start gap-4")}>
        <nav className="w-48 sticky top-24 hidden md:block">
          {data.categorySections.map((category) => (
            <Fragment key={category.title}>
              <h2 className="text-2xl">{category.title}</h2>
              <ul className="mt-3 mb-6 flex flex-col gap-2 items-start">
                {category.links.map((link) => (
                  <li key={link.to}>
                    <ActiveLink to={link.to}>
                      {({ active }) => (
                        <AppLink {...link} className={linkClass({ active })} />
                      )}
                    </ActiveLink>
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}
        </nav>

        <main className={clsx(docsProseClass, "pb-8 flex-1 min-w-0")}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
