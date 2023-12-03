import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NestAppBuilder } from '@parker/nest-utils'
import { AuthModule, SuperTokensExceptionFilter } from '../auth'
import { config } from '../config'
import { ParkingSpotModule } from '../domain/parkingSpot'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [ParkingSpotModule, AuthModule.forRoot(config.auth)],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  app.useGlobalFilters(new SuperTokensExceptionFilter())
  await app.init()
  return app
}
