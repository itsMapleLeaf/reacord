import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import type { Container } from "./container"
import type { Node } from "./node"
import { TextNode } from "./node"

export const reconciler = ReactReconciler<
  string, // Type
  Record<string, unknown>, // Props
  { nodes: Container<Node>; render: () => void }, // Container
  never, // Instance
  TextNode, // TextInstance
  never, // SuspenseInstance
  never, // HydratableInstance
  never, // PublicInstance
  {}, // HostContext
  true, // UpdatePayload
  never, // ChildSet
  NodeJS.Timeout, // TimeoutHandle
  -1 // NoTimeout
>({
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  createInstance() {
    throw new Error("Not implemented")
  },

  createTextInstance(text) {
    return new TextNode(text)
  },

  appendInitialChild(parent, child) {},

  appendChild(parentInstance, child) {},

  appendChildToContainer(container, child) {
    container.nodes.add(child)
  },

  insertBefore(parentInstance, child, beforeChild) {},

  insertInContainerBefore(container, child, beforeChild) {
    container.nodes.insertBefore(child, beforeChild)
  },

  removeChild(parentInstance, child) {},

  removeChildFromContainer(container, child) {
    container.nodes.remove(child)
  },

  clearContainer(container) {
    container.nodes.clear()
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.setText(newText)
  },

  commitUpdate(
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle,
  ) {},

  prepareForCommit() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },

  resetAfterCommit(container) {
    container.render()
  },

  finalizeInitialChildren() {
    return false
  },

  prepareUpdate() {
    return true
  },

  shouldSetTextContent() {
    return false
  },

  getRootHostContext() {
    return {}
  },

  getChildHostContext() {
    return {}
  },

  getPublicInstance() {
    throw new Error("Refs are not supported")
  },

  preparePortalMount() {},

  getCurrentEventPriority() {
    return DefaultEventPriority
  },

  getInstanceFromNode() {
    return undefined
  },

  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  prepareScopeUpdate() {},
  getInstanceFromScope() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },
  detachDeletedInstance() {},
})
