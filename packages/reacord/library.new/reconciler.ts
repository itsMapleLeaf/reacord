import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import type { Container } from "./container"
import type { Node, TextNode } from "./node"
import { makeNode, NodeRef } from "./node"

export const reconciler = ReactReconciler<
  string, // Type
  { node?: unknown }, // Props
  { nodes: Container<Node>; render: () => void }, // Container
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
    return NodeRef.unwrap(props.node)
  },

  createTextInstance(text) {
    return makeNode("text", { text })
  },

  appendInitialChild(parent, child) {
    parent.children?.add(child)
  },

  appendChild(parent, child) {
    parent.children?.add(child)
  },

  appendChildToContainer(container, child) {
    container.nodes.add(child)
  },

  insertBefore(parent, child, beforeChild) {
    parent.children?.insertBefore(child, beforeChild)
  },

  insertInContainerBefore(container, child, beforeChild) {
    container.nodes.insertBefore(child, beforeChild)
  },

  removeChild(parent, child) {
    parent.children?.remove(child)
  },

  removeChildFromContainer(container, child) {
    container.nodes.remove(child)
  },

  clearContainer(container) {
    container.nodes.clear()
  },

  commitTextUpdate(node, oldText, newText) {
    node.props.text = newText
  },

  commitUpdate(node, updatePayload, type, prevProps, nextProps) {
    node.props = NodeRef.unwrap(nextProps.node).props
  },

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
