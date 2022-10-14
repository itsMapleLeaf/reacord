import { raise } from "@reacord/helpers/raise.js"
import type { HostConfig } from "react-reconciler"
import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants.js"
import { Node } from "./node.js"
import type { Renderer } from "./renderers/renderer"
import { TextNode } from "./text-node.js"

const config: HostConfig<
  string, // Type,
  Record<string, unknown>, // Props,
  Renderer, // Container,
  Node<unknown>, // Instance,
  TextNode, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  never, // HostContext,
  true, // UpdatePayload,
  never, // ChildSet,
  number, // TimeoutHandle,
  number // NoTimeout,
> = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: true,
  scheduleTimeout: global.setTimeout,
  cancelTimeout: global.clearTimeout,
  noTimeout: -1,

  // eslint-disable-next-line unicorn/no-null
  getRootHostContext: () => null,
  getChildHostContext: (parentContext) => parentContext,

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
  detachDeletedInstance: (instance) => {},
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  // eslint-disable-next-line unicorn/no-null
  getInstanceFromNode: (node: any) => null,
  // eslint-disable-next-line unicorn/no-null
  getInstanceFromScope: (scopeInstance: any) => null,

  clearContainer: (renderer) => {
    renderer.nodes.clear()
  },
  appendChildToContainer: (renderer, child) => {
    renderer.nodes.add(child)
  },
  removeChildFromContainer: (renderer, child) => {
    renderer.nodes.remove(child)
  },
  insertInContainerBefore: (renderer, child, before) => {
    renderer.nodes.addBefore(child, before)
  },

  appendInitialChild: (parent, child) => {
    parent.children.add(child)
  },
  appendChild: (parent, child) => {
    parent.children.add(child)
  },
  removeChild: (parent, child) => {
    parent.children.remove(child)
  },
  insertBefore: (parent, child, before) => {
    parent.children.addBefore(child, before)
  },

  prepareUpdate: () => true,
  commitUpdate: (node, payload, type, oldProps, newProps) => {
    node.props = newProps.props
  },
  commitTextUpdate: (node, oldText, newText) => {
    node.props = newText
  },

  // eslint-disable-next-line unicorn/no-null
  prepareForCommit: () => null,
  resetAfterCommit: (renderer) => {
    renderer.render()
  },
  prepareScopeUpdate: (scopeInstance: any, instance: any) => {},

  preparePortalMount: () => raise("Portals are not supported"),
  getPublicInstance: () => raise("Refs are currently not supported"),

  finalizeInitialChildren: () => false,

  getCurrentEventPriority: () => DefaultEventPriority,
}

export const reconciler = ReactReconciler(config)
