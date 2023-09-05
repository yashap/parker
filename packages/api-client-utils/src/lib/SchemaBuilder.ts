import { z, ZodTypeAny } from 'zod'
import { PaginatedResponseSchema, PaginationSchema } from './Pagination'

export class SchemaBuilder {
  public static buildListResponse<T extends ZodTypeAny>(itemSchema: T): PaginatedResponseSchema<T> {
    return z.object({
      data: z.array(itemSchema),
      pagination: PaginationSchema.optional(),
    })
  }
}
