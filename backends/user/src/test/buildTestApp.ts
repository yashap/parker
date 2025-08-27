import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { LoginServiceAuthModule, NestAppBuilder, SuperTokensExceptionFilter } from '@parker/nest-utils'
import { config } from 'src/config'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [LoginServiceAuthModule.forRoot(config.auth)],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  app.useGlobalFilters(new SuperTokensExceptionFilter())
  await app.init()
  return app
}
