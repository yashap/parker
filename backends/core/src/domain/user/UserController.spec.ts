import { INestApplication } from '@nestjs/common'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { CoreClient, UserDto } from '@parker/core-client'
import { v4 as uuid } from 'uuid'
import { buildTestApp } from '../../test/buildTestApp'
import { UserController } from './UserController'

describe(UserController.name, () => {
  let app: INestApplication
  let coreClient: CoreClient
  let user: UserDto

  beforeEach(async () => {
    app = await buildTestApp()
    coreClient = new CoreClient(new SupertestInstance(app.getHttpServer()))

    // Setup test data
    const postBody = { email: 'donald.duck@example.com', fullName: 'Donald Duck' }
    user = await coreClient.users.create(postBody)
    const { id, ...rest } = user
    expect(id).toBeDefined()
    expect(rest).toStrictEqual(postBody)
  })

  describe('getById', () => {
    it('should get a user by id', async () => {
      const maybeUser = await coreClient.users.get(user.id)
      expect(maybeUser).toStrictEqual(user)
    })

    it('should verify that a user does not exist', async () => {
      const maybeUser = await coreClient.users.get(uuid())
      expect(maybeUser).toBeUndefined()
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const update = { fullName: 'Updated' }
      const maybeUser = await coreClient.users.update(user.id, update)
      expect(maybeUser).toStrictEqual({ ...user, ...update })
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      let maybeUser = await coreClient.users.get(user.id)
      await coreClient.users.delete(user.id)
      maybeUser = await coreClient.users.get(user.id)
      expect(maybeUser).toBeUndefined()
      expect(10).toBe(10)
    })
  })
})
