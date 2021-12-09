/* eslint-disable unicorn/no-null */
import ReactReconciler from "react-reconciler"
import type { ReacordContainer } from "./container.js"
import { raise } from "./helpers/raise.js"

export const reconciler = ReactReconciler<
  unknown,
  Record<string, unknown>,
  ReacordContainer,
  string,
  string,
  string,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>({
  now: Date.now,
  isPrimaryRenderer: true,
  supportsMutation: false,
  supportsPersistence: true,
  supportsHydration: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

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
    return text
  },

  prepareForCommit: () => null,
  resetAfterCommit: () => null,

  appendInitialChild: (parent, child) => raise("Not implemented"),
  finalizeInitialChildren: () => raise("Not implemented"),
  getPublicInstance: () => raise("Not implemented"),
  prepareUpdate: () => raise("Not implemented"),
  preparePortalMount: () => raise("Not implemented"),

  createContainerChildSet: (container: ReacordContainer): string[] => {
    console.log("createContainerChildSet", [container])
    return []
  },

  appendChildToContainerChildSet: (children: string[], child: string) => {
    console.log("appendChildToContainerChildSet", [children, child])
    children.push(child)
  },

  finalizeContainerChildren: (
    container: ReacordContainer,
    children: string[],
  ) => {
    console.log("finalizeContainerChildren", [container, children])
    return false
  },

  replaceContainerChildren: (
    container: ReacordContainer,
    children: string[],
  ) => {
    console.log("replaceContainerChildren", [container, children])
    container.render(children)
  },
})
