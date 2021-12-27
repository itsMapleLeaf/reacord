import React from "react"
import { ReacordElement } from "../../internal/element"
import { OptionNode } from "./option-node"

export type OptionProps = {
  label?: string
  children?: string
  value: string
  description?: string
  emoji?: string
}

export function Option(props: OptionProps) {
  return (
    <ReacordElement props={props} createNode={() => new OptionNode(props)} />
  )
}
