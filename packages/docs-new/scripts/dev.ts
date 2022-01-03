import browserSync from "browser-sync"
import type { ExecaChildProcess } from "execa"
import { execa } from "execa"
import { watch } from "node:fs/promises"
import pino from "pino"
import waitOn from "wait-on"
import packageJson from "../package.json"

const console = pino()

let app: ExecaChildProcess | undefined

async function stopApp() {
  if (app) {
    if (app.pid != undefined) {
      process.kill(-app.pid, "SIGINT")
    } else {
      app.kill("SIGINT")
    }
    await new Promise((resolve) => app?.once("close", resolve))
  }
}

async function startApp() {
  console.info(app ? "Restarting app..." : "Starting app...")

  await stopApp()

  const [command, ...flags] = packageJson.scripts.serve.split(/\s+/)
  app = execa(command!, flags, {
    stdio: "inherit",
    detached: true,
  })

  app.catch((error) => {
    if (error.signal !== "SIGINT") {
      console.error(error)
    }
  })

  await waitOn({ resources: ["tcp:localhost:3000"] })

  console.info("App running")
}

const browser = browserSync.create()

process.on("SIGINT", async () => {
  console.info("Shutting down...")
  await stopApp()
  browser.exit()
  process.exit()
})

await startApp()

browser.emitter.on("init", () => {
  console.info("Browsersync started")
})
browser.emitter.on("browser:reload", () => {
  console.info("Browser reloaded")
})

browser.init({
  proxy: "http://localhost:3000",
  port: 3001,
  ui: false,
  logLevel: "silent",
})

for await (const info of watch("src", { recursive: true })) {
  console.info(`Changed: ${info.filename}`)
  await startApp()
  browser.reload()
}
