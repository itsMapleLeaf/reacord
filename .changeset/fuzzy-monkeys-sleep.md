---
"reacord": patch
---

fix type definitions

`"types"` wasn't updated, oops!

technically the typedefs were already correctly defined via `"exports"`, but this may not be picked up depending on the tsconfig, so I'll ensure both are used for compatibility purposes. but this might be worth a note in the docs; pretty much every modern TS Node project should be using a tsconfig that doesn't require setting `"types"`
