import { ApiAxiosInstance, ApiAxiosRequest, ApiAxiosResponse } from '@parker/api-client-utils'
import { buildServerErrorFromDto } from '@parker/errors'
import type { FastifyInstance, InjectOptions } from 'fastify'

/**
 * Wraps a Fastify app's inject() method (in-process request dispatch, no network) so that it satisfies the
 * ApiAxiosInstance contract, and thus can be used with our API clients. For use exclusively in tests
 */
export class FastifyInjectInstance implements ApiAxiosInstance {
  constructor(
    private readonly app: FastifyInstance,
    private readonly defaultHeaders?: Record<string, string>
  ) {}

  public async request(config: ApiAxiosRequest): Promise<ApiAxiosResponse> {
    const method = config.method.toUpperCase() as InjectOptions['method']
    const url = new URL(config.url)
    const pathWithQueryParams = `${url.pathname}${url.search}`
    const maybeRequestBody = config.data ? (JSON.parse(config.data as string) as object) : undefined
    const requestHeaders = { ...this.defaultHeaders, ...config.headers }
    const response = await this.app.inject({
      method,
      url: pathWithQueryParams,
      headers: requestHeaders,
      ...(maybeRequestBody !== undefined ? { payload: maybeRequestBody } : {}),
    })
    const responseBody = this.parseResponseBody(response.body)
    if (response.statusCode >= 400) {
      throw buildServerErrorFromDto(responseBody, response.statusCode)
    }
    return { status: response.statusCode, data: responseBody, headers: response.headers }
  }

  // Parse response bodies the same way supertest does (see SupertestInstance) - JSON bodies become objects, empty
  // bodies become empty objects
  private parseResponseBody(body: string): unknown {
    if (body.length === 0) {
      return {}
    }
    try {
      return JSON.parse(body) as unknown
    } catch {
      return body
    }
  }

  public readonly defaults = { baseURL: 'http://example.com' }
}
