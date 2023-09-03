import { z } from 'zod'

export const ServerErrorSchema = z.object({
  message: z.string({ description: 'Human readable description of the error' }),
  code: z.string({ description: 'Describes the error in a more static way, for applications to program against' }),
  subCode: z.string({ description: 'An optional, even more specific description of the error' }).optional(),
  metadata: z.any({ description: 'Additional data associated with the error' }).optional(),
})

export type ServerErrorDto = z.infer<typeof ServerErrorSchema>

export const DefaultErrorResponses = {
  400: ServerErrorSchema,
  401: ServerErrorSchema,
  403: ServerErrorSchema,
  500: ServerErrorSchema,
}

export const DefaultErrorResponsesWithNotFound = {
  400: ServerErrorSchema,
  401: ServerErrorSchema,
  403: ServerErrorSchema,
  404: ServerErrorSchema,
  500: ServerErrorSchema,
}
