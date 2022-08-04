import { writeFile } from "node:fs/promises"
import { join, relative } from "node:path/posix"
import prettier from "prettier"
import { Node, Project, SyntaxKind } from "ts-morph"

function isDeclarationPublic(declaration: Node) {
  if (!Node.isJSDocable(declaration)) return false

  const jsDocTags = new Set(
    declaration
      .getJsDocs()
      .flatMap((doc) => doc.getTags())
      .map((tag) => tag.getTagName()),
  )

  return jsDocTags.has("category") && !jsDocTags.has("private")
}

const project = new Project()

project.addSourceFilesAtPaths(["library/**/*.{ts,tsx}", "!library/main.ts"])

const exportLines = project
  .getSourceFiles()
  .map((file) => {
    const importPath = relative(
      "library",
      join(file.getDirectoryPath(), file.getBaseNameWithoutExtension() + ".js"),
    )
    const exports = file.getExportedDeclarations()

    const exportNames = [...exports].flatMap(([name, [declaration]]) => {
      if (!declaration) return []
      if (!isDeclarationPublic(declaration)) return []
      if (
        declaration.isKind(SyntaxKind.TypeAliasDeclaration) ||
        declaration.isKind(SyntaxKind.InterfaceDeclaration)
      ) {
        return `type ${name}`
      }
      return name
    })

    return { importPath, exportNames }
  })
  .filter(({ exportNames }) => exportNames.length > 0)
  .map(({ importPath, exportNames }) => {
    return `export { ${exportNames.join(", ")} } from "./${importPath}"`
  })

const resolvedConfig = await prettier.resolveConfig("library/main.ts")
if (!resolvedConfig) {
  throw new Error("Could not find prettier config")
}

await writeFile(
  "library/main.ts",
  prettier.format(exportLines.join(";"), {
    ...resolvedConfig,
    parser: "typescript",
  }),
)
