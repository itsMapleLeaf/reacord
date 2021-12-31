import { Route, Routes } from "react-router"
import { Link } from "react-router-dom"
import { DocumentPage } from "./document-page"
import { LandingPage } from "./landing-page"

export function AppRoutes() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="docs/getting-started">Getting Started</Link>
        <Link to="docs/api">API Reference</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="docs/*" element={<DocumentPage />} />
      </Routes>
    </>
  )
}
