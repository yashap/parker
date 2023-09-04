import { ContractBuilder } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { CreateUserRequestSchema } from '../model/CreateUserRequest'
import { UpdateUserRequestSchema } from '../model/UpdateUserRequest'
import { UserSchema } from '../model/User'

const c = initContract()

export const userContract = c.router({
  post: {
    method: 'POST',
    path: '/core/users',
    body: CreateUserRequestSchema,
    responses: ContractBuilder.buildPostResponses(UserSchema),
    summary: 'Create a user',
  },
  get: {
    method: 'GET',
    path: '/core/users/:id',
    responses: ContractBuilder.buildGetResponses(UserSchema),
    summary: 'Get a user',
  },
  patch: {
    method: 'PATCH',
    path: '/core/users/:id',
    responses: ContractBuilder.buildPatchResponses(UserSchema),
    body: UpdateUserRequestSchema,
    summary: 'Update a user',
  },
  delete: {
    method: 'DELETE',
    path: '/core/users/:id',
    responses: ContractBuilder.buildDeleteResponses(),
    body: z.NEVER,
    summary: 'Delete a user',
  },
})
