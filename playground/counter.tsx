import * as React from "react"
import { Button } from "../src.new/components/button.js"

export function Counter() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      this button was clicked {count} times
      <Button label="clicc" onClick={() => setCount(count + 1)} />
    </>
  )
}
