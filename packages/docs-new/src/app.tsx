import { description } from "reacord/package.json"
import { lazy, Suspense } from "react"
import { Meta, Title } from "react-head"
import { Link, Route, Routes } from "react-router-dom"
import { lazyNamed } from "./helpers/lazy-named"

export function App() {
  return (
    <>
      <Title>Reacord</Title>
      <Meta name="description" content={description} />
      <nav>
        <Link to="/">Home</Link>{" "}
        <Link to="docs/getting-started">Getting Started</Link>{" "}
        <Link to="docs/api">API Reference</Link>
      </nav>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="docs" element={<DocumentPageLayout />}>
            {docs.map(({ route, component: Component }) => (
              <Route key={route} path={route} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

const LandingPage = lazyNamed(
  "LandingPage",
  () => import("./pages/landing-page"),
)

const DocumentPageLayout = lazyNamed(
  "DocumentPage",
  () => import("./pages/document-page"),
)

const docs = Object.entries(import.meta.glob("./docs/*.md")).map(
  ([path, loadModule]) => ({
    route: path.replace("./docs/", "").replace(/\.md$/, ""),
    component: lazy(async () => {
      const m = await loadModule()
      return { default: m.default || m }
    }),
  }),
)
