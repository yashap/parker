import { AuthGuard } from '../../auth'
import { TestDbTeardown } from '../TestDbTeardown'

beforeAll(async () => {
  await new TestDbTeardown().clear()
  AuthGuard.mock()
})

afterEach(async () => {
  await new TestDbTeardown().clear()
})

afterAll(async () => {
  AuthGuard.unMock()
})
