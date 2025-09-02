// Important to import dotenv as early as possible
/* eslint-disable import/order */
import * as dotenv from 'dotenv'
dotenv.config()

import { Module } from '@nestjs/common'
import { LoginServiceAuthModule, NestAppBuilder, NestAppRunner } from '@parker/nest-utils'
import { config } from 'src/config'
import { Logger } from '@parker/logging'

@Module({
  imports: [LoginServiceAuthModule.forRoot(config.auth)],
})
class AppModule {}

const bootstrap = async (port: number): Promise<void> => {
  const app = await NestAppBuilder.build(AppModule, config.auth.websiteDomain)
  await NestAppRunner.run(app, port)
}

bootstrap(config.port).catch((error: unknown) => {
  new Logger('Bootstrap').error('Failed to bootstrap', { error })
  throw error
})
