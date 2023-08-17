import { LooseOmit, LoosePick, typeEquals } from "./types.ts"

typeEquals<LoosePick<{ a: 1; b: 2 }, "a">, { a: 1 }>(true)
typeEquals<LooseOmit<{ a: 1; b: 2 }, "a">, { b: 2 }>(true)
