import { AuthGuard } from '@parker/nest-utils'
import { TestDbTeardown } from 'src/test/TestDbTeardown'

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
