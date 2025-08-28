import { CoercedPointSchema } from '@parker/api-client-utils'
import { z } from 'zod'

export const PlaceSuggestionSchema = z.object({
  placeId: z.string().uuid(),
  label: z.string(),
  subLabel: z.string(),
})

export const SearchPlaceSuggestionsRequestSchema = z.object({
  search: z.string(),
  location: CoercedPointSchema.optional(),
  language: z.string().optional(),
  useStrictBounds: z.coerce.boolean().optional(),
  radius: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
})

export const SearchPlaceSuggestionsResponseSchema = z.object({
  data: z.array(PlaceSuggestionSchema),
})
