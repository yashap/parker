import { z } from 'zod'
import { AddressComponentsSchema, PlaceDetailsSchema } from './PlaceDetails'
import {
  PlaceSuggestionSchema,
  SearchPlaceSuggestionsRequestSchema,
  SearchPlaceSuggestionsResponseSchema,
} from './PlaceSuggestions'

// Requests
export type SearchPlaceSuggestionsRequest = z.infer<typeof SearchPlaceSuggestionsRequestSchema>

// Responses
export type SearchPlaceSuggestionsResponse = z.infer<typeof SearchPlaceSuggestionsResponseSchema>

// Data Models
export type AddressComponentsDto = z.infer<typeof AddressComponentsSchema>
export type PlaceSuggestionDto = z.infer<typeof PlaceSuggestionSchema>
export type PlaceDetailsDto = z.infer<typeof PlaceDetailsSchema>
