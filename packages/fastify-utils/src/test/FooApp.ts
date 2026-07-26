import { FastifyInjectInstance } from '@parker/api-client-test-utils'
import { ApiClient, ApiClientBuilder, SchemaBuilder } from '@parker/api-client-utils'
import { PaginatedResponseSchema } from '@parker/pagination'
import { initContract } from '@ts-rest/core'
import { initServer } from '@ts-rest/fastify'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { FastifyAppBuilder } from '../lib/FastifyAppBuilder.js'
import { initMicroserviceSuperTokens } from '../lib/initSuperTokens.js'
import { tsRestPluginOptions } from '../lib/tsRestPluginOptions.js'

/**
 * This is a basic Fastify server, with a client/server contract defined using ts-rest, that makes it easy to test our
 * fastify-utils
 */

const c = initContract()

const FooSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const CreateFooRequestSchema = FooSchema.omit({ id: true })

export const ListFoosRequestSchema = z.object({
  limit: z.coerce.number(),
})

export const ListFoosResponseSchema: PaginatedResponseSchema<typeof FooSchema> =
  SchemaBuilder.buildListResponse(FooSchema)

export type Foo = z.infer<typeof FooSchema>
export type CreateFooRequest = z.infer<typeof CreateFooRequestSchema>
export type ListFoosRequest = z.infer<typeof ListFoosRequestSchema>
export type ListFoosResponse = z.infer<typeof ListFoosResponseSchema>

const contract = c.router({
  postFoo: {
    method: 'POST',
    path: '/foos',
    responses: {
      201: FooSchema,
    },
    body: CreateFooRequestSchema,
  },
  listFoos: {
    method: 'GET',
    path: '/foos',
    responses: {
      200: ListFoosResponseSchema,
    },
    query: ListFoosRequestSchema,
  },
})

export type FooClient = ApiClient<typeof contract>

export class FooRepository {
  private static currentId = 1
  private static foos: Foo[] = []

  public static createFoo(body: CreateFooRequest): Foo {
    const id = this.currentId
    this.currentId++
    const foo = { ...body, id }
    this.foos.push(foo)
    return foo
  }

  public static listFoos({ limit }: ListFoosRequest): Foo[] {
    return this.foos.slice(0, limit)
  }

  public static clear(): void {
    this.currentId = 1
    this.foos = []
  }
}

export const buildFooApp = async (): Promise<FastifyInstance> => {
  // The FastifyAppBuilder always registers the SuperTokens plugin, which requires SuperTokens to be initialized (no
  // SuperTokens core has to actually be running for these tests, though)
  initMicroserviceSuperTokens({
    apiDomain: 'http://localhost:4599',
    websiteDomain: 'http://localhost:9099',
    connectionUri: 'http://localhost:4567',
  })
  const s = initServer()
  const router = s.router(contract, {
    postFoo: async ({ body }) => {
      const foo = FooRepository.createFoo(body)
      return { status: 201, body: foo }
    },
    listFoos: async ({ query }) => {
      const foos = FooRepository.listFoos(query)
      return { status: 200, body: { data: foos, pagination: {} } }
    },
  })
  return FastifyAppBuilder.build({
    registerRoutes: async (app) => {
      await app.register(s.plugin(router), tsRestPluginOptions)
    },
  })
}

export const buildFooClient = (app: FastifyInstance): FooClient => {
  return ApiClientBuilder.build(contract, new FastifyInjectInstance(app))
}
