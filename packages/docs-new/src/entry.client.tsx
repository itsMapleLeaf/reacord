import { hydrate } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Root } from "./root"
import { AppRoutes } from "./routes"

hydrate(
  <Root>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </Root>,
  document,
)
