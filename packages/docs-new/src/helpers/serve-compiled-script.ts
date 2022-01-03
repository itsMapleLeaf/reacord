import { build } from "esbuild"
import type { RequestHandler } from "express"
import { readFile } from "node:fs/promises"
import { dirname } from "node:path"

export async function serveCompiledScript(
  scriptFilePath: string,
): Promise<RequestHandler> {
  const scriptBuild = await build({
    bundle: true,
    stdin: {
      contents: await readFile(scriptFilePath, "utf-8"),
      sourcefile: scriptFilePath,
      loader: "tsx",
      resolveDir: dirname(scriptFilePath),
    },
    target: ["chrome89", "firefox89"],
    format: "esm",
    write: false,
  })

  return (req, res) => {
    res.setHeader("Content-Type", "application/javascript")
    res.end(scriptBuild.outputFiles[0]!.contents)
  }
}
