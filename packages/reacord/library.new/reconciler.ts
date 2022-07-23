import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import type { MessageTree, TextNode } from "./message-tree"

export const reconciler = ReactReconciler<
  string,
  Record<string, unknown>,
  MessageTree,
  never,
  TextNode,
  never,
  never,
  never,
  {},
  true,
  never,
  NodeJS.Timeout,
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
    return { type: "text", text }
  },

  appendInitialChild(parent, child) {},

  appendChild(parentInstance, child) {},

  appendChildToContainer(container, child) {
    container.children.push(child)
  },

  insertBefore(parentInstance, child, beforeChild) {},

  insertInContainerBefore(container, child, beforeChild) {
    const index = container.children.indexOf(beforeChild)
    if (index !== -1) container.children.splice(index, 0, child)
  },

  removeChild(parentInstance, child) {},

  removeChildFromContainer(container, child) {
    container.children = container.children.filter((c) => c !== child)
  },

  clearContainer(container) {
    container.children = []
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.text = newText
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
