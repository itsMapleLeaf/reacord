/* eslint-disable unicorn/no-null */
import { inspect } from "node:util"
import ReactReconciler from "react-reconciler"
import type { ChannelRenderer } from "./channel-renderer.js"
import { raise } from "./helpers/raise.js"
import type { MessageNode, Node, TextNode } from "./node.js"

type ElementTag = string

type Props = Record<string, unknown>

const createInstance = (type: string, props: Props): Node => {
  if (type !== "reacord-element") {
    raise(`createInstance: unknown type: ${type}`)
  }

  if (typeof props.createNode !== "function") {
    const actual = inspect(props.createNode)
    raise(`invalid createNode function, received: ${actual}`)
  }

  return props.createNode()
}

type ChildSet = MessageNode

export const reconciler = ReactReconciler<
  string, // Type (jsx tag),
  Props, // Props,
  ChannelRenderer, // Container,
  Node, // Instance,
  TextNode, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  null, // HostContext,
  [], // UpdatePayload,
  ChildSet, // ChildSet,
  unknown, // TimeoutHandle,
  unknown // NoTimeout
>({
  now: Date.now,
  isPrimaryRenderer: true,
  supportsMutation: false,
  supportsPersistence: true,
  supportsHydration: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  getRootHostContext: () => null,
  getChildHostContext: (parentContext) => parentContext,
  shouldSetTextContent: () => false,

  createInstance,

  createTextInstance: (text) => ({ type: "text", text }),

  createContainerChildSet: (): ChildSet => ({
    type: "message",
    children: [],
  }),

  appendChildToContainerChildSet: (childSet: ChildSet, child: Node) => {
    childSet.children.push(child)
  },

  finalizeContainerChildren: (container: ChannelRenderer, children: ChildSet) =>
    false,

  replaceContainerChildren: (
    container: ChannelRenderer,
    children: ChildSet,
  ) => {
    container.render(children)
  },

  appendInitialChild: (parent, child) => {
    if ("children" in parent) {
      parent.children.push(child)
    } else {
      raise(`${parent.type} cannot have children`)
    }
  },

  cloneInstance: (
    instance: Node,
    _: unknown,
    type: ElementTag,
    oldProps: Props,
    newProps: Props,
  ) => {
    const newInstance = createInstance(type, newProps)

    // instance children don't get carried over, so we need to copy them
    if ("children" in instance && "children" in newInstance) {
      newInstance.children = instance.children
    }

    return newInstance
  },

  // returning a non-null value tells react to re-render the whole thing
  // on any prop change
  //
  // we can probably optimize this to actually compare old/new props though
  prepareUpdate: () => [],

  finalizeInitialChildren: () => false,
  prepareForCommit: (container) => null,
  resetAfterCommit: () => null,
  getPublicInstance: () => raise("Not implemented"),
  preparePortalMount: () => raise("Not implemented"),
})
