# @parker/fastify-utils

The shared Fastify app shell for Parker's backend services. Every backend's `main.ts` builds its app through
here, so cross-cutting concerns — logging, correlation ids, error mapping, CORS, auth — are defined once.

## Building an app

`FastifyAppBuilder.build` assembles the standard app. The plugin registration order matters and is fixed:

1. `correlationIdPlugin`
2. `httpLoggingPlugin`
3. `@fastify/formbody`
4. `@fastify/cors` — only if `websiteDomain` is set
5. the SuperTokens Fastify plugin
6. `parkerErrorHandler` as the app's error handler — deliberately installed _after_ SuperTokens, to override the
   one its plugin installs
7. your `registerRoutes(app)` callback
8. a not-found handler returning an `EndpointNotFoundError` DTO

```ts
import {
  FastifyAppBuilder,
  initMicroserviceSuperTokens,
  requireSession,
  tsRestPluginOptions,
} from '@parker/fastify-utils'

// SuperTokens must be initialised BEFORE build() — build() calls supertokens.getAllCORSHeaders()
initMicroserviceSuperTokens({ apiDomain, websiteDomain, connectionUri, apiKey })

const app = await FastifyAppBuilder.build({
  websiteDomain: config.websiteDomain,
  registerRoutes: async (instance) => {
    // Blanket auth for this service's path prefix — the equivalent of the old per-endpoint guard
    instance.addHook('preHandler', async (request, reply) => {
      if (request.url.startsWith('/parking/')) {
        await requireSession(request, reply)
      }
    })
    await registerParkingSpotRoutes(instance, { parkingSpotRepository })
  },
})

await app.listen({ port: config.port, host: '0.0.0.0' })
```

There's no DI container — each `main.ts` constructs its dependencies by hand and passes them into route
registration functions, which is also what lets tests build an app with fakes injected.

## What's exported

### App construction

- `FastifyAppBuilder` — the class above; one static `build(options)`. Creates Fastify with `logger: false` (we do
  our own logging) and `ignoreTrailingSlash: true`.
- `FastifyAppBuilderOptions` — `{ websiteDomain?: string; registerRoutes: (app) => Promise<void> | void }`.

### Plugins

- `correlationIdPlugin` — reads an inbound `x-correlation-id` or generates a UUID, puts it on
  `request.correlationId`, echoes it back as a response header, and pushes it into `CorrelationIdPropagator` so
  every log line in that request carries it automatically.
- `httpLoggingPlugin` — logs one `Request completed` line per request with method, url, status, remote address,
  user agent and duration. Response bodies are logged only for `>= 400` (truncated at 2000 chars). Log level is
  chosen by status: `OPTIONS` → debug, `>= 500` → error, `>= 400` → warn, else info.
- `supertokensFastify` — registers SuperTokens' own Fastify plugin and error handler.
- `supertokens` — a re-export of `supertokens-node`'s default export, so consumers don't need a direct dep.

### Error handling

- `parkerErrorHandler` — the app-wide error handler. Delegates `SuperTokensError` to SuperTokens (needed to keep
  the refresh flow's status codes and headers intact), and otherwise maps to a `ServerError` and replies with
  `serverError.toDto()`. Mapping:
  - our own errors → passed through as-is
  - `@ts-rest/fastify` request validation errors → `InputValidationError` (400), with
    `pathParamErrors`/`bodyErrors`/`queryErrors` in the metadata
  - `@ts-rest/core` response validation errors → `ResponseValidationError`
  - Fastify schema errors (`error.validation`) → `InputValidationError`
  - anything else → `UnknownError` (500)
- `tsRestPluginOptions` — the options every service passes when registering a ts-rest router. Turns on
  `responseValidation` and routes ts-rest validation failures into `parkerErrorHandler`:
  ```ts
  await app.register(s.plugin(router), tsRestPluginOptions)
  ```

### Auth

Augments `FastifyRequest` with an optional `session`.

- `requireSession(request, reply)` — verifies the SuperTokens session and sets `request.session`. Uses
  `Session.getSession` rather than SuperTokens' `verifySession` helper, so _our_ 401 DTO is what goes out.
- `getSessionUserId(request)` — the session's user id, throwing `UnauthorizedError` if there's no session.
- `mockAuth()` / `unmockAuth()` — **test-only** (guarded by `assertTestOnly`). Makes `requireSession` synthesize
  a session from a header instead of calling SuperTokens.
- `buildTestAuthHeaders(userId)` — **test-only**; builds the headers that mocked `requireSession` reads.

### SuperTokens init

Both presets set `framework: 'fastify'`, `appName: 'Parker'`, and enable SuperTokens' verbose logging when
`LOG_LEVEL` is `debug`/`trace`. Neither sets `getTokenTransferMethod`, so the default `'any'` applies (cookie
_and_ header sessions both work).

- `SuperTokensConfig` — `{ apiDomain, websiteDomain, connectionUri, apiKey? }`.
- `initLoginServiceSuperTokens(config)` — for the service that owns login/signup: `[EmailPassword.init(), Session.init()]`. Used by `backends/user`.
- `initMicroserviceSuperTokens(config)` — for services that only guard endpoints: `[Session.init()]`. Used by `backends/parking` and `backends/places`.

### Controller helpers

Free-function replacements for what used to be base-class methods:

- `buildEntityNotFoundError(entityName)` — a standard `"<Entity> not found"` `NotFoundError`.
- `getEntityOrNotFound(maybeValue, entityName)` — returns the value, or throws the above.
