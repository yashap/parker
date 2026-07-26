import { mockAuth, unmockAuth } from '@parker/fastify-utils'
import { addTemporalEqualityTesters } from '@parker/test-utils'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { Db } from 'src/db/Db'
import { TestDbTeardown } from 'src/test/TestDbTeardown'

addTemporalEqualityTesters()

beforeAll(async () => {
  await new TestDbTeardown().clear()
  mockAuth()
})

afterEach(async () => {
  await new TestDbTeardown().clear()
})

afterAll(async () => {
  unmockAuth()
  // Vitest has no jest-style --forceExit; end the pg pool so the worker process can exit cleanly
  await Db.close()
})
