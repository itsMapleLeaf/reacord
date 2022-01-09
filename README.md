# reacord

Create interactive Discord messages using React! [Visit the docs to get started.](https://reacord.fly.dev/guides/getting-started)

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

![Counter demo](./reacord-counter-demo.gif)
