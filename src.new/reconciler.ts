import type { HostConfig } from "react-reconciler"
import ReactReconciler from "react-reconciler"
import { raise } from "../src/helpers/raise.js"
import { ButtonNode } from "./components/button.js"
import type { Node } from "./node.js"
import type { RootNode } from "./root-node.js"
import { TextNode } from "./text-node.js"

const config: HostConfig<
  string, // Type,
  Record<string, unknown>, // Props,
  RootNode, // Container,
  Node, // Instance,
  TextNode, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  {}, // HostContext,
  never, // UpdatePayload,
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

  clearContainer: (root) => {
    root.clear()
  },
  appendChildToContainer: (root, child) => {
    root.add(child)
  },
  removeChildFromContainer: (root, child) => {
    root.remove(child)
  },

  // eslint-disable-next-line unicorn/no-null
  prepareUpdate: () => null,
  commitUpdate: () => {},
  commitTextUpdate: (node, oldText, newText) => {
    node.text = newText
  },

  // eslint-disable-next-line unicorn/no-null
  prepareForCommit: () => null,
  resetAfterCommit: (root) => {
    root.render()
  },

  preparePortalMount: () => raise("Portals are not supported"),
  getPublicInstance: () => raise("Refs are currently not supported"),

  appendInitialChild: () => raise("not implemented"),
  finalizeInitialChildren: () => false,
}

export const reconciler = ReactReconciler(config)
