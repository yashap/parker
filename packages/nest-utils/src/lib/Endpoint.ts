import { AppRouter, AppRoute } from '@ts-rest/core'
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest'

// A decorator for our endpoints
export const Endpoint = (appRouterOrRoute: AppRouter | AppRoute): MethodDecorator =>
  TsRestHandler(appRouterOrRoute, {
    validateResponses: true,
    validateRequestQuery: true,
    validateRequestBody: true,
  })

// A function endpoints should call in their implementations
export const handle = tsRestHandler