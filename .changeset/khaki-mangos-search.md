---
"reacord": patch
---

distribute d.ts files again instead of the source

distributing the source causes typecheck errors when the modules it imports from (in this case, `@reacord/helpers`) don't exist in the end users' projects, so we'll just distribute d.ts files instead like normal. failed experiment :(
