<!-- prettier-ignore -->
```tsx
import * as React from "react"
import { Embed, Button } from "reacord"

function Counter() {
  const [count, setCount] = React.useState(0)
  return (
    <>
      <Embed title="Counter">
        This button has been clicked {count} times.
      </Embed>
      <Button onClick={() => setCount(count + 1)}>
        +1
      </Button>
    </>
  )
}
```
