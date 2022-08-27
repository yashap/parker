import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { BaseController } from '../../util/BaseController'
import { CreateParkingSpotDto, ParkingSpotDto, UpdateParkingSpotDto } from './ParkingSpotDto'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Controller('parkingSpots')
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Post()
  public async create(@Body() createParkingSpotDto: CreateParkingSpotDto): Promise<ParkingSpotDto> {
    const parkingSpot = await this.parkingSpotRepository.create(createParkingSpotDto)
    return ParkingSpotDto.buildFromDomain(parkingSpot)
  }

  @Get()
  public async findAll(): Promise<ParkingSpotDto[]> {
    const parkingSpots = await this.parkingSpotRepository.findAll()
    return parkingSpots.map(ParkingSpotDto.buildFromDomain)
  }

  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ParkingSpotDto> {
    const parkingSpot = this.require(await this.parkingSpotRepository.findById(id))
    return ParkingSpotDto.buildFromDomain(parkingSpot)
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotDto
  ): Promise<ParkingSpotDto> {
    // TODO: in a transaction
    const currentParkingSpot = this.require(await this.parkingSpotRepository.findById(id))
    const parkingSpot = {
      ...currentParkingSpot,
      ...updateParkingSpotDto,
    }
    const updatedParkingSpot = await this.parkingSpotRepository.replace(parkingSpot)
    return ParkingSpotDto.buildFromDomain(updatedParkingSpot)
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.parkingSpotRepository.delete(id)
  }
}
