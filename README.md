<center>
  <img src="./assets/Banner.png" alt="Reacord: Create interactive Discord messages using React">
</center>

## Installation

```console
# npm
npm install reacord react discord.js

# yarn
yarn add reacord react discord.js

# pnpm
pnpm add reacord react discord.js

```

## Get Started

[Visit the docs to get started.](https://reacord.fly.dev/guides/getting-started)

## Example

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
