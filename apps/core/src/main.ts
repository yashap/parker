import { INestApplication, Type, ValidationPipe, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@parker/logging'
import { logContextMiddleware, NestLogger } from '@parker/nest-utils'
import { BaseRepository } from './db/BaseRepository'
import { ParkingSpotRepository, ParkingSpotModule } from './domain/parkingSpot'
import { UserRepository, UserModule } from './domain/user'

@Module({
  imports: [ParkingSpotModule, UserModule],
})
class AppModule {}

// See: https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
const registerDbShutdownHooks = async (app: INestApplication): Promise<void> => {
  const allRepositories: Array<Type<BaseRepository>> = [ParkingSpotRepository, UserRepository]
  for (const repository of allRepositories) {
    const repositoryInstance = app.get(repository)
    await repositoryInstance.enableShutdownHooks(app)
  }
}

const bootstrap = async (serviceName: string): Promise<void> => {
  const app = await NestFactory.create(AppModule, {
    logger: new NestLogger(),
  })
  app.setGlobalPrefix(serviceName)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )
  app.use(logContextMiddleware)
  await registerDbShutdownHooks(app)
  const port = process.env['PORT'] ?? 3333
  await app.listen(port)
  new Logger('main').info(`🚀 ${serviceName} listening for requests`, { metadata: { port } })
}

bootstrap('core')
