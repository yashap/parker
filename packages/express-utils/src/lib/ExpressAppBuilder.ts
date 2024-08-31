import { AppRoute, AppRouter } from '@ts-rest/core'
import { initServer, createExpressEndpoints, AppRouteOptions, AppRouteImplementation } from '@ts-rest/express'
import * as bodyParser from 'body-parser'
import express, { Express } from 'express'
import { ErrorHandlerBuilder } from './ErrorHandlerBuilder'
import { FunctionalMiddleware } from './FunctionalMiddleware'
import { logContextMiddleware } from './logContextMiddleware'
import { logMiddleware } from './logMiddleware'

type AppRouteImplementationOrOptions<TRoute extends AppRoute> = AppRouteOptions<TRoute> | AppRouteImplementation<TRoute>

export type RouterImplementation<T extends AppRouter> = {
  [TKey in keyof T]: T[TKey] extends AppRouter
    ? RouterImplementation<T[TKey]>
    : T[TKey] extends AppRoute
      ? AppRouteImplementationOrOptions<T[TKey]>
      : never
}

export class ExpressAppBuilder {
  public static build<
    Contract extends AppRouter = AppRouter,
    Router extends RouterImplementation<Contract> = RouterImplementation<Contract>,
  >(contract: Contract, router: Router, middleware: FunctionalMiddleware[] = []): Express {
    const app = express()

    /**
     * For an API just serving json, would rather not deal with Etag caching, which is mostly useful for large static
     * assets (images, videos, etc.), not small JSON responses.
     */
    app.set('etag', false)
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    const tsRestExpressServer = initServer()
    const tsRestExpressRouter = tsRestExpressServer.router(contract, router)
    createExpressEndpoints(contract, tsRestExpressRouter, app, {
      responseValidation: true,
      requestValidationErrorHandler: ErrorHandlerBuilder.build(),
      globalMiddleware: [logContextMiddleware, logMiddleware, ...middleware],
    })
    app.use(ErrorHandlerBuilder.build())
    return app
  }
}
