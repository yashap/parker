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
  CreateParkingSpotRequest,
  CreateUserRequest,
  ListParkingSpotsClosestToPointRequest,
  ListParkingSpotsClosestToPointResponse,
  ParkingSpotDto,
  UpdateParkingSpotRequest,
  UpdateUserRequest,
  UserDto,
} from './model'

export class CoreClient {
  private client: ApiClient<typeof contract>

  public constructor(axiosInstance: ApiAxiosInstance) {
    this.client = ApiClientBuilder.build(contract, axiosInstance)
  }

  public static build(axiosConfig: AxiosConfig): CoreClient {
    return new CoreClient(AxiosInstanceBuilder.build(axiosConfig))
  }

  public readonly parkingSpots = {
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

  public readonly users = {
    create: (request: CreateUserRequest): Promise<UserDto> => {
      return extractPostResponse(this.client.users.post({ body: request }))
    },
    get: (id: string): Promise<UserDto | undefined> => {
      return extractGetByIdResponse(this.client.users.get({ params: { id } }))
    },
    update: (id: string, request: UpdateUserRequest): Promise<UserDto> => {
      return extractPatchResponse(this.client.users.patch({ params: { id }, body: request }))
    },
    delete: (id: string): Promise<void> => {
      return extractDeleteResponse(this.client.users.delete({ params: { id } }))
    },
  }
}
