// Important to import dotenv as early as possible
/* eslint-disable import/order */
import * as dotenv from 'dotenv'
dotenv.config()

import { Module } from '@nestjs/common'
import { MicroserviceAuthModule, NestAppBuilder, NestAppRunner, SuperTokensExceptionFilter } from '@parker/nest-utils'
import supertokens from 'supertokens-node'
import { config } from 'src/config'
import { PlaceSuggestionsModule } from 'src/domain/placeSuggestions'
import { Logger } from '@parker/logging'

@Module({
  imports: [PlaceSuggestionsModule, MicroserviceAuthModule.forRoot(config.auth)],
})
class AppModule {}

const bootstrap = async (port: number): Promise<void> => {
  const app = await NestAppBuilder.build(AppModule)
  // TODO: probably this CORS stuff is only necessary once this api starts being called by browsers?
  app.enableCors({
    origin: ['http://localhost:3000'], // TODO: URL of the website domain
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
  app.useGlobalFilters(new SuperTokensExceptionFilter())
  await NestAppRunner.run(app, port)
}

bootstrap(config.port).catch((error: unknown) => {
  new Logger('Bootstrap').error('Failed to bootstrap', { error })
  throw error
})
