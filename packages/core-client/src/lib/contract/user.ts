import { DefaultErrorResponsesWithNotFound, DefaultErrorResponses } from '@parker/api-client-utils'
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
    responses: {
      201: UserSchema,
      ...DefaultErrorResponses,
    },
    body: CreateUserRequestSchema,
    summary: 'Create a user',
  },
  get: {
    method: 'GET',
    path: '/core/users/:id',
    responses: {
      200: UserSchema,
      ...DefaultErrorResponsesWithNotFound,
    },
    summary: 'Get a user',
  },
  patch: {
    method: 'PATCH',
    path: '/core/users/:id',
    responses: {
      200: UserSchema,
      ...DefaultErrorResponsesWithNotFound,
    },
    body: UpdateUserRequestSchema,
    summary: 'Update a user',
  },
  delete: {
    method: 'DELETE',
    path: '/core/users/:id',
    responses: {
      204: z.undefined(),
      ...DefaultErrorResponsesWithNotFound,
    },
    body: z.NEVER,
    summary: 'Delete a user',
  },
})
