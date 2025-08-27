import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NestAppBuilder, SuperTokensExceptionFilter } from '@parker/nest-utils'
import { AuthModule } from 'src/auth'
import { config } from 'src/config'

export const buildTestApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AuthModule.forRoot(config.auth)],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  app.useGlobalFilters(new SuperTokensExceptionFilter())
  await app.init()
  return app
}
