import { description } from "reacord/package.json"
import { Meta, Title } from "react-head"
import type { ReactLocation } from "react-location"
import { Link, Outlet, Router } from "react-location"
import { routes } from "./routes"

export function App({ location }: { location: ReactLocation }) {
  return (
    <Router location={location} routes={routes}>
      <Title>Reacord</Title>
      <Meta name="description" content={description} />
      <nav>
        <Link to="/">Home</Link>{" "}
        <Link to="docs/getting-started">Getting Started</Link>{" "}
        <Link to="docs/api">API Reference</Link>
      </nav>
      <Outlet />
    </Router>
  )
}
