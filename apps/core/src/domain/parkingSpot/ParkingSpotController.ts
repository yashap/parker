import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common'
import { BaseController } from '../../http/BaseController'
import { CreateParkingSpotDto, ParkingSpotDto, UpdateParkingSpotDto } from './ParkingSpotDto'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Controller('parkingSpots')
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Post()
  public async create(@Body() createParkingSpotDto: CreateParkingSpotDto): Promise<ParkingSpotDto> {
    const parkingSpot = await this.parkingSpotRepository.create({ ...createParkingSpotDto })
    return ParkingSpotDto.buildFromDomain(parkingSpot)
  }

  @Get(':id')
  public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<ParkingSpotDto> {
    const parkingSpot = this.getEntityOrNotFound(await this.parkingSpotRepository.getById(id))
    return ParkingSpotDto.buildFromDomain(parkingSpot)
  }

  @Get('closestToPoint')
  public async getClosestToPoint(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('count') count: number
  ): Promise<ParkingSpotDto[]> {
    const parkingSpots = await this.parkingSpotRepository.getParkingSpotsClosestToLocation(
      { longitude, latitude },
      count
    )
    return parkingSpots.map(ParkingSpotDto.buildFromDomain)
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotDto
  ): Promise<ParkingSpotDto> {
    const updatedParkingSpot = await this.parkingSpotRepository.update(id, { ...updateParkingSpotDto })
    return ParkingSpotDto.buildFromDomain(updatedParkingSpot)
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.parkingSpotRepository.delete(id)
  }
}
