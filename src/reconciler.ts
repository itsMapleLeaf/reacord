/* eslint-disable unicorn/no-null */
import ReactReconciler from "react-reconciler"
import type { ReacordContainer } from "./container.js"
import { ReacordInstance } from "./instance.js"

export const reconciler = ReactReconciler<
  unknown,
  Record<string, unknown>,
  ReacordContainer,
  ReacordInstance,
  ReacordInstance,
  unknown,
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
})
