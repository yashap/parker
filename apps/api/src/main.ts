import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )
  const port = process.env['PORT'] ?? 3333
  await app.listen(port)
  Logger.log(`🚀 api is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
