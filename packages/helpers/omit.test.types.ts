import { omit } from "./omit.ts"

omit({ a: 1, b: true }, ["a"]) satisfies { b: boolean }
