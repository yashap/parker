import { Injectable } from '@nestjs/common'
import { ParkingSpot as PrismaParkingSpot } from '@prisma/client'
import { BaseRepository } from '../../db/BaseRepository'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpotProps, 'id'>
type UpdateParkingSpotInput = Partial<CreateParkingSpotInput>

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const prismaParkingSpot = await this.parkingSpot.create({ data: payload })
    return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot)
  }

  public async findAll(): Promise<ParkingSpot[]> {
    const prismaParkingSpots = await this.parkingSpot.findMany()
    return prismaParkingSpots.map(ParkingSpotRepository.parkingSpotToDomain)
  }

  public async findById(id: string): Promise<ParkingSpot | undefined> {
    const prismaParkingSpot = await this.parkingSpot.findUnique({ where: { id } })
    if (prismaParkingSpot === null) {
      return undefined
    }
    return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot)
  }

  public async update(id: string, updates: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const prismaParkingSpot = await this.parkingSpot.update({ where: { id }, data: updates })
    return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot)
  }

  public async delete(id: string): Promise<void> {
    await this.parkingSpot.delete({ where: { id } })
  }

  private static parkingSpotToDomain(prismaParkingSpot: PrismaParkingSpot): ParkingSpot {
    return new ParkingSpot(prismaParkingSpot)
  }
}
