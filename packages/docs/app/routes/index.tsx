import type { LoaderFunction } from "remix"
import { useLoaderData } from "remix"
import type { DocsJson } from "~/load-docs.server"
import { loadDocs } from "~/load-docs.server"

export const loader: LoaderFunction = () => loadDocs()

export default function Index() {
  const data: DocsJson = useLoaderData()
  return (
    <main>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </main>
  )
}
