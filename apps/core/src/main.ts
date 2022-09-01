import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'
import { ParkingSpotRepository } from './domain/parkingSpot'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'core'
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )
  // TODO: centralize repository stuff
  const parkingSpotRepository = app.get(ParkingSpotRepository)
  await parkingSpotRepository.enableShutdownHooks(app)
  const port = process.env['PORT'] ?? 3333
  await app.listen(port)
  Logger.log(`🚀 core service is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
