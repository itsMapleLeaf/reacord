# reacord

## 0.6.0

### Minor Changes

- 11153df: breaking: more descriptive component event types
- fb0a997: add new descriptive adapter methods

  The reacord instance names have been updated, and the old names are now deprecated.

  - `send` -> `createChannelMessage`
  - `reply` -> `createInteractionReply`

  These new methods also accept discord JS options. Usage example:

  ```ts
  // can accept either a channel object or a channel ID
  reacord.createChannelMessage(channel)
  reacord.createChannelMessage(channel, {
  	tts: true,
  })
  reacord.createChannelMessage(channel, {
  	reply: {
  		messageReference: "123456789012345678",
  		failIfNotExists: false,
  	},
  })

  reacord.createInteractionReply(interaction)
  reacord.createInteractionReply(interaction, {
  	ephemeral: true,
  })
  ```

  These new methods replace the old ones, which are now deprecated.

## 0.5.5

### Patch Changes

- ced48a3: distribute d.ts files again instead of the source

  distributing the source causes typecheck errors when the modules it imports from (in this case, `@reacord/helpers`) don't exist in the end users' projects, so we'll just distribute d.ts files instead like normal. failed experiment :(

## 0.5.4

### Patch Changes

- 41c87e3: fix type definitions

  `"types"` wasn't updated, oops!

  technically the typedefs were already correctly defined via `"exports"`, but this may not be picked up depending on the tsconfig, so I'll ensure both are used for compatibility purposes. but this might be worth a note in the docs; pretty much every modern TS Node project should be using a tsconfig that doesn't require setting `"types"`

## 0.5.3

### Patch Changes

- 104b175: ensure message is edited from arbitrary component updates
- 156cf90: fix interaction handling
- 0bab505: fix DJS deprecation warning on isStringSelectMenu
- d76f316: ensure action rows handle child interactions

## 0.5.2

### Patch Changes

- 9813a01: import react-reconciler/constants.js for esm

  ESM projects which tried to import reacord would fail due to the lack of .js on this import

## 0.5.1

### Patch Changes

- 72f4a4a: upgrade dependencies and remove some unneeded
- 7536bde: add types in exports to work with TS nodenext
- e335165: fix links

## 0.5.0

### Minor Changes

- aa65da5: allow JSX in more places
