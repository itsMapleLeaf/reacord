---
title: useInstance
description: Using useInstance to get the current instance within a component
slug: use-instance
---

# useInstance

You can use `useInstance` to get the current [instance](/guides/sending-messages) within a component. This can be used to let a component destroy or deactivate itself.

```jsx
import { Button, useInstance } from "reacord"

function SelfDestruct() {
  const instance = useInstance()
  return (
    <Button
      style="danger"
      label="delete this"
      onClick={() => instance.destroy()}
    />
  )
}

reacord.send(channelId, <SelfDestruct />)
```
