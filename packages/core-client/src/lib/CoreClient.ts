import { AxiosInstance } from 'axios'
import { ParkingSpotResource } from './resource/ParkingSpotResource'

export class CoreClient {
  public parkingSpots: ParkingSpotResource

  constructor(axiosInstance: AxiosInstance) {
    this.parkingSpots = new ParkingSpotResource(axiosInstance)
  }
}
