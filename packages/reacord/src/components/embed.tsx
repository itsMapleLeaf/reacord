import type { ColorResolvable, MessageEmbedOptions } from "discord.js"
import { raise } from "reacord-helpers/raise"
import type { ReactNode } from "react"
import * as React from "react"

export type EmbedProps = {
  color?: ColorResolvable
  children?: ReactNode
}

export function Embed(props: EmbedProps) {
  const [instance] = React.useState(() => new EmbedInstance())
  return (
    <reacord-element
      modifyOptions={(options) => ({
        ...options,
        embeds: [
          ...(options.embeds || []),
          {
            color: props.color,
            description: props.children,
          },
        ],
      })}
    />
  )
}

export type EmbedTitleProps = {
  children?: string
  url?: string
}

export function EmbedTitle(props: EmbedTitleProps) {
  const { useEmbedChild } = useEmbedContext()

  useEmbedChild(
    React.useCallback(
      (options) => {
        options.title = props.children
        options.url = props.url
      },
      [props.children, props.url],
    ),
  )

  return <></>
}

function useEmbedContext() {
  const instance =
    React.useContext(EmbedInstanceContext) ??
    raise("Embed instance provider not found")

  return React.useMemo(() => {
    function useEmbedChild(
      modifyEmbedOptions: (options: MessageEmbedOptions) => void,
    ) {
      React.useEffect(() => {
        instance.add(modifyEmbedOptions)
        return () => instance.remove(modifyEmbedOptions)
      }, [modifyEmbedOptions])
    }

    return { useEmbedChild }
  }, [instance])
}

const EmbedInstanceContext = React.createContext<EmbedInstance | undefined>(
  undefined,
)

function EmbedInstanceProvider({
  instance,
  children,
}: {
  instance: EmbedInstance
  children: ReactNode
}) {
  return (
    <EmbedInstanceContext.Provider value={instance}>
      {children}
    </EmbedInstanceContext.Provider>
  )
}

class EmbedInstance {
  private children = new Set<EmbedChild>()

  add(child: EmbedChild) {
    this.children.add(child)
  }

  remove(child: EmbedChild) {
    this.children.delete(child)
  }

  getEmbedOptions(): MessageEmbedOptions {
    const options: MessageEmbedOptions = {}
    for (const child of this.children) {
      child(options)
    }
    return options
  }
}

type EmbedChild = (options: MessageEmbedOptions) => void
