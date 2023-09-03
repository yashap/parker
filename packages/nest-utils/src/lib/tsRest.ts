import { AppRouter, AppRoute } from '@ts-rest/core'
import { TsRestHandler as LibTsRestHandler, TsRestOptions as LibTsRestOptions } from '@ts-rest/nest'

// Just re-exporting useful ts-rest stuff, so our servers don't have to depend on ts-rest directly
export { tsRestHandler } from '@ts-rest/nest'

export type TsRestOptions = Omit<LibTsRestOptions, 'validateResponses' | 'validateRequestQuery' | 'validateRequestBody'>

export const TsRestHandler = (appRouterOrRoute: AppRouter | AppRoute, options?: TsRestOptions): MethodDecorator =>
  LibTsRestHandler(appRouterOrRoute, {
    validateResponses: true,
    validateRequestQuery: true,
    validateRequestBody: true,
    ...options,
  })
