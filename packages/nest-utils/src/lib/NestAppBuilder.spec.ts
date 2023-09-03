import { SupertestInstance } from '@parker/api-client-test-utils'
import { ApiAxiosInstance } from '@parker/api-client-utils'
import { EndpointNotFoundError, InputValidationError, ResponseValidationError } from '@parker/errors'
import {
  CreateFooRequest,
  Foo,
  FooClient,
  FooRepository,
  ListFoosRequest,
  buildFooApp,
  buildFooClient,
} from '../test/FooApp'
import { NestAppBuilder } from './NestAppBuilder'

describe(NestAppBuilder.name, () => {
  let client: FooClient
  let supertestInstance: ApiAxiosInstance

  beforeEach(async () => {
    const app = await buildFooApp()
    client = buildFooClient(app)
    supertestInstance = new SupertestInstance(app.getHttpServer())
  })

  describe('well formed requests/responses', () => {
    it('returns valid responses', async () => {
      const requestBody: CreateFooRequest = { name: 'Foo' }
      const response = await client.postFoo({ body: { name: 'Foo' } })
      expect(response.status).toBe(201)
      const expectedResponseBody: Foo = { ...requestBody, id: 1 }
      expect(response.body).toStrictEqual(expectedResponseBody)
    })
  })

  describe('validation', () => {
    it('returns an InputValidationError for an invalid request body', async () => {
      const invalidPostBody = { name: 10 } as unknown as CreateFooRequest
      await expect(client.postFoo({ body: invalidPostBody })).rejects.toThrow(InputValidationError)
    })

    it('returns an InputValidationError for invalid query params', async () => {
      const invalidQueryParams = { limit: true } as unknown as ListFoosRequest
      await expect(client.listFoos({ query: invalidQueryParams })).rejects.toThrow(InputValidationError)
    })

    it('returns an EndpointNotFoundError for an unknown endpoint', async () => {
      await expect(
        supertestInstance.request({
          method: 'GET',
          url: 'http://example.com/notARealEndpoint',
          headers: {},
          data: undefined,
        })
      ).rejects.toThrow(EndpointNotFoundError)
    })

    it('returns a ResponseValidationError for an invalid response', async () => {
      const mockFooRepository = jest.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        const badFoo = { oops: 'Not a foo' } as unknown as Foo
        return badFoo
      })
      await expect(client.postFoo({ body: { name: 'Foo' } })).rejects.toThrow(ResponseValidationError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
    })
  })
})
