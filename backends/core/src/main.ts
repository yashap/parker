// Important to import dotenv as early as possible
// eslint-disable-next-line import/order
import * as dotenv from 'dotenv'
dotenv.config()

import { Module } from '@nestjs/common'
import { NestAppBuilder, NestAppRunner } from '@parker/nest-utils'
import supertokens from 'supertokens-node'
import { AuthModule, SuperTokensExceptionFilter } from './auth'
import { config } from './config'
import { ParkingSpotModule } from './domain/parkingSpot'

@Module({
  imports: [ParkingSpotModule, AuthModule.forRoot(config.auth)],
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

bootstrap(config.port)
