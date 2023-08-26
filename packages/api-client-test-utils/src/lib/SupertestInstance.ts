import { ApiAxiosInstance, ApiAxiosRequest, ApiAxiosResponse } from '@parker/api-client-utils'
import { ServerError } from '@parker/errors'
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
    const path = `${url.pathname}${url.search}`
    const data = config.data ? JSON.parse(config.data as string) : undefined
    let response: Pick<Response, 'status' | 'body'> | undefined = undefined
    if (method === 'get') {
      response = data ? await this.supertest.get(path).send(data) : await this.supertest.get(path).send()
    } else if (method === 'post') {
      response = data ? await this.supertest.post(path).send(data) : await this.supertest.post(path)
    } else if (method === 'patch') {
      response = data ? await this.supertest.patch(path).send(data) : await this.supertest.patch(path).send()
    } else if (method === 'delete') {
      response = data ? await this.supertest.delete(path).send(data) : await this.supertest.delete(path).send()
    }
    if (response) {
      if (response.status >= 400) {
        throw ServerError.fromDto(response.body, response.status)
      }
      return { status: response.status, data: response.body, headers: {} }
    }
    throw new Error(`Unexpected method: ${config.method}`)
  }

  public readonly defaults = { baseURL: 'http://example.com' }
}
