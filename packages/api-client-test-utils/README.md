# @parker/api-client-test-utils

Helpers for testing Parker API clients against a Fastify app.

## `FastifyInjectInstance`

Adapts a `FastifyInstance` to the `ApiAxiosInstance` interface that `@parker/api-client-utils` clients expect, so
you can drive a real API client against a real app **in-process** — via Fastify's `inject()`, with no network
listener and no port to allocate.

```ts
import { FastifyInjectInstance } from '@parker/api-client-test-utils'
import { ParkingClient } from '@parker/parking-client'

const app = await buildApp({ parkingSpotRepository })
const client = new ParkingClient(new FastifyInjectInstance(app, buildTestAuthHeaders(userId)))

const response = await client.parkingSpots.create({ ... })
```

The constructor takes the app and optional default headers applied to every request. Responses with a status
`>= 400` are converted into the corresponding Parker error via `buildServerErrorFromDto`, so tests can assert on
real error types rather than raw status codes.

`fastify` is a peer dependency.

> Previously this package exported a `SupertestInstance` built on `supertest`. That's gone along with the move to
> Fastify — use `FastifyInjectInstance`.
