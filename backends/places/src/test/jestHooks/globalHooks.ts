import { AuthGuard } from 'src/auth'

beforeAll(async () => {
  // TODO: clear Redis?
  AuthGuard.mock()
})

afterEach(async () => {
  // TODO: clear Redis?
})

afterAll(async () => {
  AuthGuard.unMock()
})
