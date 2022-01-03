import type { ComponentPropsWithoutRef } from "react"
import React from "react"
import type { Merge } from "type-fest"

export function Script({
  children,
  ...props
}: Merge<ComponentPropsWithoutRef<"script">, { children: string }>) {
  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{ __html: children }}
      {...props}
    />
  )
}
