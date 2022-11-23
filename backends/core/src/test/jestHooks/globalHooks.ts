import { TestDbOperations } from '../TestDbOperations'

beforeAll(async () => {
  await TestDbOperations.connect()
  await TestDbOperations.clear()
})

afterEach(async () => {
  await TestDbOperations.clear()
})

afterAll(async () => {
  await TestDbOperations.disconnect()
})
