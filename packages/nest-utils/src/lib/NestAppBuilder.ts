import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { HttpExceptionFilter } from './HttpExceptionFilter'
import { logContextMiddleware } from './logContextMiddleware'
import { logMiddleware } from './logMiddleware'
import { NestLogger } from './NestLogger'

export class NestAppBuilder {
  public static async build(appModule: unknown): Promise<INestApplication> {
    const app = await NestFactory.create(appModule, {
      logger: new NestLogger(),
    })
    this.addDefaultMiddleware(app)
    return app
  }

  public static addDefaultMiddleware(app: INestApplication): void {
    app.use(logContextMiddleware, logMiddleware)
    const httpAdapter = app.getHttpAdapter()
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter))
  }
}
