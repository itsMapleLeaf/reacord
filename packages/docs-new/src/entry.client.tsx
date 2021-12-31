import { hydrate } from "react-dom"
import { HeadProvider } from "react-head"
import { ReactLocation } from "react-location"
import { App } from "./app"

const location = new ReactLocation()

hydrate(
  <HeadProvider>
    <App location={location} />
  </HeadProvider>,
  document.querySelector("#app"),
)
