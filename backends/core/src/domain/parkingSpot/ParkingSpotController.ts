import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common'
import { BaseController } from '../../http/BaseController'
import { ParkingSpotRepository } from './ParkingSpotRepository'
import {
  CreateParkingSpotValidatingDto,
  ParkingSpotValidatingDto,
  UpdateParkingSpotValidatingDto,
} from './ParkingSpotValidatingDto'

@Controller('parkingSpots')
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Post()
  public async create(@Body() createParkingSpotDto: CreateParkingSpotValidatingDto): Promise<ParkingSpotValidatingDto> {
    const parkingSpot = await this.parkingSpotRepository.create({ ...createParkingSpotDto })
    return ParkingSpotValidatingDto.buildFromDomain(parkingSpot)
  }

  @Get(':id')
  public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<ParkingSpotValidatingDto> {
    const parkingSpot = this.getEntityOrNotFound(await this.parkingSpotRepository.getById(id))
    return ParkingSpotValidatingDto.buildFromDomain(parkingSpot)
  }

  @Get('closestToPoint')
  public async listClosestToPoint(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('limit') limit: number
  ): Promise<{ data: ParkingSpotValidatingDto[] }> {
    const parkingSpots = await this.parkingSpotRepository.listParkingSpotsClosestToLocation(
      { longitude, latitude },
      limit
    )
    // TODO: proper pagination
    return { data: parkingSpots.map(ParkingSpotValidatingDto.buildFromDomain) }
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotValidatingDto
  ): Promise<ParkingSpotValidatingDto> {
    const updatedParkingSpot = await this.parkingSpotRepository.update(id, { ...updateParkingSpotDto })
    return ParkingSpotValidatingDto.buildFromDomain(updatedParkingSpot)
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.parkingSpotRepository.delete(id)
  }
}
