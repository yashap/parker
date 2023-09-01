import { LogContextPropagator, Payload } from '@parker/logging'
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { logContextMiddleware } from './logContextMiddleware'

describe(logContextMiddleware.name, () => {
  const sleep = (milliseconds: number): Promise<number> =>
    new Promise((resolve) => setTimeout(resolve as () => void, milliseconds))

  it('sets a correlationId', async () => {
    let contextWithinEndpoint: Payload = {}

    const request = {
      method: 'GET',
      url: 'http://example.com/users/123',
    } as Request

    logContextMiddleware(request, {} as Response, () => {
      contextWithinEndpoint = LogContextPropagator.getContext() ?? {}
    })

    expect(contextWithinEndpoint['correlationId']).toHaveLength(uuid().length)
  })

  it('sets correlationIds with multiple concurrent requests', async () => {
    let context1: Payload = {}
    let context2: Payload = {}
    let context3: Payload = {}

    const request = {
      method: 'GET',
      url: 'http://example.com/users/123',
    } as Request

    // Kick off 3 concurrent requests
    let callsCompleted = 0
    logContextMiddleware(request, {} as Response, async () => {
      sleep(50)
      context1 = LogContextPropagator.getContext() ?? {}
      callsCompleted += 1
    })
    logContextMiddleware(request, {} as Response, async () => {
      sleep(50)
      context2 = LogContextPropagator.getContext() ?? {}
      callsCompleted += 1
    })
    logContextMiddleware(request, {} as Response, async () => {
      sleep(50)
      context3 = LogContextPropagator.getContext() ?? {}
      callsCompleted += 1
    })

    // Wait for all 3 concurrent requests to complete
    while (callsCompleted < 3) {
      await sleep(10)
    }

    // Ensure they all have the expected data
    const context1CorrelationId = context1['correlationId']
    expect(context1CorrelationId).toHaveLength(uuid().length)

    const context2CorrelationId = context2['correlationId']
    expect(context2CorrelationId).toHaveLength(uuid().length)

    const context3CorrelationId = context3['correlationId']
    expect(context3CorrelationId).toHaveLength(uuid().length)

    expect(context1CorrelationId).not.toEqual(context2CorrelationId)
    expect(context1CorrelationId).not.toEqual(context3CorrelationId)
    expect(context2CorrelationId).not.toEqual(context3CorrelationId)
  })
})
