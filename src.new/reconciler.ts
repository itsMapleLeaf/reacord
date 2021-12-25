import type { HostConfig } from "react-reconciler"
import ReactReconciler from "react-reconciler"
import { raise } from "../src/helpers/raise.js"
import { ButtonNode } from "./components/button.js"
import type { Node } from "./node.js"
import type { Renderer } from "./renderer.js"
import { TextNode } from "./text-node.js"

const config: HostConfig<
  string, // Type,
  Record<string, unknown>, // Props,
  Renderer, // Container,
  Node, // Instance,
  TextNode, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  {}, // HostContext,
  true, // UpdatePayload,
  never, // ChildSet,
  number, // TimeoutHandle,
  number // NoTimeout,
> = {
  // config
  now: Date.now,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: true,
  scheduleTimeout: global.setTimeout,
  cancelTimeout: global.clearTimeout,
  noTimeout: -1,

  getRootHostContext: () => ({}),
  getChildHostContext: () => ({}),

  createInstance: (type, props) => {
    if (type === "reacord-button") return new ButtonNode(props)
    raise(`Unknown type: ${type}`)
  },
  createTextInstance: (text) => new TextNode(text),
  shouldSetTextContent: () => false,

  clearContainer: (renderer) => {
    renderer.clear()
  },
  appendChildToContainer: (renderer, child) => {
    renderer.add(child)
  },
  removeChildFromContainer: (renderer, child) => {
    renderer.remove(child)
  },

  // eslint-disable-next-line unicorn/no-null
  prepareUpdate: () => true,
  commitUpdate: (node, payload, type, oldProps, newProps) => {
    node.props = newProps
  },
  commitTextUpdate: (node, oldText, newText) => {
    node.text = newText
  },

  // eslint-disable-next-line unicorn/no-null
  prepareForCommit: () => null,
  resetAfterCommit: (renderer) => {
    renderer.render()
  },

  preparePortalMount: () => raise("Portals are not supported"),
  getPublicInstance: () => raise("Refs are currently not supported"),

  appendInitialChild: () => raise("not implemented"),
  finalizeInitialChildren: () => false,
}

export const reconciler = ReactReconciler(config)
