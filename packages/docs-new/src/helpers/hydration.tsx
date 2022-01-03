import { build } from "esbuild"
import { readFile } from "node:fs/promises"
import { dirname } from "node:path"
import React from "react"
import { Script } from "../components/script"

let nextId = 0

export async function createHydrater<Data>(scriptFilePath: string) {
  const id = `hydrate-root-${nextId}`
  nextId += 1

  const scriptSource = await readFile(scriptFilePath, "utf-8")

  const scriptBuild = await build({
    bundle: true,
    stdin: {
      contents: [scriptSource, clientBootstrap(id)].join(";\n"),
      sourcefile: scriptFilePath,
      loader: "tsx",
      resolveDir: dirname(scriptFilePath),
    },
    target: ["chrome89", "firefox89"],
    format: "esm",
    write: false,
  })

  const serverModule = await import(scriptFilePath)

  return function Hydrater({ data }: { data: Data }) {
    return (
      <>
        <div id={id} data-server-data={JSON.stringify(data)}>
          {serverModule.render(data)}
        </div>
        <Script>{scriptBuild.outputFiles[0]?.text!}</Script>
      </>
    )
  }
}

function clientBootstrap(id: string) {
  return /* ts */ `
    import { createRoot } from "react-dom"

    const rootElement = document.querySelector("#${id}")
    const data = JSON.parse(rootElement.dataset.serverData)

    createRoot(rootElement).render(render(data))
  `
}
