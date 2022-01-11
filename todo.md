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
    - [x] message.\*
    - [x] channel.\*
    - [x] guild.\*
    - [x] guild.member.\*
    - [x] user.\*
- [x] deactivate
- [x] destroy
- docs
  - [x] core layout and styling
  - [x] mobile nav: at a breakpoint, remove all desktop navigation and use a drawer w/ a floating menu button on the bottom right
  - [x] automatically generate sidebar links
  - guides
    - [x] getting started / setup
    - instances
      - [x] sending channel messages
      - [x] cleaning up instances
      - [x] sending command replies
    - [x] embeds
    - [x] buttons and links
    - [x] select menus
    - [ ] adapters
  - api reference
    - [x] rendering and making it available

# docs polish

- [x] remove client-side react hydration
- [x] ~~use a small script for the popover menu toggle~~ went with alpine
- [ ] improve accessibility on mobile menu
- [x] adding doc comments to source
- [ ] docs: use literate-ts to typecheck code blocks
- [ ] each page should have a link at the bottom to the previous and next pages
- [ ] anchor links on markdown headings
- [ ] custom UI for api reference

# internal

- [ ] combine `MessageOptions` and `Message` into a single message object (?)
- [x] consider always calling `deferUpdate` on component interactions
- [ ] more unit tests instead of integration tests probably

# cool ideas / polish

- [ ] message property on reacord instance
- [ ] files
- [ ] stickers
- [ ] user mention component
- [ ] channel mention component
- [ ] timestamp component
- [ ] `useMessage`
- [ ] `useReactions`
- [ ] `useInstance` - returns the associated instance, probably replaces `useMessage`
- [ ] max instance count per guild
- [ ] max instance count per channel
- [ ] uncontrolled select
- [x] single class/helper function for testing `ReacordTester`
- [ ] handle deletion outside of reacord
- [ ] for more easily writing adapters, address discord API nuances at the reacord level instead of the adapter level. the goal being that adapters can just take the objects and send them to discord. probably make use of discord api types for this
- [ ] allow users to specify their own customId for components
  - this could be an easy and intuitive way to make component interactions work over bot restarts... among other interesting things
