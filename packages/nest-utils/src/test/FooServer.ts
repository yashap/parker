import { INestApplication, Controller, Module } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { ApiClient, ApiClientBuilder } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { z } from 'zod'
import { NestAppBuilder } from '../lib/NestAppBuilder'

/**
 * This is a basic Nest server, with a client/server contract defined using ts-rest, that makes it easy to test our nest-utils
 */

const c = initContract()

const FooSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const CreateFooRequestSchema = FooSchema.omit({ id: true })

export type Foo = z.infer<typeof FooSchema>

export type CreateFooRequest = z.infer<typeof CreateFooRequestSchema>

const contract = c.router({
  postFoo: {
    method: 'POST',
    path: '/foos',
    responses: {
      201: FooSchema,
    },
    body: CreateFooRequestSchema,
  },
})

export class FooRepository {
  public static createFoo(body: CreateFooRequest): Foo {
    return {
      ...body,
      id: 1,
    }
  }
}

@Controller()
class FooController {
  @TsRestHandler(contract.postFoo)
  public async post() {
    return tsRestHandler(contract.postFoo, async ({ body }) => {
      const foo = FooRepository.createFoo(body)
      return { status: 201, body: foo }
    })
  }
}

@Module({
  controllers: [FooController],
})
class FooModule {}

export const buildFooApp = async (): Promise<INestApplication> => {
  const moduleRef = await Test.createTestingModule({
    imports: [FooModule],
  }).compile()
  const app = moduleRef.createNestApplication()
  NestAppBuilder.configureApp(app)
  await app.init()
  return app
}

export type FooClient = ApiClient<typeof contract>

export const buildFooClient = (app: INestApplication): FooClient => {
  const supertestInstance = new SupertestInstance(app.getHttpServer())
  return ApiClientBuilder.build(contract, supertestInstance)
}
