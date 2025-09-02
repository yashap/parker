import { AuthGuard } from '@parker/nest-utils'

beforeAll(async () => {
  AuthGuard.mock()
})

afterAll(async () => {
  AuthGuard.unMock()
})
