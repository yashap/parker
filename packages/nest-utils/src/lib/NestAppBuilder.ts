import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { HttpExceptionFilter } from './HttpExceptionFilter'
import { HttpLoggingInterceptor } from './HttpLoggingInterceptor'
import { logContextMiddleware } from './logContextMiddleware'
import { NestLogger } from './NestLogger'

export class NestAppBuilder {
  public static async build(serviceName: string, appModule: unknown): Promise<INestApplication> {
    const app = await NestFactory.create(appModule, {
      logger: new NestLogger(),
    })
    app.setGlobalPrefix(serviceName)
    app.use(logContextMiddleware)
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      })
    )
    const httpAdapter = app.getHttpAdapter()
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter))
    app.useGlobalInterceptors(new HttpLoggingInterceptor(httpAdapter))
    return app
  }
}
