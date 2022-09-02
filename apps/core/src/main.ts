import { INestApplication, Logger, Type, ValidationPipe, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
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
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(serviceName)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )
  await registerDbShutdownHooks(app)
  const port = process.env['PORT'] ?? 3333
  await app.listen(port)
  Logger.log(`🚀 ${serviceName} service is running on: http://localhost:${port}/${serviceName}`)
}

bootstrap('core')
