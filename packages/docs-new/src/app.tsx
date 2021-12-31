import { description } from "reacord/package.json"
import { Meta, Title } from "react-head"
import { Route, Routes } from "react-router"
import { Link } from "react-router-dom"
import { DocumentPage } from "./pages/document-page"
import { LandingPage } from "./pages/landing-page"

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="docs/*" element={<DocumentPage />} />
      </Routes>
    </>
  )
}
