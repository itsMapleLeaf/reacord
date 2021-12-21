/* eslint-disable unicorn/no-null */
import { inspect } from "node:util"
import ReactReconciler from "react-reconciler"
import { BaseInstance } from "./base-instance.js"
import { ContainerInstance } from "./container-instance.js"
import type { ReacordContainer } from "./container.js"
import { raise } from "./helpers/raise.js"
import { TextInstance } from "./text-instance.js"

type ElementTag = string

type Props = Record<string, unknown>

const createInstance = (type: string, props: Props): BaseInstance => {
  if (type !== "reacord-element") {
    raise(`createInstance: unknown type: ${type}`)
  }

  if (typeof props.createInstance !== "function") {
    const actual = inspect(props.createInstance)
    raise(`invalid createInstance function, received: ${actual}`)
  }

  const instance = props.createInstance()
  if (!(instance instanceof BaseInstance)) {
    raise(`invalid instance: ${inspect(instance)}`)
  }

  return instance
}

export const reconciler = ReactReconciler<
  string, // Type (jsx tag),
  Props, // Props,
  ReacordContainer, // Container,
  BaseInstance, // Instance,
  TextInstance, // TextInstance,
  never, // SuspenseInstance,
  never, // HydratableInstance,
  never, // PublicInstance,
  null, // HostContext,
  never, // UpdatePayload,
  BaseInstance[], // ChildSet,
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

  appendChildToContainerChildSet: (
    childSet: BaseInstance[],
    child: BaseInstance,
  ) => {
    childSet.push(child)
  },

  finalizeContainerChildren: (
    container: ReacordContainer,
    children: BaseInstance[],
  ) => false,

  replaceContainerChildren: (
    container: ReacordContainer,
    children: BaseInstance[],
  ) => {
    container.render(children)
  },

  appendInitialChild: (parent, child) => {
    if (parent instanceof ContainerInstance) {
      parent.add(child)
    } else {
      raise(
        `Cannot append child of type ${child.constructor.name} to ${parent.constructor.name}`,
      )
    }
  },

  cloneInstance: (
    instance: BaseInstance,
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
