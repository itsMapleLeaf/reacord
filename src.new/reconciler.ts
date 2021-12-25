import type { HostConfig } from "react-reconciler"
import ReactReconciler from "react-reconciler"
import { raise } from "../src/helpers/raise.js"
import { Node } from "./node.js"
import type { Renderer } from "./renderer.js"
import { TextNode } from "./text.js"

const config: HostConfig<
  string, // Type,
  Record<string, unknown>, // Props,
  Renderer, // Container,
  Node<unknown>, // Instance,
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
    if (type !== "reacord-element") {
      raise(`Unknown element type: ${type}`)
    }

    if (typeof props.createNode !== "function") {
      raise(`Missing createNode function`)
    }

    const node = props.createNode(props.props)
    if (!(node instanceof Node)) {
      raise(`createNode function did not return a Node`)
    }

    return node
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
  insertInContainerBefore: (renderer, child, before) => {
    renderer.addBefore(child, before)
  },

  // eslint-disable-next-line unicorn/no-null
  prepareUpdate: () => true,
  commitUpdate: (node, payload, type, oldProps, newProps) => {
    node.setProps(newProps.props)
  },
  commitTextUpdate: (node, oldText, newText) => {
    node.setProps(newText)
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
