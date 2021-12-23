import * as React from "react"
import { Button } from "../src/main.js"

export function Counter() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      this button was clicked {count} times
      <Button onClick={() => setCount(count + 1)}>clicc</Button>
    </>
  )
}
