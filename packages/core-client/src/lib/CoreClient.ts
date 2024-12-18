import {
  ApiAxiosInstance,
  ApiClient,
  ApiClientBuilder,
  AxiosConfig,
  AxiosInstanceBuilder,
  extractDeleteResponse,
  extractGetByIdResponse,
  extractListResponse,
  extractPatchResponse,
  extractPostResponse,
} from '@parker/api-client-utils'
import { contract } from './contract'
import {
  CreateParkingSpotBookingRequest,
  CreateParkingSpotRequest,
  ListParkingSpotsClosestToPointRequest,
  ListParkingSpotsClosestToPointResponse,
  ListParkingSpotsRequest,
  ListParkingSpotsResponse,
  ParkingSpotBookingDto,
  ParkingSpotDto,
  UpdateParkingSpotRequest,
} from './model/types'

export class CoreClient {
  private client: ApiClient<typeof contract>

  public constructor(axiosInstance: ApiAxiosInstance) {
    this.client = ApiClientBuilder.build(contract, axiosInstance)
  }

  public static build(axiosConfig: AxiosConfig): CoreClient {
    return new CoreClient(AxiosInstanceBuilder.build(axiosConfig))
  }

  public readonly parkingSpots = {
    list: (request: ListParkingSpotsRequest): Promise<ListParkingSpotsResponse> => {
      return extractListResponse(this.client.parkingSpots.list({ query: request }))
    },
    listClosestToPoint: (
      request: ListParkingSpotsClosestToPointRequest
    ): Promise<ListParkingSpotsClosestToPointResponse> => {
      return extractListResponse(this.client.parkingSpots.listClosestToPoint({ query: request }))
    },
    create: (request: CreateParkingSpotRequest): Promise<ParkingSpotDto> => {
      return extractPostResponse(this.client.parkingSpots.post({ body: request }))
    },
    get: (id: string): Promise<ParkingSpotDto | undefined> => {
      return extractGetByIdResponse(this.client.parkingSpots.get({ params: { id } }))
    },
    update: (id: string, request: UpdateParkingSpotRequest): Promise<ParkingSpotDto> => {
      return extractPatchResponse(this.client.parkingSpots.patch({ params: { id }, body: request }))
    },
    delete: (id: string): Promise<void> => {
      return extractDeleteResponse(this.client.parkingSpots.delete({ params: { id } }))
    },
  }

  public readonly parkingSpotBookings = {
    create: (parkingSpotId: string, request: CreateParkingSpotBookingRequest): Promise<ParkingSpotBookingDto> => {
      return extractPostResponse(this.client.parkingSpotBookings.post({ params: { parkingSpotId }, body: request }))
    },
  }
}
