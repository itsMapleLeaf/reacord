/* eslint-disable unicorn/no-null */
import ReactReconciler from "react-reconciler"
import type { ReacordContainer } from "./container.js"
import { raise } from "./helpers/raise.js"
import { ReacordInstance } from "./instance.js"

export const reconciler = ReactReconciler<
  unknown,
  Record<string, unknown>,
  ReacordContainer,
  ReacordInstance,
  ReacordInstance,
  ReacordInstance,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>({
  now: Date.now,
  supportsMutation: true,
  isPrimaryRenderer: true,
  noTimeout: -1,
  supportsHydration: false,
  supportsPersistence: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,

  getRootHostContext: () => ({}),
  getChildHostContext: () => ({}),
  shouldSetTextContent: () => false,

  createInstance: (
    type,
    properties,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle,
  ) => {
    throw new Error("Not implemented")
  },

  createTextInstance: (
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle,
  ) => {
    return new ReacordInstance(text)
  },

  prepareForCommit: () => null,
  resetAfterCommit: () => null,

  clearContainer: (container) => {
    container.clear()
  },
  appendChildToContainer: (container, child) => {
    container.add(child)
  },
  removeChildFromContainer: (container, child) => {
    container.remove(child)
  },

  appendInitialChild: (parent, child) => raise("Not implemented"),
  finalizeInitialChildren: () => raise("Not implemented"),
  getPublicInstance: () => raise("Not implemented"),
  prepareUpdate: () => raise("Not implemented"),
  preparePortalMount: () => raise("Not implemented"),
})
