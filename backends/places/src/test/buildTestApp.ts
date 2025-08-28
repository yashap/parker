import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MicroserviceAuthModule, NestAppBuilder } from '@parker/nest-utils'
import { config } from 'src/config'
import { PlaceSuggestionsModule } from 'src/domain/placeSuggestions'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [PlaceSuggestionsModule, MicroserviceAuthModule.forRoot(config.auth)],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app, undefined)
  await app.init()
  return app
}
