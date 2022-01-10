---
order: 3
meta:
  title: Links
  description: Using link components
---

# Links

In Discord, links are a type of button, and they work similarly. Clicking on it leads you to the given URL. They only have one style, and can't be listened to for clicks.

```jsx
import { Link } from "reacord"

function AwesomeLinks() {
  return (
    <>
      <Link label="look at this" url="https://google.com" />
      <Link label="wow" url="https://youtube.com/watch?v=dQw4w9WgXcQ" />
    </>
  )
}
```

See the [API reference](/api/index.html#Link) for more information.
