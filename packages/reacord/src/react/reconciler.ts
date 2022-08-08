/* eslint-disable unicorn/prefer-modern-dom-apis */
import { raise } from "@reacord/helpers/raise"
import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import { Node, TextNode } from "../node"
import type { ReacordInstancePrivate } from "../reacord-instance"

export const reconciler = ReactReconciler<
  string, // Type,
  Record<string, unknown>, // Props,
  ReacordInstancePrivate, // Container,
  Node, // Instance,
  TextNode, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  never, // HostContext,
  true, // UpdatePayload,
  never, // ChildSet,
  number, // TimeoutHandle,
  number // NoTimeout,
>({
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
  createTextInstance: (text) => new TextNode({ text }),
  shouldSetTextContent: () => false,
  detachDeletedInstance: (instance) => {},
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  // eslint-disable-next-line unicorn/no-null
  getInstanceFromNode: (node: any) => null,
  // eslint-disable-next-line unicorn/no-null
  getInstanceFromScope: (scopeInstance: any) => null,

  clearContainer: (instance) => {
    instance.tree.clear()
  },
  appendChildToContainer: (instance, child) => {
    instance.tree.add(child)
  },
  removeChildFromContainer: (instance, child) => {
    instance.tree.remove(child)
  },
  insertInContainerBefore: (instance, child, before) => {
    instance.tree.insertBefore(child, before)
  },

  appendInitialChild: (parent, child) => {
    parent.add(child)
  },
  appendChild: (parent, child) => {
    parent.add(child)
  },
  removeChild: (parent, child) => {
    parent.remove(child)
  },
  insertBefore: (parent, child, before) => {
    parent.insertBefore(child, before)
  },

  prepareUpdate: () => true,
  commitUpdate: (node, payload, type, oldProps, newProps) => {
    node.props = newProps.props
  },
  commitTextUpdate: (node, oldText, newText) => {
    node.props.text = newText
  },

  // eslint-disable-next-line unicorn/no-null
  prepareForCommit: () => null,
  resetAfterCommit: (renderer) => {
    void renderer.update(renderer.tree)
  },
  prepareScopeUpdate: (scopeInstance: any, instance: any) => {},

  preparePortalMount: () => raise("Portals are not supported"),
  getPublicInstance: () => raise("Refs are currently not supported"),

  finalizeInitialChildren: () => false,

  getCurrentEventPriority: () => DefaultEventPriority,
})
