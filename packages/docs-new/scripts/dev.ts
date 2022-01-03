import browserSync from "browser-sync"
import chokidar from "chokidar"
import type { ExecaChildProcess } from "execa"
import { execa } from "execa"
import pino from "pino"
import { concatMap, debounceTime, map, Observable, tap } from "rxjs"
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

  await waitOn({ resources: ["http-get://localhost:3000"] })

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

new Observable<string>((subscriber) => {
  chokidar
    .watch(".", { ignored: /node_modules/, ignoreInitial: true })
    .on("all", (_, path) => subscriber.next(path))
})
  .pipe(
    tap((path) => console.info(`Changed:`, path)),
    debounceTime(100),
    concatMap(startApp),
    map(() => browser.reload()),
  )
  .subscribe()

// chokidar.watch(".", { ignored: /node_modules/, ignoreInitial: true }).on('all', )
