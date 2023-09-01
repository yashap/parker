import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NestAppBuilder } from '@parker/nest-utils'
import { ParkingSpotModule } from '../domain/parkingSpot'
import { UserModule } from '../domain/user'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [UserModule, ParkingSpotModule],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.addDefaultMiddleware(app)
  await app.init()
  return app
}
