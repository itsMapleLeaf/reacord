import { Link, Outlet } from "remix"
import { SideNav } from "~/components/side-nav"
import { SidebarLayout } from "~/components/sidebar-layout"
import { linkClass } from "~/styles"

export default function Docs() {
  return (
    <SidebarLayout
      sidebar={
        <SideNav heading="Guides">
          <Link className={linkClass} to="getting-started">
            Getting Started
          </Link>
          <Link className={linkClass} to="embeds">
            Embeds
          </Link>
          <Link className={linkClass} to="buttons">
            Buttons
          </Link>
          <Link className={linkClass} to="select-menus">
            Select Menus
          </Link>
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
