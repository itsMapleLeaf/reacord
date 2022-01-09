---
order: 3
title: Buttons
description: Using button components
---

# Buttons

Use the `<Button />` component to create a message with a button, and use the `onClick` callback to respond to button clicks.

```jsx
import { Button } from "reacord"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <>
      You've clicked the button {count} times.
      <Button label="+1" onClick={() => setCount(count + 1)} />
    </>
  )
}
```

The `onClick` callback receives an `event` object. It includes some information, such as the user who clicked the button, and a function for creating new replies in response.

```jsx
import { Button } from "reacord"

function TheButton() {
  return (
    <Button
      label="click me i dare you"
      onClick={(event) => {
        const name = event.guild.member.displayName || event.user.username
        event.reply(`${name} clicked the button. wow`)
        event.ephemeralReply("good job, you clicked it")
      }}
    />
  )
}
```

See the [API reference](/api) for more information.
