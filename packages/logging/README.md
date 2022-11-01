# @parker/logging

A logging library for backend services.

## Usage

```ts
import { Logger, LogContextPropagator }

const logger = new Logger('UserRepository')

try {
  await saveUser(user)
} catch (error) {
  logger.error('Failed to save user', { error, userId: user.id })
  throw error
}

// Or, put data into the "log context", and it will be automatically added to all logs in the callback
// e.g. in the below example, both logs will have the userId
LogContextPropagator.runWithContext({ userId: user.id }, async () => {
  try {
    logger.debug('Attempting to save user')
    await saveUser(user)
  } catch (error) {
    logger.error('Failed to save user', { error })
    throw error
  }
})
```

### Environment Variables

The logger can be configured via environment variables:

- `LOG_LEVEL`
  - What level of logs should be emitted?
  - Allowed values: `error`, `warn`, `info`, `debug`, `trace`
    - For example, if set to `info`, then `error`/`warn`/`info` level logs will be emitted, while `debug`/`trace` will not
  - Default: `info`
- `JSON_LOGS`
  - Should logs be in json format (machine friendly), or "pretty" format (human friendly - colors, indenting, etc.)?
  - Allowed values: `true`, `false`
    - If set to `true`, logs will be in json format, otherwise they'll be pretty printed
  - Default: `false`
