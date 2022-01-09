import React, { useState } from "react"
import { Button, Option, Select } from "../library/main"

export function FruitSelect({
  onConfirm,
}: {
  onConfirm: (choice: string) => void
}) {
  const [value, setValue] = useState<string>()

  return (
    <>
      <Select
        placeholder="choose a fruit"
        value={value}
        onChangeValue={setValue}
      >
        <Option value="🍎" />
        <Option value="🍌" />
        <Option value="🍒" />
      </Select>
      <Button
        label="confirm"
        disabled={value == undefined}
        onClick={() => {
          if (value) onConfirm(value)
        }}
      />
    </>
  )
}
