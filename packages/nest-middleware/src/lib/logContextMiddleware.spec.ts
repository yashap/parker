import { LogData, LogContextPropagator } from '@parker/logging'
import { v4 as uuid } from 'uuid'
import { logContextMiddleware } from './logContextMiddleware'

describe(logContextMiddleware.name, () => {
  const sleep = (milliseconds: number): Promise<number> => new Promise((resolve) => setTimeout(resolve, milliseconds))

  it('sets a correlationId, method and path', async () => {
    let contextWithinEndpoint: LogData = {}

    const request = {
      method: 'GET',
      url: 'http://example.com/users/123',
    } as Request

    logContextMiddleware(request, {} as Response, () => {
      contextWithinEndpoint = LogContextPropagator.getContext() ?? {}
    })

    expect(contextWithinEndpoint['method']).toStrictEqual(request.method)
    expect(contextWithinEndpoint['path']).toStrictEqual('/users/123')
    expect(contextWithinEndpoint['correlationId']).toHaveLength(uuid().length)
  })

  it('sets proper context with multiple concurrent requests', async () => {
    let context1: LogData = {}
    let context2: LogData = {}
    let context3: LogData = {}

    const request1 = {
      method: 'GET',
      url: 'http://example.com/users/123',
    } as Request
    const request2 = {
      method: 'POST',
      url: 'http://example.com/users',
    } as Request
    const request3 = {
      method: 'PATCH',
      url: 'http://example.com/users/123',
    } as Request

    // Kick off 3 concurrent requests
    let callsCompleted = 0
    logContextMiddleware(request1, {} as Response, async () => {
      sleep(50)
      context1 = LogContextPropagator.getContext() ?? {}
      callsCompleted += 1
    })
    logContextMiddleware(request2, {} as Response, async () => {
      sleep(50)
      context2 = LogContextPropagator.getContext() ?? {}
      callsCompleted += 1
    })
    logContextMiddleware(request3, {} as Response, async () => {
      sleep(50)
      context3 = LogContextPropagator.getContext() ?? {}
      callsCompleted += 1
    })

    // Wait for all 3 concurrent requests to complete
    while (callsCompleted < 3) {
      await sleep(10)
    }

    // Ensure they all have the expected data
    expect(context1['method']).toStrictEqual(request1.method)
    expect(context1['path']).toStrictEqual('/users/123')
    expect(context1['correlationId']).toHaveLength(uuid().length)

    expect(context2['method']).toStrictEqual(request2.method)
    expect(context2['path']).toStrictEqual('/users')
    expect(context2['correlationId']).toHaveLength(uuid().length)

    expect(context3['method']).toStrictEqual(request3.method)
    expect(context3['path']).toStrictEqual('/users/123')
    expect(context3['correlationId']).toHaveLength(uuid().length)
  })
})
