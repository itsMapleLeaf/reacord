---
order: 1
meta:
  title: Sending Messages
  description: Sending messages by creating Reacord instances
---

# Sending Messages with Instances

You can send messages via Reacord to a channel like so.

<details>
  <summary>In case you're unaware, click here to see how to get a channel ID.</summary>

1. Enable "Developer Mode" in your Discord client settings.
   ![Enabling developer mode](/images/developer-mode.png)
1. Right click any channel, and select "Copy ID".
![Copying the channel ID](/images/copy-channel-id.png)
</details>

```jsx
const channelId = "abc123deadbeef"

client.on("ready", () => {
  reacord.send(channelId, "Hello, world!")
})
```

The `.send()` function creates a **Reacord instance**. You can pass strings, numbers, or anything that can be rendered by React, such as JSX!

Components rendered through this instance can include state and effects, and the message on Discord will update automatically.

```jsx
function Uptime() {
  const [startTime] = useState(Date.now())
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      currentTime(Date.now())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return <>this message has been shown for {currentTime - startTime}ms</>
}

client.on("ready", () => {
  reacord.send(channelId, <Uptime />)
})
```

The instance can be rendered to multiple times, which will update the message each time.

```jsx
const Hello = ({ subject }) => <>Hello, {subject}!</>

client.on("ready", () => {
  const instance = reacord.send(channel)
  instance.render(<Hello subject="World" />)
  instance.render(<Hello subject="Moon" />)
})
```

## Cleaning Up Instances

If you no longer want to use the instance, you can clean it up in a few ways:

- `instance.destroy()` - This will remove the message.
- `instance.deactivate()` - This will keep the message, but it will disable the components on the message, and no longer listen to user interactions.

By default, Reacord has a max limit on the number of active instances, and deactivates older instances to conserve memory. This can be configured through the Reacord options:

```js
const reacord = new ReacordDiscordJs(client, {
  // after sending four messages,
  // the first one will be deactivated
  maxInstances: 3,
})
```

## Discord Slash Commands

<aside className="opacity-75 italic">
This section also applies to other kinds of application commands, such as context menu commands.
</aside>

todo
