import { Controller, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard, BaseController, Endpoint, HandlerResult, Session, handler } from '@parker/nest-utils'
import { contract as rootContract } from '@parker/places-client'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { GoogleClientCache } from 'src/domain/google/GoogleClientCache'

const contract = rootContract.placeSuggestions

@Controller()
export class PlaceSuggestionsController extends BaseController {
  constructor(private readonly googleClientCache: GoogleClientCache) {
    super('PlaceSuggestion')
  }

  @Endpoint(contract.search)
  @UseGuards(new AuthGuard())
  public search(@Session() _session: SessionContainer): HandlerResult<typeof contract.search> {
    return handler(contract.search, async ({ query }) => {
      const { search, latitude, longitude, language, useStrictBounds, radius, limit } = query

      const suggestions = await this.googleClientCache.getPlaceSuggestions({
        search,
        location: latitude !== undefined && longitude !== undefined ? { latitude, longitude } : undefined,
        language,
        useStrictBounds,
        radius,
        limit,
      })

      return {
        status: HttpStatus.OK,
        body: {
          data: suggestions,
        },
      }
    })
  }
}
