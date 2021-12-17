/* eslint-disable unicorn/no-null */
import { raise } from "reacord-helpers/raise.js"
import ReactReconciler from "react-reconciler"
import type { ReacordElementMap } from "./elements.js"
import type { ReacordContainer } from "./renderer/container.js"
import { TextElementInstance } from "./renderer/text-element-instance.js"
import { TextInstance } from "./renderer/text-instance.js"

// instances that represent an element
type ElementInstance = TextElementInstance

// any instance
type Instance = ElementInstance | TextInstance

type ElementTag =
  | keyof ReacordElementMap
  | (string & { __autocompleteHack__?: never })

type Props = Record<string, unknown>

const createInstance = (
  type: ElementTag,
  props: Props,
): TextElementInstance => {
  if (type === "reacord-text") {
    return new TextElementInstance()
  }
  raise(`Unknown element type "${type}"`)
}

export const reconciler = ReactReconciler<
  ElementTag, // Type,
  Props, // Props,
  ReacordContainer, // Container,
  ElementInstance, // Instance,
  TextInstance, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  null, // HostContext,
  never, // UpdatePayload,
  Instance[], // ChildSet,
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

  createTextInstance: (text) => new TextInstance(text),

  createContainerChildSet: () => [],

  appendChildToContainerChildSet: (childSet: Instance[], child: Instance) => {
    childSet.push(child)
  },

  finalizeContainerChildren: (
    container: ReacordContainer,
    children: Instance[],
  ) => false,

  replaceContainerChildren: (
    container: ReacordContainer,
    children: Instance[],
  ) => {
    container.render(children)
  },

  appendInitialChild: (parent, child) => {
    parent.add(child)
  },

  cloneInstance: (
    instance: Instance,
    _: unknown,
    type: ElementTag,
    oldProps: Props,
    newProps: Props,
  ) => createInstance(type, newProps),

  finalizeInitialChildren: () => false,
  prepareForCommit: (container) => null,
  resetAfterCommit: () => null,
  prepareUpdate: () => null,
  getPublicInstance: () => raise("Not implemented"),
  preparePortalMount: () => raise("Not implemented"),
})
