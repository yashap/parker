import { TestDBOperations } from '../TestDBOperations'

beforeAll(async () => {
  await TestDBOperations.connect()
  await TestDBOperations.clearDB()
})

afterEach(async () => {
  await TestDBOperations.clearDB()
})

afterAll(async () => {
  await TestDBOperations.disconnect()
})
