import { FastifyInjectInstance } from '@parker/api-client-test-utils'
import {
  EndpointNotFoundError,
  InputValidationError,
  InternalServerError,
  NotFoundError,
  ResponseValidationError,
  required,
  ServerError,
} from '@parker/errors'
import { Logger, LogLevel } from '@parker/logging'
import type { FastifyInstance } from 'fastify'
import { v4 as uuid } from 'uuid'
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import { expectServerError } from '../test/expectServerError.js'
import {
  buildFooApp,
  buildFooClient,
  CreateFooRequest,
  Foo,
  FooClient,
  FooRepository,
  ListFoosRequest,
} from '../test/FooApp.js'
import { FastifyAppBuilder } from './FastifyAppBuilder.js'

describe(FastifyAppBuilder.name, () => {
  let app: FastifyInstance
  let client: FooClient
  let injectInstance: FastifyInjectInstance

  beforeEach(async () => {
    app = await buildFooApp()
    client = buildFooClient(app)
    injectInstance = new FastifyInjectInstance(app)
  })

  afterEach(async () => {
    await app.close()
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
      const error = await expectServerError(client.postFoo({ body: invalidPostBody }), InputValidationError)
      expect(error.toDto()).toStrictEqual({
        message: 'Invalid request',
        code: 'InputValidationError',
        metadata: {
          bodyErrors: [
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'number',
              path: ['name'],
              message: 'Expected string, received number',
            },
          ],
        },
      })
    })

    it('returns an InputValidationError for invalid query params', async () => {
      const invalidQueryParams = { limit: true } as unknown as ListFoosRequest
      const error = await expectServerError(client.listFoos({ query: invalidQueryParams }), InputValidationError)
      expect(error.toDto()).toStrictEqual({
        message: 'Invalid request',
        code: 'InputValidationError',
        metadata: {
          queryErrors: [
            {
              code: 'invalid_type',
              expected: 'number',
              received: 'nan',
              path: ['limit'],
              message: 'Expected number, received nan',
            },
          ],
        },
      })
    })

    it('returns an EndpointNotFoundError for an unknown endpoint', async () => {
      const error = await expectServerError(
        injectInstance.request({
          method: 'GET',
          url: 'http://example.com/notARealEndpoint',
          headers: {},
          data: undefined,
        }),
        EndpointNotFoundError
      )
      expect(error.toDto()).toStrictEqual({
        message: 'Endpoint not found',
        code: 'EndpointNotFoundError',
      })
    })

    it('returns a ResponseValidationError for an invalid response', async () => {
      const mockFooRepository = vi
        .spyOn(FooRepository, 'createFoo')
        .mockReturnValue({ oops: 'Not a foo' } as unknown as Foo)
      const error = await expectServerError(client.postFoo({ body: { name: 'Foo' } }), ResponseValidationError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(error.toDto()).toStrictEqual({
        message: 'Invalid response',
        code: 'ResponseValidationError',
        metadata: {
          details: [
            { code: 'invalid_type', expected: 'number', received: 'undefined', path: ['id'], message: 'Required' },
            { code: 'invalid_type', expected: 'string', received: 'undefined', path: ['name'], message: 'Required' },
          ],
        },
      })
    })

    it('returns the thrown error, if a ServerError is thrown', async () => {
      const mockFooRepository = vi.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new NotFoundError('Oops', { metadata: { foo: 'bar' } })
      })
      const error = await expectServerError(client.postFoo({ body: { name: 'Foo' } }), NotFoundError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(error.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'NotFoundError',
        metadata: { foo: 'bar' },
      })
    })
  })

  describe('logging', () => {
    interface LogPayload {
      correlationId?: string
      error?: ServerError
      status?: number
      statusCode?: number
      responseBody?: object
    }

    let mockLog: MockInstance<(level: LogLevel, message: string, metadata: object) => void>

    const getLogPayload = (level: LogLevel, message: string): LogPayload => {
      const logCall = mockLog.mock.calls.find((args) => args[0] === level && args[1] === message)
      expect(logCall).toBeDefined()
      return required(logCall)[2]
    }

    const expectSameCorrelationId = (left: { correlationId?: string }, right: { correlationId?: string }): void => {
      expect(left.correlationId).toBeDefined()
      expect(left.correlationId).toHaveLength(uuid().length)
      expect(left.correlationId).toBe(right.correlationId)
    }

    beforeEach(() => {
      mockLog = vi.spyOn(
        Logger.prototype as unknown as { doLog: (level: LogLevel, message: string, metadata: object) => void },
        'doLog'
      )
    })

    it('logs 200s', async () => {
      await client.listFoos({ query: { limit: 10 } })
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(getLogPayload(LogLevel.Info, 'Request completed')).toEqual(
        expect.objectContaining({
          statusCode: 200,
          method: 'GET',
          url: '/foos?limit=10',
        })
      )
    })

    it('logs 201s', async () => {
      await client.postFoo({ body: { name: 'Foo' } })
      expect(mockLog).toHaveBeenCalledTimes(1)
      expect(getLogPayload(LogLevel.Info, 'Request completed')).toEqual(
        expect.objectContaining({
          statusCode: 201,
          method: 'POST',
          url: '/foos',
        })
      )
    })

    it('logs 400s, twice (http response and caught exception), with the same correlation id', async () => {
      const mockFooRepository = vi.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new InputValidationError('Oops', { metadata: { foo: 'bar' } })
      })
      await expectServerError(client.postFoo({ body: { name: 'Foo' } }), InputValidationError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledTimes(2)
      const httpResponseLogPayload = getLogPayload(LogLevel.Warn, 'Request completed')
      const exceptionLogPayload = getLogPayload(LogLevel.Warn, 'Caught exception')
      expect(httpResponseLogPayload).toEqual(
        expect.objectContaining({
          statusCode: 400,
          method: 'POST',
          url: '/foos',
        })
      )
      expect(exceptionLogPayload.status).toBe(400)
      expect(exceptionLogPayload.error?.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'InputValidationError',
        metadata: {
          foo: 'bar',
        },
      })
      expect(exceptionLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expect(httpResponseLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expectSameCorrelationId(httpResponseLogPayload, exceptionLogPayload)
    })

    it('logs 404s, twice (http response and caught exception), with the same correlation id', async () => {
      const mockFooRepository = vi.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new NotFoundError('Oops', { metadata: { foo: 'bar' } })
      })
      await expectServerError(client.postFoo({ body: { name: 'Foo' } }), NotFoundError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledTimes(2)
      const httpResponseLogPayload = getLogPayload(LogLevel.Warn, 'Request completed')
      const exceptionLogPayload = getLogPayload(LogLevel.Warn, 'Caught exception')
      expect(httpResponseLogPayload).toEqual(
        expect.objectContaining({
          statusCode: 404,
          method: 'POST',
          url: '/foos',
        })
      )
      expect(exceptionLogPayload.status).toBe(404)
      expect(exceptionLogPayload.error?.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'NotFoundError',
        metadata: {
          foo: 'bar',
        },
      })
      expect(exceptionLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expectSameCorrelationId(httpResponseLogPayload, exceptionLogPayload)
    })

    it('logs 500s, twice (http response and caught exception), with the same correlation id', async () => {
      const mockFooRepository = vi.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
        throw new InternalServerError('Oops', { metadata: { foo: 'bar' } })
      })
      await expectServerError(client.postFoo({ body: { name: 'Foo' } }), InternalServerError)
      expect(mockFooRepository).toHaveBeenCalledTimes(1)
      expect(mockLog).toHaveBeenCalledTimes(2)
      const httpResponseLogPayload = getLogPayload(LogLevel.Error, 'Request completed')
      const exceptionLogPayload = getLogPayload(LogLevel.Error, 'Caught exception')
      expect(httpResponseLogPayload).toEqual(
        expect.objectContaining({
          statusCode: 500,
          method: 'POST',
          url: '/foos',
        })
      )
      expect(exceptionLogPayload.status).toBe(500)
      expect(exceptionLogPayload.error?.toDto()).toStrictEqual({
        message: 'Oops',
        code: 'InternalServerError',
        metadata: {
          foo: 'bar',
        },
      })
      expect(exceptionLogPayload.responseBody).toStrictEqual(exceptionLogPayload.error?.toDto())
      expectSameCorrelationId(httpResponseLogPayload, exceptionLogPayload)
    })
  })

  describe('correlation ids', () => {
    let mockLog: MockInstance<(level: LogLevel, message: string, metadata: object) => void>

    beforeEach(() => {
      mockLog = vi.spyOn(
        Logger.prototype as unknown as { doLog: (level: LogLevel, message: string, metadata: object) => void },
        'doLog'
      )
    })

    it('respects an inbound x-correlation-id header, echoing it on the response and in logs', async () => {
      const correlationId = uuid()
      const response = await app.inject({
        method: 'GET',
        url: '/foos?limit=10',
        headers: { 'x-correlation-id': correlationId },
      })
      expect(response.statusCode).toBe(200)
      expect(response.headers['x-correlation-id']).toBe(correlationId)
      const logCall = mockLog.mock.calls.find((args) => args[1] === 'Request completed')
      expect(logCall).toBeDefined()
      expect((logCall?.[2] as { correlationId?: string }).correlationId).toBe(correlationId)
    })

    it('generates a fresh correlation id when none is provided', async () => {
      const response = await app.inject({ method: 'GET', url: '/foos?limit=10' })
      expect(response.statusCode).toBe(200)
      const correlationId = response.headers['x-correlation-id']
      expect(correlationId).toBeDefined()
      expect(correlationId).toHaveLength(uuid().length)
    })

    it('assigns distinct correlation ids to concurrent requests', async () => {
      const responses = await Promise.all([
        app.inject({ method: 'GET', url: '/foos?limit=1' }),
        app.inject({ method: 'GET', url: '/foos?limit=2' }),
        app.inject({ method: 'GET', url: '/foos?limit=3' }),
      ])
      const correlationIds = responses.map((response) => response.headers['x-correlation-id'])
      for (const correlationId of correlationIds) {
        expect(correlationId).toBeDefined()
        expect(correlationId).toHaveLength(uuid().length)
      }
      expect(new Set(correlationIds).size).toBe(3)
    })
  })
})
