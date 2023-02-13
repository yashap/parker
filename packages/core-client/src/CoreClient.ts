import { AxiosConfig, AxiosInstanceBuilder } from '@parker/axios-utils'
import { isNotFoundError } from '@parker/errors'
import { AxiosInstance, AxiosPromise } from 'axios'
import {
  Configuration,
  CreateParkingSpotRequestDto,
  CreateUserRequestDto,
  DefaultApiFactory,
  ListParkingSpotsResponseDto,
  ParkingSpotDto,
  UpdateParkingSpotRequestDto,
  UpdateUserRequestDto,
  UserDto,
} from './generated'

export class CoreClient {
  private client

  public constructor(axiosInstance: AxiosInstance) {
    this.client = DefaultApiFactory(
      new Configuration({ baseOptions: { headers: axiosInstance.defaults.headers } }),
      axiosInstance.defaults.baseURL,
      axiosInstance
    )
  }

  public static build(axiosConfig: AxiosConfig): CoreClient {
    const axiosInstance = AxiosInstanceBuilder.build(axiosConfig)
    return new CoreClient(axiosInstance)
  }

  public async deleteParkingSpot(id: string): Promise<void> {
    await this.client.deleteParkingSpotsId(id)
  }

  public async deleteUser(id: string): Promise<void> {
    await this.client.deleteUsersId(id)
  }

  public async listParkingSpotsClosestToPoint(
    latitude: number,
    longitude: number,
    limit: number
  ): Promise<ListParkingSpotsResponseDto> {
    return this.getData(this.client.getParkingSpotsClosestToPoint(latitude, longitude, limit))
  }

  public async getParkingSpot(id: string): Promise<ParkingSpotDto | undefined> {
    return this.getDataOrUndefined(this.client.getParkingSpotsId(id))
  }

  public async getUser(id: string): Promise<UserDto | undefined> {
    return this.getDataOrUndefined(this.client.getUsersId(id))
  }

  public async updateParkingSpot(id: string, update: UpdateParkingSpotRequestDto): Promise<ParkingSpotDto> {
    return this.getData(this.client.patchParkingSpotsId(id, update))
  }

  public async updateUser(id: string, update: UpdateUserRequestDto): Promise<UserDto> {
    return this.getData(this.client.patchUsersId(id, update))
  }

  public async createParkingSpot(payload: CreateParkingSpotRequestDto): Promise<ParkingSpotDto> {
    return this.getData(this.client.postParkingSpots(payload))
  }

  public async createUser(payload: CreateUserRequestDto): Promise<UserDto> {
    return this.getData(this.client.postUsers(payload))
  }

  private async getData<T>(response: AxiosPromise<T>): Promise<T> {
    const { data } = await response
    return data
  }

  private async getDataOrUndefined<T>(response: AxiosPromise<T>): Promise<T | undefined> {
    try {
      return this.getData(response)
    } catch (error) {
      if (isNotFoundError(error)) {
        return undefined
      }
      throw error
    }
  }
}
