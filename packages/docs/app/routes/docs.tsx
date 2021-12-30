import type { LoaderFunction } from "remix"
import { Link, Outlet, useLoaderData } from "remix"
import { HeaderLayout } from "~/components/header-layout"
import { HeaderNav } from "~/components/header-nav"
import { SideNav } from "~/components/side-nav"
import { SidebarLayout } from "~/components/sidebar-layout"
import type { ContentIndexEntry } from "~/helpers/create-index.server"
import { createContentIndex } from "~/helpers/create-index.server"
import { docsProseClass, linkClass } from "~/styles"

type LoaderData = ContentIndexEntry[]

export const loader: LoaderFunction = async () => {
  const data: LoaderData = await createContentIndex("app/routes/docs/guides")
  return data
}

export default function Docs() {
  const data: LoaderData = useLoaderData()
  return (
    <HeaderLayout
      header={<HeaderNav />}
      body={
        <SidebarLayout
          sidebar={
            <SideNav heading="Guides">
              {data.map(({ title, route }) => (
                <Link className={linkClass} key={route} to={route}>
                  {title}
                </Link>
              ))}
            </SideNav>
          }
          body={
            <section className={docsProseClass}>
              <Outlet />
            </section>
          }
        />
      }
    />
  )
}
