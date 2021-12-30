import { readFile } from "node:fs/promises"
import remarkFrontmatter from "remark-frontmatter"
import remarkParse from "remark-parse"
import type { LoaderFunction } from "remix"
import { Link, Outlet } from "remix"
import { unified } from "unified"
import { SideNav } from "~/components/side-nav"
import { SidebarLayout } from "~/components/sidebar-layout"
import { linkClass } from "~/styles"

export const loader: LoaderFunction = async () => {
  const glob = await import("fast-glob")

  const contentFiles = await glob.default(["**/*.mdx", "**/*.md"], {
    cwd: "content",
    absolute: true,
  })

  const contentModules = await Promise.all(
    contentFiles.map(async (filePath) => {
      const content = await readFile(filePath, "utf8")
      const result = await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .process(content)

      return { filePath, result: result.toString() }
    }),
  )

  console.log(contentModules)

  return {}
}

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
