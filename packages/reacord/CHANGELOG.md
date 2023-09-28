# reacord

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
