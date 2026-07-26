# @parker/core

Core utilities — very basic, general purpose functionality. Currently just one function.

## `assertTestOnly`

Throws unless `NODE_ENV === 'test'`. Use it to guard helpers that must never run in a real environment, e.g. the
`mockAuth()` bypass in `@parker/fastify-utils`:

```ts
import { assertTestOnly } from '@parker/core'

export const mockAuth = (): void => {
  assertTestOnly('mockAuth')
  // ...
}
```

> This replaces the old `@TestOnly` decorator, which went away when we dropped decorator-based services. A plain
> function call works everywhere and needs no decorator metadata.
