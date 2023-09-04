import { SupertestInstance } from '@parker/api-client-test-utils'
import { ApiAxiosInstance } from '@parker/api-client-utils'
import { EndpointNotFoundError, InputValidationError, ResponseValidationError, required } from '@parker/errors'
import { LogLevel, Logger } from '@parker/logging'
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

  describe('validation', () => {
    it('returns valid responses', async () => {
      const requestBody: CreateFooRequest = { name: 'Foo' }
      const response = await client.postFoo({ body: requestBody })
      expect(response.status).toBe(201)
      const expectedResponseBody: Foo = { ...requestBody, id: 1 }
      expect(response.body).toStrictEqual(expectedResponseBody)
    })

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

  describe('logging', () => {
    let mockLog: jest.SpyInstance<void, [level: LogLevel, message: string, metadata: object]>
    const getLogPayload = (level: LogLevel, message: string): object => {
      const logCall = mockLog.mock.calls.find((args) => args[0] === level && args[1] === message)
      expect(logCall).toBeDefined()
      return required(logCall)[2]
    }

    beforeEach(() => {
      mockLog = jest.spyOn(
        Logger.prototype as unknown as { doLog: (level: LogLevel, message: string, metadata: object) => void },
        'doLog'
      )
    })

    it('logs 200s', async () => {
      await client.listFoos({ query: { limit: 10 } })
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(getLogPayload(LogLevel.Info, 'Request completed successfully')).toEqual(
        expect.objectContaining({
          status: 200,
          method: 'GET',
          path: '/foos',
        })
      )
    })

    it('logs 201s', async () => {
      await client.postFoo({ body: { name: 'Foo' } })
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(getLogPayload(LogLevel.Info, 'Request completed successfully')).toEqual(
        expect.objectContaining({
          status: 201,
          method: 'POST',
          path: '/foos',
        })
      )
    })

    it('logs 400s, twice (http response and caught exception), with the same correlation id', async () => {
      // TODO
    })

    it('logs 404s, twice (http response and caught exception), with the same correlation id', async () => {
      // TODO
    })

    it('logs 500s, twice (http response and caught exception), with the same correlation id', async () => {
      // TODO
    })
  })
})
