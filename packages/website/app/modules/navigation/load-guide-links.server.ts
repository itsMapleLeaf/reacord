import glob from "fast-glob"
import grayMatter from "gray-matter"
import { readFile } from "node:fs/promises"
import { join, parse } from "node:path"
import { z } from "zod"

const guidesFolder = "app/routes/guides"

const frontmatterSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
  }),
  order: z.number().optional(),
})

export type GuideLink = Awaited<ReturnType<typeof loadGuideLinks>>[0]

export async function loadGuideLinks() {
  const guideFiles = await glob(`**/*.md`, { cwd: guidesFolder })

  const links = await Promise.all(
    guideFiles.map(async (file) => {
      const result = grayMatter(await readFile(join(guidesFolder, file)))
      const data = frontmatterSchema.parse(result.data)
      return {
        title: data.meta.title,
        order: data.order ?? Number.POSITIVE_INFINITY,
        link: {
          type: "router" as const,
          to: `/guides/${parse(file).name}`,
          children: data.meta.title,
        },
      }
    }),
  )

  return links.sort((a, b) => a.order - b.order)
}
