# @parker/test-utils

Shared test helpers. `vitest` is a peer dependency — this package imports `expect` from it.

## `addTemporalEqualityTesters`

Registers custom Vitest equality testers for [Temporal](https://tc39.es/proposal-temporal/docs/) types, so
`toEqual` compares them by value instead of by structure. Without it, two `Temporal.Instant`s representing the
same moment don't compare equal.

Covers `Instant`, `PlainTime`, `ZonedDateTime`, `PlainDate`, `PlainDateTime`, `PlainYearMonth`, `PlainMonthDay`
and `Duration`.

Call it once from a workspace's vitest setup file:

```ts
// src/test/setup.ts
import { addTemporalEqualityTesters } from '@parker/test-utils'

addTemporalEqualityTesters()
```

...and point `vitest.config.ts` at it via `setupFiles`.

Note this is why every workspace's `vitest.config.ts` sets `resolve.conditions` to include `development`:
resolving this package to its TS source wires its `expect` import to the _running_ vitest worker, and vitest
refuses to be `require()`d from a pre-compiled module.
