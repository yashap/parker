import { z, ZodArray, ZodObject, ZodOptional, ZodTypeAny } from 'zod'

export const PaginationSchema = z.object(
  {
    next: z.string({ description: 'Can be used to fetch the next page' }).optional(),
    previous: z.string({ description: 'Can be used to fetch the previous page' }).optional(),
  },
  { description: 'Pagination information, attached to responses of list endpoints, to allow you to fetch other pages' }
)

export type PaginationDto = z.infer<typeof PaginationSchema>

export type PaginatedResponseSchema<T extends ZodTypeAny> = ZodObject<{
  data: ZodArray<T, 'many'>
  pagination: ZodOptional<typeof PaginationSchema>
}>
