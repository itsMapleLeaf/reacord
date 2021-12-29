import { readFile } from "fs/promises"
import { json, LoaderFunction, useLoaderData } from "remix"

export const loader: LoaderFunction = async () => {
  const docs = await readFile("app/docs.json", "utf8")
  return json(JSON.parse(docs))
}

export default function Index() {
  const data = useLoaderData()
  return (
    <main>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </main>
  )
}
