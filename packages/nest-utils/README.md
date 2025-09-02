# @parker/nest-utils

Utilities for NestJS apps.

## Example Usage

```ts
import { Module } from '@nestjs/common'
import { NestAppBuilder, NestAppRunner } from '@parker/nest-utils'

// Create a root NestJS module
@Module({
  imports: [...], // All the NestJS modules for your app
})
class AppModule {}

const serviceName: string = ...
const port: number = ...
const webUrl: string = ... // For CORS, to allow requests from the website

const app = await NestAppBuilder.build(AppModule, webUrl)
await NestAppRunner.run(app, port)
```
