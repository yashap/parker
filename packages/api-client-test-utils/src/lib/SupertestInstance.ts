import { ApiAxiosInstance, ApiAxiosRequest, ApiAxiosResponse } from '@parker/api-client-utils'
import { buildServerErrorFromDto } from '@parker/errors'
import supertest from 'supertest'

/**
 * Wraps supertest so that it satisfies the ApiAxiosInstance contract, and thus can be used with out API clients. For
 * use exclusively in tests
 */
export class SupertestInstance implements ApiAxiosInstance {
  private readonly supertest: supertest.SuperTest<supertest.Test>

  constructor(httpServer: unknown) {
    this.supertest = supertest(httpServer)
  }

  public async request(config: ApiAxiosRequest): Promise<ApiAxiosResponse> {
    const method = config.method.toLowerCase()
    const url = new URL(config.url)
    const pathWithQueryParams = `${url.pathname}${url.search}`
    const maybeRequestBody = config.data ? JSON.parse(config.data as string) : undefined
    const requestHeaders = config.headers
    let response: Pick<Response, 'status' | 'body'> | undefined = undefined
    if (method === 'get') {
      response = await this.supertest.get(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    } else if (method === 'post') {
      response = await this.supertest.post(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    } else if (method === 'patch') {
      response = await this.supertest.patch(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    } else if (method === 'delete') {
      response = await this.supertest.delete(pathWithQueryParams).set(requestHeaders).send(maybeRequestBody)
    }
    if (response) {
      if (response.status >= 400) {
        throw buildServerErrorFromDto(response.body, response.status)
      }
      return { status: response.status, data: response.body, headers: {} }
    }
    throw new Error(`Unexpected method: ${config.method}`)
  }

  public readonly defaults = { baseURL: 'http://example.com' }
}
