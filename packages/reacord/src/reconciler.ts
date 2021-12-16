/* eslint-disable unicorn/no-null */
import { raise } from "reacord-helpers/raise.js"
import ReactReconciler from "react-reconciler"
import type { ReacordContainer } from "./container.js"
import type { ReacordElement, ReacordElementJsxTag } from "./element.js"

export const reconciler = ReactReconciler<
  ReacordElementJsxTag,
  ReacordElement,
  ReacordContainer,
  ReacordElement,
  string,
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
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle,
  ) => {
    return props
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
  finalizeInitialChildren: (...args) => {
    console.log("finalizeInitialChildren", args)
    return false
  },
  getPublicInstance: () => raise("Not implemented"),
  prepareUpdate: () => raise("Not implemented"),
  preparePortalMount: () => raise("Not implemented"),

  createContainerChildSet: (): ReacordElement[] => {
    // console.log("createContainerChildSet", [container])
    return []
  },

  appendChildToContainerChildSet: (
    children: ReacordElement[],
    child: ReacordElement,
  ) => {
    // console.log("appendChildToContainerChildSet", [children, child])
    children.push(child)
  },

  finalizeContainerChildren: (
    container: ReacordContainer,
    children: ReacordElement[],
  ) => {
    // console.log("finalizeContainerChildren", [container, children])
    return false
  },

  replaceContainerChildren: (
    container: ReacordContainer,
    children: ReacordElement[],
  ) => {
    console.log("replaceContainerChildren", [container, children])
    container.render(children)
  },
})
