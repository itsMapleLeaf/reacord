import express, { RequestHandler } from "express"
import PromiseRouter from "express-promise-router"
import * as TypeDoc from "typedoc"

let built = false
const outputDir = "api"

export function serveApiDocs(): RequestHandler {
  return PromiseRouter()
    .use(async (_, __, next) => {
      if (!built) {
        const app = new TypeDoc.Application()
        app.options.addReader(new TypeDoc.TSConfigReader())
        app.options.addReader(new TypeDoc.TypeDocReader())
        app.bootstrap()

        const project = app.convert()

        if (!project) {
          throw new Error("Failed to convert project")
        }

        await app.generateDocs(project, outputDir)
        built = true
      }
      next()
    })
    .use(express.static(outputDir))
}
