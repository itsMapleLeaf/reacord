/* eslint-disable unicorn/prefer-modern-dom-apis */
import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import type { Node } from "./node.js"
import type { ReacordElementHostProps } from "./reacord-element.js"
import { ReacordElementFactory } from "./reacord-element.js"
import type { ReacordInstance } from "./reacord-instance.js"
import { TextNode } from "./text-node.js"

// technically elements of any shape can go through the reconciler,
// so I'm typing this as unknown to ensure we validate the props
// before using them
type ReconcilerProps = {
  [_ in keyof ReacordElementHostProps]?: unknown
}

export const reconciler = ReactReconciler<
  string, // Type
  ReconcilerProps, // Props
  ReacordInstance, // Container
  Node, // Instance
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

  createInstance(type, props) {
    return ReacordElementFactory.unwrap(props.factory)
  },

  createTextInstance(text) {
    return new TextNode(text)
  },

  appendInitialChild(parent, child) {
    parent.add(child)
  },

  appendChild(parent, child) {
    parent.add(child)
  },

  appendChildToContainer(container, child) {
    container.currentTree.add(child)
  },

  insertBefore(parent, child, beforeChild) {
    parent.insertBefore(child, beforeChild)
  },

  insertInContainerBefore(container, child, beforeChild) {
    container.currentTree.insertBefore(child, beforeChild)
  },

  removeChild(parent, child) {
    parent.remove(child)
  },

  removeChildFromContainer(container, child) {
    container.currentTree.remove(child)
  },

  clearContainer(container) {
    container.currentTree.clear()
  },

  commitTextUpdate(node, oldText, newText) {
    node.text = newText
  },

  prepareUpdate() {
    return true
  },

  commitUpdate(node, updatePayload, type, prevProps, nextProps) {
    node.props = ReacordElementFactory.unwrap(nextProps.factory).props
  },

  prepareForCommit() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },

  resetAfterCommit(container) {
    container.updateMessage(container.currentTree.clone()).catch(console.error)
  },

  finalizeInitialChildren() {
    return false
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
