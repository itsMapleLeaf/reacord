import type { Route } from "react-location"

export const routes: Route[] = [
  {
    path: "/",
    element: () =>
      import("./pages/landing-page").then((m) => <m.LandingPage />),
  },
  {
    path: "docs",
    element: () =>
      import("./pages/document-page").then((m) => <m.DocumentPage />),
    children: [
      {
        path: "*",
        element: ({ params }) =>
          import(`./docs/${params["*"]}.md`).then((m) => <m.default />),
      },
    ],
  },
]
