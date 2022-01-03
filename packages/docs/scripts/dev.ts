import browserSync from "browser-sync"
import chokidar from "chokidar"
import type { ExecaChildProcess } from "execa"
import { execa } from "execa"
import pino from "pino"
import { concatMap, debounceTime, Observable, tap } from "rxjs"
import waitOn from "wait-on"
import packageJson from "../package.json"

const console = pino()

function awaitChildStopped(child: ExecaChildProcess) {
  if (child.killed) return
  return new Promise((resolve) => child.once("close", resolve))
}

class App {
  app: ExecaChildProcess | undefined

  async start() {
    console.info(this.app ? "Restarting app..." : "Starting app...")

    await this.stop()

    const [command, ...flags] = packageJson.scripts.serve.split(/\s+/)
    this.app = execa(command!, flags, {
      stdio: "inherit",
      detached: true,
    })

    this.app.catch((error) => {
      if (error.signal !== "SIGINT") {
        console.error(error)
      }
    })

    void this.app.on("close", () => {
      this.app = undefined
    })

    await waitOn({ resources: ["http-get://localhost:3000"] })

    console.info("App running")
  }

  async stop() {
    if (this.app) {
      if (this.app.pid != undefined) {
        process.kill(-this.app.pid, "SIGINT")
      } else {
        this.app.kill("SIGINT")
      }
      await awaitChildStopped(this.app)
    }
  }
}

class Builder {
  child = execa("tsup", ["--watch"], {
    stdio: "inherit",
  })

  async stop() {
    this.child.kill()
    await awaitChildStopped(this.child)
  }
}

class Browser {
  browser = browserSync.create()

  constructor() {
    this.browser.emitter.on("init", () => {
      console.info("Browsersync started")
    })
    this.browser.emitter.on("browser:reload", () => {
      console.info("Browser reloaded")
    })
  }

  init() {
    this.browser.init({
      proxy: "http://localhost:3000",
      port: 3001,
      ui: false,
      logLevel: "silent",
    })
  }

  reload() {
    this.browser.reload()
  }

  stop() {
    this.browser.exit()
  }
}

class Watcher {
  subscription = new Observable<string>((subscriber) => {
    chokidar
      .watch(packageJson.main, { ignored: /node_modules/, ignoreInitial: true })
      .on("all", (_, path) => subscriber.next(path))
  })
    .pipe(
      tap((path) => console.info(`Changed:`, path)),
      debounceTime(100),
      concatMap(async () => {
        await this.app.start()
        this.browser.reload()
      }),
    )
    .subscribe()

  constructor(private app: App, private browser: Browser) {}

  stop() {
    this.subscription.unsubscribe()
  }
}

const app = new App()
const builder = new Builder()
const browser = new Browser()
const watcher = new Watcher(app, browser)

process.on("SIGINT", async () => {
  console.info("Shutting down...")
  try {
    await Promise.all([app, browser, watcher, builder].map((it) => it.stop()))
  } catch (error) {
    console.error(error)
  }
  process.exit()
})

await app.start()
browser.init()
