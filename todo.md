# core features

- [x] render to channel
- [x] render to interaction
- [x] ephemeral messages
- [x] message content
- embed
  - [x] color
  - [x] author
  - [x] description
  - [x] title - text children, url
  - [x] footer - icon url, timestamp, text children
  - [x] thumbnail - url
  - [x] image - url
  - [x] fields - name, value, inline
  - [x] test
- message components
  - [x] buttons
  - [x] links
  - [x] select
  - [x] select onChange
  - [x] action row
  - [x] button onClick
  - component events
    - [x] reply / send functions
    - [x] select values
    - [ ] message.\*
    - [ ] channel.\*
    - [ ] guild.\*
    - [ ] guild.member.\*
    - [ ] user.\*
- [x] deactivate
- [x] destroy
- [ ] docs

# internal

- [ ] combine `MessageOptions` and `Message` into a single message object (?)
- [x] consider always calling `deferUpdate` on component interactions

# cool ideas / polish

- [ ] message property on reacord instance
- [ ] files
- [ ] stickers
- [ ] user mention component
- [ ] channel mention component
- [ ] timestamp component
- [ ] `useMessage`
- [ ] `useReactions`
- [ ] max instance count per guild
- [ ] max instance count per channel
- [ ] uncontrolled select
- [x] single class/helper function for testing `ReacordTester`
- [ ] handle deletion outside of reacord
- [ ] for more easily writing adapters, address discord API nuances at the reacord level instead of the adapter level. the goal being that adapters can just take the objects and send them to discord. probably make use of discord api types for this
- [ ] allow users to specify their own customId for components
  - this could be an easy and intuitive way to make component interactions work over bot restarts... among other interesting things
