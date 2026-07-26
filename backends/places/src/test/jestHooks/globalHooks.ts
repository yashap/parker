import { mockAuth, unmockAuth } from '@parker/fastify-utils'

beforeAll(() => {
  mockAuth()
})

afterAll(() => {
  unmockAuth()
})
