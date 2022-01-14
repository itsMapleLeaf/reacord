import type { LoaderFunction } from "remix"
import { useLoaderData } from "remix"
import { inspect } from "node:util"
import { loadApiData } from "~/modules/api/api-data.server"
import { renderMarkdown } from "~/modules/markdown/render-markdown.server"

type LoaderData = {
  title: string
  description?: { __html: string }
}

export const loader: LoaderFunction = async ({ params }) => {
  const apiData = await loadApiData()

  const entityName = params.name!

  const info = apiData.children?.find((child) => child.name === entityName)
  console.log(inspect(info, { depth: Number.POSITIVE_INFINITY }))

  const description = [
    info?.comment?.shortText,
    info?.comment?.text,
    info?.signatures?.[0]?.comment?.shortText,
    info?.signatures?.[0]?.comment?.text,
  ]
    .filter(Boolean)
    .join("\n\n")

  const data: LoaderData = {
    title: entityName,
    description: description ? await renderMarkdown(description) : undefined,
  }
  return data
}

export default function ApiDetailPage() {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <h1>{data.title}</h1>
      {data.description ? (
        <section dangerouslySetInnerHTML={data.description} />
      ) : undefined}
    </>
  )
}

function addDefined<Value extends number | string>(
  ...values: Array<Value | undefined>
): Value | undefined {}
