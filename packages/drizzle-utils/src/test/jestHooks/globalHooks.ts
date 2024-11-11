import { TestDb } from '../TestDb'

beforeAll(async () => {
  await TestDb.init()
})

afterEach(async () => {
  await TestDb.clear()
})
