import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { SupertestInstance } from '@parker/api-client-utils'
import { CoreClient, UserDto } from '@parker/core-client'
import { NestAppBuilder } from '@parker/nest-utils'
import { v4 as uuid } from 'uuid'
import { UserController } from './UserController'
import { UserModule } from './UserModule'

describe(UserController.name, () => {
  let app: INestApplication
  let coreClient: CoreClient
  let user: UserDto

  beforeEach(async () => {
    // Create the app
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile()
    app = moduleRef.createNestApplication()
    NestAppBuilder.addMiddleware(app)
    await app.init()

    // Create a client that will call the app
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
      await coreClient.users.delete(user.id)
      const maybeUser = await coreClient.users.get(user.id)
      expect(maybeUser).toBeUndefined()
    })
  })
})
