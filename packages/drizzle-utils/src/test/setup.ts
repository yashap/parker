import { addTemporalEqualityTesters } from '@parker/test-utils'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { TestDb } from './TestDb.js'

addTemporalEqualityTesters()

beforeAll(async () => {
  await TestDb.init()
  await TestDb.clear()
})

afterEach(async () => {
  await TestDb.clear()
})

afterAll(async () => {
  // Vitest has no jest-style --forceExit; end the pg pool so the worker process can exit cleanly
  await TestDb.close()
})
