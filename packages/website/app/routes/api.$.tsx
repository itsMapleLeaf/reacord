import type { LoaderFunction } from "remix"

// loading the api through a resource route lets us receive analytics and remix server logs for api pages
export const loader: LoaderFunction = ({ request, params }) => {
  const url = new URL("/", request.url)
  return fetch(`${url.toString()}/api-dist/${params["*"]}`)
}
