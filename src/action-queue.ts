export type Action = {
  id: string
  priority: number
  run: () => unknown
}

export class ActionQueue {
  private actions: Action[] = []
  private runningPromise?: Promise<void>

  add(action: Action) {
    const lastAction = this.actions[this.actions.length - 1]
    if (lastAction?.id === action.id) {
      this.actions[this.actions.length - 1] = action
    } else {
      this.actions.push(action)
    }

    this.actions.sort((a, b) => a.priority - b.priority)

    this.runActions()
  }

  clear() {
    this.actions = []
  }

  done() {
    return this.runningPromise ?? Promise.resolve()
  }

  private runActions() {
    if (this.runningPromise) return

    this.runningPromise = new Promise((resolve) => {
      // using a microtask to allow multiple actions to be added synchronously
      queueMicrotask(async () => {
        let action: Action | undefined
        while ((action = this.actions.shift())) {
          try {
            await action.run()
          } catch (error) {
            console.error(`Failed to run action:`, action)
            console.error(error)
          }
        }
        resolve()
        this.runningPromise = undefined
      })
    })
  }
}
