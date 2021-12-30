import type { LoaderFunction } from "remix"
import { Link, Outlet, useLoaderData } from "remix"
import { SideNav } from "~/components/side-nav"
import { SidebarLayout } from "~/components/sidebar-layout"
import type { ContentIndexEntry } from "~/create-index.server"
import { createContentIndex } from "~/create-index.server"
import { linkClass } from "~/styles"

type LoaderData = ContentIndexEntry[]

export const loader: LoaderFunction = async () => {
  const data: LoaderData = await createContentIndex("app/routes/docs/guides")
  return data
}

export default function Docs() {
  const data: LoaderData = useLoaderData()
  return (
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
        <section className="prose max-w-none prose-invert prose-h1:font-light flex-1 prose-h1:mb-4 prose-p:my-4 prose-pre:text-[15px] prose-pre:font-monospace prose-h2:font-light h-[200vh]">
          <Outlet />
        </section>
      }
    />
  )
}
