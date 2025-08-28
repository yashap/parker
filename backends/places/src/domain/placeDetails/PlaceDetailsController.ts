import { Controller, HttpStatus, UseGuards } from '@nestjs/common'
import { NotFoundError } from '@parker/errors'
import { AuthGuard, BaseController, Endpoint, HandlerResult, Session, handler } from '@parker/nest-utils'
import { contract as rootContract } from '@parker/places-client'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { GoogleClientCache } from 'src/domain/google/GoogleClientCache'

const contract = rootContract.placeDetails

@Controller()
export class PlaceDetailsController extends BaseController {
  constructor(private readonly googleClientCache: GoogleClientCache) {
    super('PlaceDetails')
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public get(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params }) => {
      const { id } = params

      try {
        const placeDetails = await this.googleClientCache.getPlaceDetails(id)

        return {
          status: HttpStatus.OK,
          body: placeDetails,
        }
      } catch (_error) {
        // If Google API returns an error, throw a NotFoundError
        throw new NotFoundError(`Place with ID ${id} not found`)
      }
    })
  }
}
