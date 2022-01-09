import React from "react"
import { ReacordElement } from "../../internal/element"
import { OptionNode } from "./option-node"

/**
 * @category Select
 */
export type OptionProps = {
  label?: string
  children?: string
  value: string
  description?: string
  emoji?: string
}

/**
 * @category Select
 */
export function Option(props: OptionProps) {
  return (
    <ReacordElement props={props} createNode={() => new OptionNode(props)} />
  )
}
