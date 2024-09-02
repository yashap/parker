import { TestDb } from '../../lib/TestDb'

beforeAll(async () => {
  await TestDb.init()
})

beforeEach(async () => {
  await TestDb.clear()
})
