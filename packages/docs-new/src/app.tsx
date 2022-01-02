import { description } from "reacord/package.json"
import { lazy, Suspense } from "react"
import { Meta, Title } from "react-head"
import { Route, Routes } from "react-router-dom"
import { GuidePageLayout } from "./components/guide-page-layout"
import { LandingPage } from "./pages/landing-page"

export function App() {
  return (
    <>
      <Title>Reacord</Title>
      <Meta name="description" content={description} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="docs" element={<GuidePageLayout />}>
          {docs.map(({ route, component: Component }) => (
            <Route
              key={route}
              path={route}
              element={
                <Suspense fallback={<></>}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </>
  )
}

const docs = Object.entries(import.meta.glob("./docs/*.md")).map(
  ([path, loadModule]) => ({
    route: path.replace("./docs/", "").replace(/\.md$/, ""),
    component: lazy(async () => {
      const m = await loadModule()
      return { default: m.default || m }
    }),
  }),
)
