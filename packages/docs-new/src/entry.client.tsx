import { createRoot } from "react-dom"
import { HeadProvider } from "react-head"
import { BrowserRouter } from "react-router-dom"
import { App } from "./app"

createRoot(document.querySelector("#app")!).render(
  <BrowserRouter>
    <HeadProvider>
      <App />
    </HeadProvider>
  </BrowserRouter>,
)

declare module "react-dom" {
  export function createRoot(element: Element): {
    render(element: React.ReactNode): void
  }
}
