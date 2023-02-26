import { TestDbTeardown } from '../TestDbTeardown'

beforeAll(async () => {
  await new TestDbTeardown().clear()
})

afterEach(async () => {
  await new TestDbTeardown().clear()
})

afterAll(async () => {
  await new TestDbTeardown().disconnect()
})
