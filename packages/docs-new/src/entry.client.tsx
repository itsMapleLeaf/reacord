import { createRoot } from "react-dom"
import { HeadProvider } from "react-head"
import { ReactLocation } from "react-location"
import { App } from "./app"

const location = new ReactLocation()

createRoot(document.querySelector("#app")!).render(
  <HeadProvider>
    <App location={location} />
  </HeadProvider>,
)

declare module "react-dom" {
  export function createRoot(element: Element): {
    render(element: React.ReactNode): void
  }
}
