import type { LoaderFunction } from "remix"
import { useLoaderData } from "remix"
import { getApiData } from "~/modules/api/api-data.server"
import { renderMarkdown } from "~/modules/markdown/render-markdown.server"
import { docsProseClass } from "~/modules/ui/components"

type LoaderData = {
  title: string
  description?: { __html: string }
  [key: string]: unknown
}

export const loader: LoaderFunction = async ({ params }) => {
  const apiData = getApiData()

  const entityName = params.name!

  const info = apiData.children?.find((child) => child.name === entityName)

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
    sig: await renderMarkdown(`
\`\`\`tsx
function ActionRow(props: ActionRowProps): ReactElement
\`\`\`
`),
  }
  return data
}

export default function ApiDetailPage() {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <h1 className="text-3xl font-light">{data.title}</h1>
      <p className="text-sm font-bold opacity-50 uppercase mt-1">Component</p>
      <section
        className={docsProseClass}
        dangerouslySetInnerHTML={data.description}
      />
      <section className={docsProseClass}>
        <ul>
          <li>
            <p>
              <code>children?: ReactNode</code>
            </p>
            <p>
              This should be a list of <code>{`<Option />`}</code> components.
            </p>
            <ul>
              <li>
                <p>
                  <code>disabled?: boolean</code>
                </p>
                <p>
                  When true, the select will be slightly faded, and cannot be
                  interacted with.
                </p>
              </li>
            </ul>
          </li>
          <li>
            <p>
              <code>minValues?: number</code>
            </p>
            <p>
              With <code>multiple</code>, the minimum number of values that can
              be selected. When <code>multiple</code> is false or not defined,
              this is always 1.
            </p>
            <p>
              This only limits the number of values that can be received by the
              user. This does not limit the number of values that can be
              displayed by you.
            </p>
          </li>
        </ul>
      </section>
    </>
  )
}
