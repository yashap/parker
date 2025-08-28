import { Controller, UseGuards } from '@nestjs/common'
import { InternalServerError } from '@parker/errors'
import { AuthGuard, BaseController, Endpoint, HandlerResult, Session, handler } from '@parker/nest-utils'
import { contract as rootContract } from '@parker/places-client'
import { SessionContainer } from 'supertokens-node/recipe/session'

const contract = rootContract.placeSuggestions

@Controller()
export class PlaceSuggestionsController extends BaseController {
  // TODO: constructor should take something like:
  // private readonly googleClientCache: GoogleClientCache
  constructor() {
    super('PlaceSuggestion')
  }

  @Endpoint(contract.search)
  @UseGuards(new AuthGuard())
  public search(@Session() _session: SessionContainer): HandlerResult<typeof contract.search> {
    return handler(contract.search, async ({ query }) => {
      const { search, location, language, useStrictBounds, radius, limit } = query
      console.log({ search, location, language, useStrictBounds, radius, limit })
      throw new InternalServerError('Not implemented, TODO!')
      // TODO: instead, return status OK with the appropriate body
    })
  }
}
