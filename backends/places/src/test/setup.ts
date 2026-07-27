import { mockAuth, unmockAuth } from '@parker/fastify-utils'
import { addTemporalEqualityTesters } from '@parker/test-utils'
import { afterAll, beforeAll } from 'vitest'

addTemporalEqualityTesters()

beforeAll(() => {
  mockAuth()
})

afterAll(() => {
  unmockAuth()
})
