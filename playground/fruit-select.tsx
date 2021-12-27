import React, { useState } from "react"
import { Button, Option, Select } from "../library/main"

export function FruitSelect() {
  const [value, setValue] = useState<string>()
  const [finalChoice, setFinalChoice] = useState<string>()

  if (finalChoice) {
    return <>you chose {finalChoice}</>
  }

  return (
    <>
      {"_ _"}
      <Select
        placeholder="choose a fruit"
        value={value}
        onSelectValue={setValue}
      >
        <Option value="🍎" />
        <Option value="🍌" />
        <Option value="🍒" />
      </Select>
      <Button
        label="confirm"
        disabled={value == undefined}
        onClick={() => setFinalChoice(value)}
      />
    </>
  )
}
