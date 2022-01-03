declare module "reload" {
  import type { Express } from "express"
  function reload(server: Express): Promise<void>
  export = reload
}
