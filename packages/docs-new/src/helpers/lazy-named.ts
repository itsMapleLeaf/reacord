import { lazy } from "react"

export function lazyNamed<
  Key extends string,
  Component extends React.ComponentType,
>(key: Key, loadModule: () => Promise<Record<Key, Component>>) {
  return lazy<Component>(async () => {
    const mod = await loadModule()
    return { default: mod[key] }
  })
}
