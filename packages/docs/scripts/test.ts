import cypress from "cypress"
import { execa } from "execa"
import waitOn from "wait-on"

await execa("pnpm", ["build"], { stdio: "inherit" })
const app = execa("pnpm", ["start"], { stdio: "inherit", detached: true })
await waitOn({ resources: ["http-get://localhost:3000"] })
await cypress.run()
process.kill(app.pid!, "SIGKILL")
// eslint-disable-next-line unicorn/no-process-exit
process.exit(0)
