import glob from "fast-glob"
import matter from "gray-matter"
import { readFile } from "node:fs/promises"
import { join, parse, posix } from "node:path"

export type ContentIndexEntry = {
  title: string
  route: string
  order: number
}

export async function createContentIndex(
  contentFolderPath: string,
): Promise<ContentIndexEntry[]> {
  const contentFiles = await glob(["**/*.mdx", "**/*.md"], {
    cwd: contentFolderPath,
    absolute: true,
  })

  const entries = await Promise.all(contentFiles.map(getIndexInfo))

  return entries.sort((a, b) => a.order - b.order)
}

async function getIndexInfo(filePath: string): Promise<ContentIndexEntry> {
  const { dir, name } = parse(filePath)
  const route = "/" + posix.relative("app/routes", join(dir, name))

  const { data } = matter(await readFile(filePath, "utf8"))

  const title = String(data.meta?.title ?? "")

  let order = Number(data.order)
  if (!Number.isFinite(order)) {
    order = Number.POSITIVE_INFINITY
  }

  return { title, route, order }
}
