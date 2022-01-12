import cypress from "cypress"
import { execa } from "execa"
import waitOn from "wait-on"

await execa("pnpm", ["build"], { stdio: "inherit" })
const app = execa("pnpm", ["start"], { stdio: "inherit" })
await waitOn({ resources: ["http-get://localhost:3000"] })
await cypress.run()
app.kill()
