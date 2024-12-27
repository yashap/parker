import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { HttpExceptionFilter } from 'src/lib/HttpExceptionFilter'
import { logContextMiddleware } from 'src/lib/logContextMiddleware'
import { logMiddleware } from 'src/lib/logMiddleware'
import { NestLogger } from 'src/lib/NestLogger'

export class NestAppBuilder {
  public static async build(appModule: unknown): Promise<INestApplication> {
    const app = await NestFactory.create(appModule, {
      logger: new NestLogger(),
    })
    this.configureApp(app)
    return app
  }

  public static configureApp(app: INestApplication): void {
    /**
     * For an API just serving json, would rather not deal with Etag caching, which is mostly useful for large static
     * assets (images, videos, etc.), not small JSON responses.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    app.getHttpAdapter().getInstance().set('etag', false)
    app.use(logContextMiddleware, logMiddleware)
    const httpAdapter = app.getHttpAdapter()
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter))
  }
}
