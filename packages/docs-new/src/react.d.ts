import "react"
declare module "react" {
  export function createContext<Value>(): Context<Value | undefined>
}

declare module "react-dom" {
  export function createRoot(element: Element): {
    render(element: React.ReactNode): void
  }
}
