import { mockAuth, unmockAuth } from '@parker/fastify-utils'
import { TestDbTeardown } from 'src/test/TestDbTeardown'

beforeAll(async () => {
  await new TestDbTeardown().clear()
  mockAuth()
})

afterEach(async () => {
  await new TestDbTeardown().clear()
})

afterAll(async () => {
  unmockAuth()
})
