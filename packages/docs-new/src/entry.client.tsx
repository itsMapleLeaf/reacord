import { hydrate } from "react-dom"
import { HeadProvider } from "react-head"
import { BrowserRouter } from "react-router-dom"
import { App } from "./app"

hydrate(
  <BrowserRouter>
    <HeadProvider>
      <App />
    </HeadProvider>
  </BrowserRouter>,
  document.querySelector("#app"),
)
