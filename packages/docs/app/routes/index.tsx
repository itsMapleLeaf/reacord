import type { LoaderFunction } from "remix"
import { useLoaderData } from "remix"
import type { DocsJson } from "~/docs.server"
import { loadDocs } from "~/docs.server"

export const loader: LoaderFunction = () => loadDocs()

export default function Index() {
  const data: DocsJson = useLoaderData()
  return (
    <main>
      <pre className="w-full overflow-x-auto">
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </main>
  )
}
