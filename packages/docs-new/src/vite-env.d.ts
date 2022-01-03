/// <reference types="vite/client" />

import "react"
declare module "react" {
  export function createContext<Value>(): Context<Value | undefined>
}
