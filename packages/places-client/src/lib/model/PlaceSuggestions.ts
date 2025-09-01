import { z } from 'zod'

export const PlaceSuggestionSchema = z.object({
  placeId: z.string(),
  label: z.string(),
  subLabel: z.string(),
})

export const SearchPlaceSuggestionsRequestSchema = z.object({
  search: z.string(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  language: z.string().optional(),
  useStrictBounds: z.coerce.boolean().optional(),
  radius: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
})

export const SearchPlaceSuggestionsResponseSchema = z.object({
  data: z.array(PlaceSuggestionSchema),
})
