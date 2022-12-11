import { ApiClient, BaseListQueryParams, BaseResource, ListResponse } from '@parker/api-client'
import { Point } from '@parker/geography'
import { CreateParkingSpotDto, ParkingSpotDto, UpdateParkingSpotDto } from '../dto'

export class ParkingSpotResource extends BaseResource<
  ParkingSpotDto,
  BaseListQueryParams,
  CreateParkingSpotDto,
  UpdateParkingSpotDto
> {
  constructor(apiClient: ApiClient) {
    super(apiClient, 'parkingSpots')
  }

  public delete = this.buildDelete()
  public get = this.buildGet()
  public patch = this.buildPatch()
  public post = this.buildPost()

  public async listClosestToPoint(point: Point, limit: number): Promise<ListResponse<ParkingSpotDto>> {
    return this.apiClient.get<ListResponse<ParkingSpotDto>>(`${this.basePath}/closestToPoint`, {
      latitude: point.latitude,
      longitude: point.longitude,
      limit,
    })
  }
}
