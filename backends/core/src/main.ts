import { INestApplication, Type, Module } from '@nestjs/common'
import { NestAppBuilder, NestAppRunner } from '@parker/nest-utils'
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

const bootstrap = async (serviceName: string, port: number): Promise<void> => {
  const app = await NestAppBuilder.build(serviceName, AppModule)
  await registerDbShutdownHooks(app)
  await NestAppRunner.run(app, serviceName, port)
}

bootstrap('core', Number(process.env['PORT'] ?? 3333))
