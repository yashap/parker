import { SupertestInstance } from '@parker/api-client-test-utils'
import { ApiClient, ApiClientBuilder, SchemaBuilder } from '@parker/api-client-utils'
import { initContract, ServerInferRequest, ServerInferResponses } from '@ts-rest/core'
import { Express } from 'express'
import { z } from 'zod'
import { ExpressAppBuilder, RouterImplementation } from '../lib/ExpressAppBuilder'
import { HttpStatus } from '../lib/HttpStatus'

/**
 * This is a basic Express server, with a client/server contract defined using ts-rest, that makes it easy to test our express-utils
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

export const ListFoosResponseSchema = SchemaBuilder.buildListResponse(FooSchema)

export type Foo = z.infer<typeof FooSchema>
export type CreateFooRequest = z.infer<typeof CreateFooRequestSchema>
export type ListFoosRequest = z.infer<typeof ListFoosRequestSchema>
export type ListFoosResponse = z.infer<typeof ListFoosResponseSchema>

const fooContract = c.router({
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

type FooContract = typeof fooContract
type FooRouter = RouterImplementation<FooContract>

export type FooClient = ApiClient<FooContract>

export class FooRepository {
  private static currentId: number = 1
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

const FooController: FooRouter = {
  postFoo: async ({
    body,
  }: ServerInferRequest<typeof fooContract.postFoo>): Promise<ServerInferResponses<typeof fooContract.postFoo>> => {
    const foo = FooRepository.createFoo(body)
    return { status: HttpStatus.CREATED, body: foo }
  },

  listFoos: async ({
    query,
  }: ServerInferRequest<typeof fooContract.listFoos>): Promise<ServerInferResponses<typeof fooContract.listFoos>> => {
    const foos = FooRepository.listFoos(query)
    return { status: HttpStatus.OK, body: { data: foos } }
  },
}

export const buildFooApp = async (): Promise<Express> => {
  return ExpressAppBuilder.build<FooContract, FooRouter>(fooContract, FooController)
}

export const buildFooClient = (app: Express): FooClient => {
  const supertestInstance = new SupertestInstance(app)
  return ApiClientBuilder.build(fooContract, supertestInstance)
}
