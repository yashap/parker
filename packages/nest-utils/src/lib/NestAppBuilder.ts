import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { HttpExceptionFilter } from './HttpExceptionFilter'
import { HttpLoggingInterceptor } from './HttpLoggingInterceptor'
import { logContextMiddleware } from './logContextMiddleware'
import { NestLogger } from './NestLogger'

export class NestAppBuilder {
  public static async build(appModule: unknown): Promise<INestApplication> {
    const app = await NestFactory.create(appModule, {
      logger: new NestLogger(),
    })
    this.addMiddleware(app)
    return app
  }

  public static addMiddleware(app: INestApplication): void {
    app.use(logContextMiddleware)
    const httpAdapter = app.getHttpAdapter()
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter))
    app.useGlobalInterceptors(new HttpLoggingInterceptor(httpAdapter))
  }
}
