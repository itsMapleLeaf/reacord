import { StaticRouter } from "react-router-dom/server"
import { Root } from "./root"
import { AppRoutes } from "./routes"

export async function render(url: string) {
  return (
    <Root>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </Root>
  )
}
