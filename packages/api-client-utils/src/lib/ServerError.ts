import { z } from 'zod'

export const ServerErrorSchema = z.object({
  message: z.string({ description: 'Human readable description of the error' }),
  code: z.string({ description: 'Description of the error to code against' }),
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
