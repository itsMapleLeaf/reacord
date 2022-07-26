/* eslint-disable unicorn/prefer-modern-dom-apis */
import ReactReconciler from "react-reconciler"
import { DefaultEventPriority } from "react-reconciler/constants"
import type { Node } from "./node"
import type { ReacordHostElementProps } from "./reacord-element"
import { ReacordElementConfig } from "./reacord-element"
import { TextNode } from "./text-node"

// technically elements of any shape can go through the reconciler,
// so I'm typing this as unknown to ensure we validate the props
// before using them
type ReconcilerProps = {
  [_ in keyof ReacordHostElementProps]?: unknown
}

type ReconcilerContainer = {
  root: Node

  // We need to pass in a render callback, so the reconciler can tell us
  // when it's done modifying elements, after which we'll update
  // the message in Discord
  render: (root: Node) => void
}

export const reconciler = ReactReconciler<
  string, // Type
  ReconcilerProps, // Props
  ReconcilerContainer, // Container
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
    return ReacordElementConfig.parse(props.config).create()
  },

  createTextInstance(text) {
    return new TextNode({ text })
  },

  appendInitialChild(parent, child) {
    parent.add(child)
  },

  appendChild(parent, child) {
    parent.add(child)
  },

  appendChildToContainer(container, child) {
    container.root.add(child)
  },

  insertBefore(parent, child, beforeChild) {
    parent.insertBefore(child, beforeChild)
  },

  insertInContainerBefore(container, child, beforeChild) {
    container.root.insertBefore(child, beforeChild)
  },

  removeChild(parent, child) {
    parent.remove(child)
  },

  removeChildFromContainer(container, child) {
    container.root.remove(child)
  },

  clearContainer(container) {
    container.root.clear()
  },

  commitTextUpdate(node, oldText, newText) {
    node.props.text = newText
  },

  commitUpdate(node, updatePayload, type, prevProps, nextProps) {
    node.props = ReacordElementConfig.parse(nextProps.config).props
  },

  prepareForCommit() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },

  resetAfterCommit(container) {
    container.render(container.root.clone())
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
