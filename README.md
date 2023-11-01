<center>
  <img src="packages/website/src/assets/banner.png" alt="Reacord: Create interactive Discord messages using React">
</center>

## Installation ∙ [![npm](https://img.shields.io/npm/v/reacord?color=blue&style=flat-square)](https://www.npmjs.com/package/reacord)

```console
# npm
npm install reacord react discord.js

# yarn
yarn add reacord react discord.js

# pnpm
pnpm add reacord react discord.js

```

## Get Started

[Visit the docs to get started.](https://reacord.mapleleaf.dev/guides/getting-started)

## Example

<!-- prettier-ignore -->
```tsx
import { useState } from "react"
import { Embed, Button } from "reacord"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Embed title="Counter">
        This button has been clicked {count} times.
      </Embed>
      <Button
        label="+1"
        onClick={() => setCount(count + 1)}
      />
    </>
  )
}
```

![Counter demo](./reacord-counter-demo.gif)
