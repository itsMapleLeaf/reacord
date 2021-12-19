import { BaseInstance } from "./base-instance.js"

// eslint-disable-next-line import/no-unused-modules
export type ContainerInstanceOptions = {
  /**
   * Whether or not to log a warning when calling getChildrenText() with non-text children
   *
   * Regardless of what this is set to, non-text children will always be skipped */
  warnOnNonTextChildren: boolean
}

export abstract class ContainerInstance extends BaseInstance {
  readonly children: BaseInstance[] = []

  constructor(private readonly options: ContainerInstanceOptions) {
    super()
  }

  add(child: BaseInstance) {
    this.children.push(child)
  }

  clear() {
    this.children.splice(0)
  }

  protected getChildrenText(): string {
    let text = ""
    for (const child of this.children) {
      if (!child.getText) {
        if (this.options.warnOnNonTextChildren) {
          console.warn(`${child.name} is not a valid child of ${this.name}`)
        }
        continue
      }
      text += child.getText()
    }
    return text
  }
}
