// Important to import dotenv as early as possible
// eslint-disable-next-line import/order
import * as dotenv from 'dotenv'
dotenv.config()

import { Module } from '@nestjs/common'
import { NestAppBuilder, NestAppRunner } from '@parker/nest-utils'
import { ParkingSpotModule } from './domain/parkingSpot'
import { UserModule } from './domain/user'

@Module({
  imports: [ParkingSpotModule, UserModule],
})
class AppModule {}

const bootstrap = async (port: number): Promise<void> => {
  const app = await NestAppBuilder.build(AppModule)
  await NestAppRunner.run(app, port)
}

bootstrap(Number(process.env['PORT'] ?? 3501))
