import { INestApplication, DynamicModule, ForwardReference, Type } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import supertokens from 'supertokens-node'
import { SuperTokensExceptionFilter } from './auth/SuperTokensExceptionFilter'
import { HttpExceptionFilter } from './HttpExceptionFilter'
import { logContextMiddleware } from './logContextMiddleware'
import { logMiddleware } from './logMiddleware'
import { NestLogger } from './NestLogger'

type IEntryNestModule = Type | DynamicModule | ForwardReference | Promise<IEntryNestModule>

export class NestAppBuilder {
  public static async build(appModule: IEntryNestModule, parkerWebUrl: string | undefined): Promise<INestApplication> {
    const app = await NestFactory.create(appModule, {
      logger: new NestLogger(),
    })
    this.configureApp(app, parkerWebUrl)
    return app
  }

  public static configureApp(app: INestApplication, parkerWebUrl: string | undefined): void {
    /**
     * For an API just serving json, would rather not deal with Etag caching, which is mostly useful for large static
     * assets (images, videos, etc.), not small JSON responses.
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    app.getHttpAdapter().getInstance().set('etag', false)
    app.use(logContextMiddleware, logMiddleware)
    const httpAdapter = app.getHttpAdapter()
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter))
    if (parkerWebUrl) {
      app.enableCors({
        origin: [parkerWebUrl],
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
      })
    }
    app.useGlobalFilters(new SuperTokensExceptionFilter())
  }
}
