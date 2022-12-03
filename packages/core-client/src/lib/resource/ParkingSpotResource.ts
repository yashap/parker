import { Point } from '@parker/geography'
import { AxiosInstance } from 'axios'
import { CreateParkingSpotDto, ParkingSpotDto, UpdateParkingSpotDto } from '../dto'

export class ParkingSpotResource {
  private readonly basePath: string = '/core/parkingSpots'

  constructor(private readonly axiosInstance: AxiosInstance) {}

  public async delete(id: string): Promise<void> {
    await this.axiosInstance.delete(`${this.basePath}/${id}`)
  }

  public async get(id: string): Promise<ParkingSpotDto | undefined> {
    const parkingSpot = await this.axiosInstance.get<ParkingSpotDto>(`${this.basePath}/${id}`)
    return parkingSpot.data
  }

  public async listClosestToPoint(point: Point, count: number): Promise<ParkingSpotDto> {
    const parkingSpot = await this.axiosInstance.get<ParkingSpotDto>(`${this.basePath}/closestToPoint`, {
      params: {
        latitude: point.latitude,
        longitude: point.longitude,
        count,
      },
    })
    return parkingSpot.data
  }

  public async patch(updateParkingSpotPayload: UpdateParkingSpotDto): Promise<ParkingSpotDto> {
    const parkingSpot = await this.axiosInstance.patch<ParkingSpotDto>(this.basePath, updateParkingSpotPayload)
    return parkingSpot.data
  }

  public async post(createParkingSpotPayload: CreateParkingSpotDto): Promise<ParkingSpotDto> {
    const parkingSpot = await this.axiosInstance.post<ParkingSpotDto>(this.basePath, createParkingSpotPayload)
    return parkingSpot.data
  }
}
