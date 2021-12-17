/* eslint-disable unicorn/no-null */

import { raise } from "reacord-helpers/raise.js"
import ReactReconciler from "react-reconciler"
import type { ReacordElementMap } from "./elements.js"
import type { ReacordContainer } from "./renderer/container.js"
import { TextElementInstance } from "./renderer/text-element-instance.js"
import { TextInstance } from "./renderer/text-instance.js"

export const reconciler = ReactReconciler<
  keyof ReacordElementMap | (string & { __autocompleteHack__?: never }), // Type,
  Record<string, unknown>, // Props,
  ReacordContainer, // Container,
  TextElementInstance, // Instance,
  TextInstance, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  null, // HostContext,
  never, // UpdatePayload,
  never, // ChildSet,
  unknown, // TimeoutHandle,
  unknown // NoTimeout
>({
  now: Date.now,
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  getRootHostContext: () => null,
  getChildHostContext: (parentContext) => parentContext,
  shouldSetTextContent: () => false,

  createInstance: (type, props) => {
    if (type === "reacord-text") {
      return new TextElementInstance()
    }
    raise(`Unknown element type "${type}"`)
  },

  createTextInstance: (text) => {
    return new TextInstance(text)
  },

  clearContainer: (container) => {
    container.clear()
  },

  appendChildToContainer: (container, child) => {
    container.add(child)
  },

  removeChildFromContainer: (container, child) => {
    container.remove(child)
  },

  appendInitialChild: (parent, child) => {
    parent.add(child)
  },

  removeChild: (parent, child) => {
    parent.remove(child)
  },

  finalizeInitialChildren: () => false,
  prepareForCommit: (container) => null,
  resetAfterCommit: () => null,
  prepareUpdate: () => null,

  getPublicInstance: () => raise("Not implemented"),
  preparePortalMount: () => raise("Not implemented"),
})
