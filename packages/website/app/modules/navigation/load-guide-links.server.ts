import glob from "fast-glob"
import grayMatter from "gray-matter"
import { readFile } from "node:fs/promises"
import { join, parse } from "node:path"
import type { AppLinkProps } from "~/modules/navigation/app-link"

const guidesFolder = "app/routes/guides"

export type GuideLink = {
  title: string
  order: number
  link: AppLinkProps
}

export async function loadGuideLinks(): Promise<GuideLink[]> {
  const guideFiles = await glob(`**/*.md`, { cwd: guidesFolder })

  const links: GuideLink[] = await Promise.all(
    guideFiles.map(async (file) => {
      const { data } = grayMatter(await readFile(join(guidesFolder, file)))

      let order = data.order
      if (!Number.isFinite(order)) {
        order = Number.POSITIVE_INFINITY
      }

      return {
        title: data.meta?.title,
        order,
        link: {
          type: "router",
          to: `/guides/${parse(file).name}`,
          children: data.meta?.title,
        },
      }
    }),
  )

  return links.sort((a, b) => a.order - b.order)
}
