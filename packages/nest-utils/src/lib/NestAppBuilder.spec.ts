import { InputValidationError } from '@parker/errors'
import { CreateFooRequest, Foo, FooClient, buildFooApp, buildFooClient } from '../test/FooApp'
import { NestAppBuilder } from './NestAppBuilder'

describe(NestAppBuilder.name, () => {
  let client: FooClient

  beforeEach(async () => {
    const app = await buildFooApp()
    client = buildFooClient(app)
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
      // TODO
    })

    it('returns an EndpointNotFoundError for an unknown endpoint', async () => {
      // TODO
    })

    it('returns an InternalServerError for an invalid response', async () => {
      // const mockFooRepository = jest.spyOn(FooRepository, 'createFoo').mockImplementation(() => {
      //   const badFoo = { oops: 'Not a foo' } as unknown as Foo
      //   return badFoo
      // })
      // await expect(client.postFoo({ body: { name: 'Foo' } })).rejects.toThrow(InternalServerError)
      // expect(mockFooRepository).toHaveBeenCalledTimes(1)
    })
  })
})
