import glob from "fast-glob"
import grayMatter from "gray-matter"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { AppLinkProps } from "../components/app-link"
import { fromProjectRoot } from "../constants"

const docsFolderPath = fromProjectRoot("src/docs")
const guideFiles = await glob("**/*.md", { cwd: docsFolderPath })

const entries = await Promise.all(
  guideFiles.map(async (file) => {
    const content = await readFile(join(docsFolderPath, file), "utf-8")
    const { data } = grayMatter(content)

    let order = Number(data.order)
    if (!Number.isFinite(order)) {
      order = Number.POSITIVE_INFINITY
    }

    return {
      route: `/docs/${file.replace(/\.mdx?$/, "")}`,
      title: String(data.title || ""),
      order,
    }
  }),
)

export const guideLinks: AppLinkProps[] = entries
  .sort((a, b) => a.order - b.order)
  .map((item) => ({
    type: "internal",
    label: item.title,
    to: item.route,
  }))
